// src/app/api/stories/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  CreateStoryRequestSchema,
  StoryJSONSchema,
  type StoryJSON,
  type CreateStoryRequest,
} from "@/lib/contracts";
import { SYSTEM_PROMPT, userPrompt } from "@/lib/prompts";
import { moderateInput, moderateOutputText } from "@/lib/moderation";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function callLLM(input: CreateStoryRequest): Promise<StoryJSON> {
  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.9,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt(input) },
    ],
    response_format: { type: "json_object" },
  });

  const content = resp.choices[0]?.message?.content ?? "{}";
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    const fix = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: "You return strictly valid JSON only, no prose." },
        { role: "user", content: `Fix this into valid JSON that matches the schema: ${content}` },
      ],
      response_format: { type: "json_object" },
    });
    parsed = JSON.parse(fix.choices[0]?.message?.content ?? "{}");
  }

  const story = StoryJSONSchema.parse(parsed);

  // Output moderation (simple keyword check)
  const allText = [story.title, story.moral, ...story.chapters.map(c => c.text)].join("\n");
  if (!moderateOutputText(allText)) {
    story.moral = "Be kind, be brave, and help others.";
    story.chapters = story.chapters.map((c) => ({
      ...c,
      text: c.text.replace(/(kill|murder|blood|gore|weapon)/gi, "be unkind"),
    }));
  }

  return story;
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY. Add it to .env.local and restart the server." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const parsed = CreateStoryRequestSchema.parse(body);

    const decision = moderateInput(parsed);
    if (!decision.allow) {
      return NextResponse.json(
        { error: "The prompt looks unsafe for a children's story. Please try a gentler idea." },
        { status: 400 }
      );
    }

    const story = await callLLM(decision.sanitized);
    return NextResponse.json({ story });
  } catch (err: any) {
    console.error("Story generation error:", err);
    const message =
      err?.issues?.[0]?.message || err?.message || "Failed to generate story";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
