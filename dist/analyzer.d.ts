import * as github from '@actions/github';
import type { FailureAnalysis, ActionConfig } from './types';
/**
 * Main analyzer function that processes build logs and extracts failure context
 */
export declare function analyzeFailure(logs: string, octokit: ReturnType<typeof github.getOctokit>, _config: ActionConfig): Promise<FailureAnalysis>;
