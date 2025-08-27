// src/lib/moderation.ts
import { CreateStoryRequest } from "@/lib/contracts";

const BLOCKLIST = [
  /suicide|self[-\s]?harm|kill|murder|gun|knife|blood|gore|violence/i,
  /sex|porn|nsfw|adult|explicit|nude|nudity/i,
  /drugs|alcohol|cigarette|vape|weed|cocaine|heroin/i,
  /politics|election|campaign|president|prime\s*minister/i,
  /religion|god|allah|jesus|temple|church|mosque/i,
  /brand|marvel|disney|harry\s*potter|pokemon|minecraft|fortnite/i
];

export type SafetyDecision =
  | { allow: true; sanitized: CreateStoryRequest }
  | { allow: false; reason: string };

export function moderateInput(input: CreateStoryRequest): SafetyDecision {
  const clean: CreateStoryRequest = { ...input };

  // Simple brand/copyright sanitization
  clean.setting = clean.setting.replace(/(harry\s*potter|marvel|disney|pokemon|minecraft)/gi, "a famous story world");
  clean.genre = clean.genre.replace(/(marvel|dc|disney)/gi, "adventure");

  const danger = [clean.moral, clean.setting, clean.genre, clean.ageOrGrade, clean.names.join(", ")]
    .some(text => BLOCKLIST.some(rx => rx.test(text)));

  if (danger) {
    return { allow: false, reason: "Input appears unsafe for a child-oriented story." };
  }
  return { allow: true, sanitized: clean };
}

export const OUTPUT_FORBIDDEN = /(suicide|kill|murder|blood|gore|sex|drug|alcohol|cigarette)/i;

export function moderateOutputText(text: string): boolean {
  return !OUTPUT_FORBIDDEN.test(text);
}
