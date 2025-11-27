import * as github from '@actions/github';
/**
 * Get the current failed workflow run
 */
export declare function getFailedWorkflowRun(octokit: ReturnType<typeof github.getOctokit>): Promise<any>;
/**
 * Fetch and concatenate logs from all failed jobs in the workflow
 */
export declare function fetchWorkflowLogs(octokit: ReturnType<typeof github.getOctokit>, runId: number, maxLines?: number): Promise<string>;
//# sourceMappingURL=github-api.d.ts.map