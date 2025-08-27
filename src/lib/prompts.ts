// src/lib/prompts.ts
import { CreateStoryRequest } from "@/lib/contracts";

export const SYSTEM_PROMPT = `
You are "CozyQuill", a gentle children's author.
Write wholesome, imaginative, age-appropriate stories with simple vocabulary.
Never include violence, horror, adult themes, politics, brands, religions, medical advice,
or copyrighted worlds/characters. Keep tone warm, uplifting, and safe for ages 4–11.
Use a clear arc: Introduction → Adventure/Challenge → Resolution → Moral.
Return ONLY valid JSON following the schema the user provides.
`;

export function userPrompt(input: CreateStoryRequest) {
  return `
Create a children's bedtime story with these details:

- Child names: ${input.names.join(", ")}
- Age/grade: ${input.ageOrGrade}
- Genre: ${input.genre}
- Setting: ${input.setting}
- Theme/Moral: ${input.moral}
- Reading level: ${input.readingLevel} (K-1 | G2-3 | G4-5)
- Word count target: ${input.wordCount}

Requirements:
- Warm, kid-safe tone. No scary elements.
- ${input.readingLevel} vocabulary and sentence length.
- 2–5 chapters. Each chapter 150–300 words for K-1/G2-3; up to 400 for G4-5.
- Weave the child's name(s) naturally.
- End with a single-sentence moral.

Return JSON ONLY in this shape:
{
  "title": "string",
  "reading_level": "K-1" | "G2-3" | "G4-5",
  "chapters": [
    { "heading": "string", "text": "string (150-400 words)" }
  ],
  "moral": "string",
  "illustration_prompts": [
    { "chapter_index": 0, "prompt": "storybook ${input.illustrationStyle ?? "watercolor"} illustration, safe, gentle, describes the scene simply"}
  ]
}
`.trim();
}
