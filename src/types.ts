/**
 * Type definitions for AI CI Healer
 */

export interface FailureAnalysis {
    errorType: ErrorType;
    errorMessage: string;
    stackTrace: string[];
    affectedFiles: string[];
    language: string;
    framework: string;
    dependencies: string[];
    context: GitHubContext;
    relevantLogLines: string[];
    fileContents?: FileContent[];
  }
  
  export interface FileContent {
    path: string;
    content: string;
    language: string;
  }
  
  export interface GitHubContext {
    owner: string;
    repo: string;
    repoName: string;
    branch: string;
    commitSha: string;
    runId: number;
    runNumber: number;
    workflow: string;
    job: string;
    prNumber?: number;
    prUrl?: string;
  }
  
  export interface SuggestionResponse {
    rootCause: string;
    fix: string;
    explanation: string;
    confidence: number;
    // 👇 THIS IS THE NEW FIELD FOR THE "CHAIN OF THOUGHT"
    analysis_step_by_step?: string;
    additionalSteps?: string[];
    relatedDocs?: string[];
  }
  
  export interface LLMResponse {
    success: boolean;
    suggestion?: SuggestionResponse;
    error?: string;
    provider: string;
    tokensUsed?: number;
  }
  
  export type ErrorType = 
    | 'test-failure'
    | 'build-error'
    | 'lint-error'
    | 'dependency-error'
    | 'compilation-error'
    | 'runtime-error'
    | 'timeout-error'
    | 'unknown';
  
  export type LLMProvider = 'groq' | 'gemini' | 'ollama';
  
  export interface LLMConfig {
    provider: LLMProvider;
    apiKey?: string;
    endpoint?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
  
  export interface LogParserResult {
    errorLines: string[];
    errorContext: string[];
    stackTrace: string[];
    affectedFiles: string[];
    errorType: ErrorType;
  }
  
  export interface ActionConfig {
    githubToken: string;
    llmProvider: LLMProvider;
    groqApiKey?: string;
    geminiApiKey?: string;
    ollamaEndpoint?: string;
    customContext: string;
    maxLogLines: number;
    confidenceThreshold: number;
    model?: string;         
    enableComments: boolean;
  }