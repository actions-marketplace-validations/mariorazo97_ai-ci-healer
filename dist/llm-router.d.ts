import type { FailureAnalysis, LLMResponse, ActionConfig } from './types';
/**
 * Main LLM router - tries primary provider with fallback options
 */
export declare function getLLMResponse(analysis: FailureAnalysis, config: ActionConfig): Promise<LLMResponse>;
