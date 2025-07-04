import { z } from "zod"

export const exampleSchema = z.object({
  input: z.string().min(1, "Input is required"),
  output: z.string().min(1, "Output is required"),
  explanation: z.string().min(1, "Explanation is required"),
})

export const testCaseSchema = z.object({
  input: z.string().min(1, "Input is required"),
  output: z.string().min(1, "Output is required"),
})

export const codeSnippetSchema = z.object({
  JAVASCRIPT: z.string().min(1, "JavaScript code is required"),
  PYTHON: z.string().min(1, "Python code is required"),
  JAVA: z.string().min(1, "Java code is required"),
})

export const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  examples: z.array(exampleSchema).min(1, "At least one example is required"),
  constraints: z.string().min(1, "Constraints are required"),
  maxInputSize: z.number().min(1),
  expectedTimeComplexity: z.string().min(1, "Time complexity is required"),
  expectedTimeLimit: z.string().optional(),
  expectedMemoryLimit: z.string().optional(),
  testcases: z.array(testCaseSchema).min(1, "At least one test case is required"),
  codeSnippets: codeSnippetSchema,
  referenceSolutions: codeSnippetSchema,
})
