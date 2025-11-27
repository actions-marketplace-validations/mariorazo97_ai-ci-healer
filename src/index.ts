import * as core from '@actions/core';
import * as github from '@actions/github';
import { analyzeFailure } from './analyzer';
import { getLLMResponse } from './llm-router';
import { postComment } from './github-poster';
import { getActionConfig } from './utils/config';
import { fetchWorkflowLogs, getFailedWorkflowRun } from './utils/github-api';
import type { ActionConfig } from './types';

async function run(): Promise<void> {
  try {
    core.info('🔧 AI CI Healer starting...');

    // 1. Get configuration
    const config: ActionConfig = getActionConfig();
    
    // 2. Initialize GitHub API client
    const octokit = github.getOctokit(config.githubToken);
    
    // 3. Get the failed workflow run information
    core.info('📋 Fetching failed workflow information...');
    const workflowRun = await getFailedWorkflowRun(octokit);
    
    if (!workflowRun) {
      core.warning('⚠️  No failed workflow found. This action should run on failure.');
      return;
    }
    
    core.info(`Found failed workflow: ${workflowRun.name} (Run #${workflowRun.run_number})`);
    
    // 4. Fetch the workflow logs
    core.info('📥 Downloading workflow logs...');
    const logs = await fetchWorkflowLogs(octokit, workflowRun.id, config.maxLogLines);
    
    if (!logs || logs.trim().length === 0) {
      core.setFailed('Could not retrieve workflow logs');
      return;
    }
    
    core.info(`Retrieved ${logs.split('\n').length} lines of logs`);
    
    // 5. Analyze the failure
    core.info('🔍 Analyzing failure...');
    const analysis = await analyzeFailure(logs, octokit, config);
    
    core.info(`Detected error type: ${analysis.errorType}`);
    
    // 6. Get AI suggestion
    core.info(`🤖 Consulting ${config.llmProvider.toUpperCase()} AI...`);
    const llmResponse = await getLLMResponse(analysis, config);
    
    if (!llmResponse.success || !llmResponse.suggestion) {
      core.setFailed(`Failed to get AI suggestion: ${llmResponse.error}`);
      return;
    }
    
    const suggestion = llmResponse.suggestion;
    
    // Check confidence threshold
    if (suggestion.confidence < config.confidenceThreshold) {
      core.warning(`Confidence ${suggestion.confidence}% is below threshold. Skipping.`);
      return;
    }
    
    // 7. Post the comment (If enabled)
    if (config.enableComments) {
      core.info('💬 Posting AI suggestion to GitHub...');
      await postComment(octokit, suggestion, analysis, llmResponse.provider);
    }
    
    // 8. Set outputs
    core.setOutput('suggestion', suggestion.fix);
    core.setOutput('confidence', suggestion.confidence.toString());
    core.setOutput('error-type', analysis.errorType);
    
    core.info('✅ AI CI Healer completed successfully!');
    
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Action failed: ${error.message}`);
    } else {
      core.setFailed('Action failed with unknown error');
    }
  }
}

run();