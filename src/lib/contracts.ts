import { z } from "zod";

export const CreateStoryRequestSchema = z.object({
  names: z.array(z.string()).min(1, "At least one name"),
  ageOrGrade: z.string().min(1),
  genre: z.string().min(1),
  setting: z.string().min(1),
  moral: z.string().min(1),
  readingLevel: z.enum(["K-1","G2-3","G4-5"]),
  wordCount: z.number().min(400).max(1500),
  illustrationStyle: z.enum(["watercolor","crayon","cartoon","vector"]).optional()
});

export type CreateStoryRequest = z.infer<typeof CreateStoryRequestSchema>;

export const ChapterSchema = z.object({
  heading: z.string(),
  text: z.string()
});

export const StoryJSONSchema = z.object({
  title: z.string(),
  reading_level: z.enum(["K-1","G2-3","G4-5"]),
  chapters: z.array(ChapterSchema).min(2).max(5),
  moral: z.string(),
  illustration_prompts: z.array(z.object({
    chapter_index: z.number().int().nonnegative(),
    prompt: z.string()
  }))
});

export type StoryJSON = z.infer<typeof StoryJSONSchema>;
