import * as core from '@actions/core';
import * as github from '@actions/github';

/**
 * Get the current failed workflow run
 */
export async function getFailedWorkflowRun(
  octokit: ReturnType<typeof github.getOctokit>
): Promise<any> {
  
  const context = github.context;
  
  try {
    // Get the current workflow run
    const { data: workflowRun } = await octokit.rest.actions.getWorkflowRun({
      owner: context.repo.owner,
      repo: context.repo.repo,
      run_id: context.runId
    });
    
    // Verify it's a failed run
    if (workflowRun.conclusion !== 'failure' && workflowRun.status !== 'completed') {
      core.debug('Workflow is not in failed state');
      return null;
    }
    
    return workflowRun;
    
  } catch (error) {
    core.error(`Failed to fetch workflow run: ${error}`);
    throw error;
  }
}

/**
 * Fetch and concatenate logs from all failed jobs in the workflow
 */
export async function fetchWorkflowLogs(
  octokit: ReturnType<typeof github.getOctokit>,
  runId: number,
  maxLines: number = 500
): Promise<string> {
  
  const context = github.context;
  
  try {
    // Get all jobs for this workflow run
    const { data: jobs } = await octokit.rest.actions.listJobsForWorkflowRun({
      owner: context.repo.owner,
      repo: context.repo.repo,
      run_id: runId
    });
    
    // Filter to failed jobs
    const failedJobs = jobs.jobs.filter(job => 
      job.conclusion === 'failure' || job.status === 'completed' && job.conclusion !== 'success'
    );
    
    if (failedJobs.length === 0) {
      core.warning('No failed jobs found in this workflow run');
      return '';
    }
    
    core.info(`Found ${failedJobs.length} failed job(s)`);
    
    // Fetch logs for each failed job
    const allLogs: string[] = [];
    
    for (const job of failedJobs) {
      try {
        core.debug(`Fetching logs for job: ${job.name}`);
        
        const logResponse = await octokit.rest.actions.downloadJobLogsForWorkflowRun({
          owner: context.repo.owner,
          repo: context.repo.repo,
          job_id: job.id
        });
        
        // The response is a redirect URL, we need to fetch it
        const logUrl = logResponse.url;
        const logText = await fetchLogContent(logUrl);
        
        allLogs.push(`\n=== JOB: ${job.name} ===\n`);
        allLogs.push(logText);
        
      } catch (error) {
        core.warning(`Could not fetch logs for job ${job.name}: ${error}`);
      }
    }
    
    const combinedLogs = allLogs.join('\n');
    
    // Limit the log size
    const lines = combinedLogs.split('\n');
    if (lines.length > maxLines) {
      core.info(`Truncating logs from ${lines.length} to ${maxLines} lines`);
      // Keep the last N lines (errors are usually at the end)
      return lines.slice(-maxLines).join('\n');
    }
    
    return combinedLogs;
    
  } catch (error) {
    core.error(`Failed to fetch workflow logs: ${error}`);
    throw error;
  }
}

/**
 * Fetch log content from a URL
 */
async function fetchLogContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    core.warning(`Failed to fetch log from ${url}: ${error}`);
    return '';
  }
}