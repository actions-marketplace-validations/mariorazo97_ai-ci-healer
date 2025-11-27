import * as core from '@actions/core';
import type { 
  FailureAnalysis, 
  LLMResponse, 
  SuggestionResponse, 
  ActionConfig,
  LLMProvider 
} from './types';
import { buildPrompt, SYSTEM_PROMPT } from './prompt-builder';

/**
 * Main LLM router - tries primary provider with fallback options
 */
export async function getLLMResponse(
  analysis: FailureAnalysis,
  config: ActionConfig
): Promise<LLMResponse> {
  
  const provider = config.llmProvider;
  
  try {
    core.info(`Attempting ${provider} as primary provider...`);
    
    switch (provider) {
      case 'groq':
        if (!config.groqApiKey) {
          throw new Error('Groq API key not provided');
        }
        return await queryGroq(analysis, config);
      
      case 'gemini':
        if (!config.geminiApiKey) {
          throw new Error('Gemini API key not provided');
        }
        return await queryGemini(analysis, config);
      
      case 'ollama':
        if (!config.ollamaEndpoint) {
          throw new Error('Ollama endpoint not provided');
        }
        return await queryOllama(analysis, config);
      
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
    
  } catch (error) {
    core.warning(`Primary provider ${provider} failed: ${error}`);
    
    // Try fallback
    return await queryWithFallback(analysis, config, provider);
  }
}

/**
 * Fallback logic - tries alternative providers
 */
async function queryWithFallback(
  analysis: FailureAnalysis,
  config: ActionConfig,
  failedProvider: LLMProvider
): Promise<LLMResponse> {
  
  const fallbackOrder: LLMProvider[] = ['groq', 'gemini', 'ollama'];
  
  // Remove the failed provider from fallback list
  const fallbacks = fallbackOrder.filter(p => p !== failedProvider);
  
  for (const provider of fallbacks) {
    try {
      core.info(`Trying fallback provider: ${provider}...`);
      
      switch (provider) {
        case 'groq':
          if (config.groqApiKey) {
            return await queryGroq(analysis, config);
          }
          break;
        
        case 'gemini':
          if (config.geminiApiKey) {
            return await queryGemini(analysis, config);
          }
          break;
        
        case 'ollama':
          if (config.ollamaEndpoint) {
            return await queryOllama(analysis, config);
          }
          break;
      }
    } catch (error) {
      core.warning(`Fallback ${provider} also failed: ${error}`);
      continue;
    }
  }
  
  return {
    success: false,
    error: 'All LLM providers failed',
    provider: 'none'
  };
}

/**
 * Query Groq API (llama-3.3-70b)
 */
async function queryGroq(
  analysis: FailureAnalysis,
  config: ActionConfig
): Promise<LLMResponse> {
  
  const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions';
  
  const prompt = buildPrompt(analysis, config.customContext);
  
  const response = await fetch(GROQ_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        model: config.model || 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json() as any;
  
  return parseGroqResponse(data);
}

/**
 * Query Google Gemini API
 */
async function queryGemini(
  analysis: FailureAnalysis,
  config: ActionConfig
): Promise<LLMResponse> {
  
  const GEMINI_API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${config.geminiApiKey}`;
  
  const prompt = buildPrompt(analysis, config.customContext);
  
  const response = await fetch(GEMINI_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${SYSTEM_PROMPT}\n\n${prompt}`
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1500,
        responseMimeType: 'application/json'
      }
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json() as any;
  
  return parseGeminiResponse(data);
}

/**
 * Query Ollama (self-hosted)
 */
async function queryOllama(
  analysis: FailureAnalysis,
  config: ActionConfig
): Promise<LLMResponse> {
  
  const endpoint = config.ollamaEndpoint || 'http://localhost:11434';
  const OLLAMA_API = `${endpoint}/api/generate`;
  
  const prompt = buildPrompt(analysis, config.customContext);
  
  const response = await fetch(OLLAMA_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3.2',
      prompt: `${SYSTEM_PROMPT}\n\n${prompt}`,
      stream: false,
      format: 'json',
      options: {
        temperature: 0.3
      }
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json() as any;
  
  return parseOllamaResponse(data);
}

/**
 * Parse Groq API response
 */
function parseGroqResponse(data: any): LLMResponse {
  try {
    const content = data.choices[0].message.content;
    const suggestion: SuggestionResponse = JSON.parse(content);
    
    return {
      success: true,
      suggestion,
      provider: 'groq',
      tokensUsed: data.usage?.total_tokens
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse Groq response: ${error}`,
      provider: 'groq'
    };
  }
}

/**
 * Parse Gemini API response
 */
function parseGeminiResponse(data: any): LLMResponse {
  try {
    const content = data.candidates[0].content.parts[0].text;
    const suggestion: SuggestionResponse = JSON.parse(content);
    
    return {
      success: true,
      suggestion,
      provider: 'gemini',
      tokensUsed: data.usageMetadata?.totalTokenCount
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse Gemini response: ${error}`,
      provider: 'gemini'
    };
  }
}

/**
 * Parse Ollama response
 */
function parseOllamaResponse(data: any): LLMResponse {
  try {
    const content = data.response;
    const suggestion: SuggestionResponse = JSON.parse(content);
    
    return {
      success: true,
      suggestion,
      provider: 'ollama'
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse Ollama response: ${error}`,
      provider: 'ollama'
    };
  }
}