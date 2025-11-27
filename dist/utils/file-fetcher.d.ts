import * as github from '@actions/github';
import type { GitHubContext, FileContent } from '../types';
/**
 * Fetch relevant file contents from GitHub for AI context
 */
export declare function fetchRelevantFiles(octokit: ReturnType<typeof github.getOctokit>, context: GitHubContext, filePaths: string[]): Promise<FileContent[]>;
//# sourceMappingURL=file-fetcher.d.ts.map