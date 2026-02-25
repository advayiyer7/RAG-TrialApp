import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { ragTool } from '../tools/rag-tool';

export const weatherAgent = new Agent({
  id: 'weather-agent',
  name: 'Story Agent',
  instructions: `Use rag tool to search the vector store and pull relevant information from the documents when you need to reference source material.

Use the rag tool to query the vector store and pull relevant information from the documents when you need to reference source material.`,
  model: 'openai/gpt-4o',
  tools: { rag: ragTool },
  memory: new Memory(),
});
