import { Agent } from "@mastra/core/agent";
import { anthropic } from "@ai-sdk/anthropic";
import { courseSearchTool } from "../tools/rag-tool";

/**
 * Course Q&A Agent
 *
 * Uses Claude to answer questions about course materials.
 * Automatically searches the vector store and cites which PDF(s)
 * the answer came from.
 */
export const ragAgent = new Agent({
  name: "Course QA Agent",
  model: anthropic("claude-sonnet-4-20250514"),
  instructions: `You are a helpful course study assistant. Your job is to answer questions 
about course materials using the search tool provided to you.

IMPORTANT RULES:
1. ALWAYS use the course-search-tool to find relevant information before answering.
2. Base your answers ONLY on the retrieved context. Do not make up information.
3. After answering, ALWAYS cite your source(s) by listing which PDF file(s) the information came from.
   Look at the "source" field in the metadata of each result to find the PDF filename.
   Format sources like: **Sources:** filename1.pdf, filename2.pdf
4. If the search returns no relevant results, say so honestly — don't guess.
5. If the question is ambiguous, ask for clarification.
6. Provide clear, concise answers suitable for studying.
`,
  tools: {
    courseSearchTool,
  },
});