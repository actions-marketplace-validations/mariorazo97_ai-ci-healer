import * as core from '@actions/core';
import type { ActionConfig, LLMProvider } from '../types';

/**
 * Get action configuration from inputs
 */
export function getActionConfig(): ActionConfig {
  
  const githubToken = core.getInput('github-token', { required: true });
  const llmProvider = core.getInput('llm-provider') as LLMProvider || 'groq';
  
  const groqApiKey = core.getInput('YOUR-GROQ-KEY');
  const geminiApiKey = core.getInput('YOUR_GEMINI_KEY');
  const ollamaEndpoint = core.getInput('ollama-endpoint');
  
  // NEW: Parse the specific model (optional)
  const model = core.getInput('model');

  // NEW: Parse the enable-comments flag (safe boolean parsing)
  // core.getBooleanInput handles "true", "True", "TRUE", etc. automatically
  const enableComments = core.getBooleanInput('enable-comments'); 
  
  const customContext = core.getInput('custom-context') || '';
  const maxLogLines = parseInt(core.getInput('max-log-lines') || '500', 10);
  const confidenceThreshold = parseInt(core.getInput('confidence-threshold') || '50', 10);
  
  // Validation
  if (!['groq', 'gemini', 'ollama'].includes(llmProvider)) {
    throw new Error(`Invalid llm-provider: ${llmProvider}. Must be groq, gemini, or ollama`);
  }
  
  if (llmProvider === 'groq' && !groqApiKey) {
    core.warning('Groq selected but no API key provided. Will try fallback providers.');
  }
  
  if (llmProvider === 'gemini' && !geminiApiKey) {
    core.warning('Gemini selected but no API key provided. Will try fallback providers.');
  }
  
  if (llmProvider === 'ollama' && !ollamaEndpoint) {
    core.warning('Ollama selected but no endpoint provided. Using default: http://localhost:11434');
  }
  
  if (maxLogLines < 100 || maxLogLines > 10000) {
    core.warning(`max-log-lines ${maxLogLines} is outside recommended range (100-10000). Using 500.`);
  }
  
  if (confidenceThreshold < 0 || confidenceThreshold > 100) {
    throw new Error(`Invalid confidence-threshold: ${confidenceThreshold}. Must be between 0-100`);
  }
  
  return {
    githubToken,
    llmProvider,
    groqApiKey,
    geminiApiKey,
    ollamaEndpoint,
    customContext,
    maxLogLines: Math.min(Math.max(maxLogLines, 100), 10000),
    confidenceThreshold,
    model,
    enableComments
  };
}