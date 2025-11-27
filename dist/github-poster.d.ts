import * as github from '@actions/github';
import type { SuggestionResponse, FailureAnalysis } from './types';
/**
 * Post AI suggestion as a comment on the PR or commit
 */
export declare function postComment(octokit: ReturnType<typeof github.getOctokit>, suggestion: SuggestionResponse, analysis: FailureAnalysis, provider: string): Promise<void>;
