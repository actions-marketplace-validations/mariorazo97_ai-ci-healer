import * as core from '@actions/core';
import * as github from '@actions/github';
import type { SuggestionResponse, FailureAnalysis } from './types';

/**
 * Post AI suggestion as a comment on the PR or commit
 */
export async function postComment(
  octokit: ReturnType<typeof github.getOctokit>,
  suggestion: SuggestionResponse,
  analysis: FailureAnalysis,
  provider: string
): Promise<void> {
  
  const context = analysis.context;
  const commentBody = formatComment(suggestion, analysis, provider);
  
  try {
    // If this is a PR, comment on the PR
    if (context.prNumber) {
      await octokit.rest.issues.createComment({
        owner: context.owner,
        repo: context.repo,
        issue_number: context.prNumber,
        body: commentBody
      });
      
      core.info(`✅ Posted comment on PR #${context.prNumber}`);
      
      // Also add a label to the PR (Great feature!)
      try {
        await octokit.rest.issues.addLabels({
          owner: context.owner,
          repo: context.repo,
          issue_number: context.prNumber,
          labels: ['ai-suggested-fix', 'needs-review']
        });
      } catch (error) {
        core.debug(`Could not add labels: ${error}`);
      }
      
    } else {
      // Otherwise, comment on the commit
      await octokit.rest.repos.createCommitComment({
        owner: context.owner,
        repo: context.repo,
        commit_sha: context.commitSha,
        body: commentBody
      });
      
      core.info(`✅ Posted comment on commit ${context.commitSha.substring(0, 7)}`);
    }
    
  } catch (error) {
    core.error(`Failed to post comment: ${error}`);
    throw error;
  }
}

/**
 * Format the comment with markdown styling
 */
function formatComment(
  suggestion: SuggestionResponse,
  analysis: FailureAnalysis,
  provider: string
): string {
  
  const confidenceEmoji = getConfidenceEmoji(suggestion.confidence);
  const errorTypeEmoji = getErrorTypeEmoji(analysis.errorType);
  
  const sections: string[] = [];
  
  // Header
  sections.push('## 🔧 AI CI Healer Analysis\n');
  
  // 1. The Fix (Put the solution first for better UX)
  sections.push('### 💡 Suggested Fix\n');
  sections.push('```' + getLanguageForCodeBlock(analysis.language, suggestion.fix));
  sections.push(suggestion.fix);
  sections.push('```');
  sections.push('');

  // 2. Root Cause
  sections.push('### 🎯 Root Cause\n');
  sections.push(suggestion.rootCause);
  sections.push('');
  
  // 3. The "Viral" Feature: Chain of Thought (Collapsible)
  if (suggestion.analysis_step_by_step) {
    sections.push('<details>');
    sections.push('<summary><strong>🧠 View AI Reasoning (Chain of Thought)</strong></summary>\n');
    sections.push(suggestion.analysis_step_by_step);
    sections.push('\n</details>');
    sections.push('');
  }
  
  // 4. Explanation
  sections.push('### 📝 Explanation\n');
  sections.push(suggestion.explanation);
  sections.push('');
  
  // Additional steps (if any)
  if (suggestion.additionalSteps && suggestion.additionalSteps.length > 0) {
    sections.push('### 📋 Additional Steps\n');
    suggestion.additionalSteps.forEach((step, index) => {
      sections.push(`${index + 1}. ${step}`);
    });
    sections.push('');
  }
  
  // Related docs (if any)
  if (suggestion.relatedDocs && suggestion.relatedDocs.length > 0) {
    sections.push('### 📚 Related Documentation\n');
    suggestion.relatedDocs.forEach(doc => {
      sections.push(`- ${doc}`);
    });
    sections.push('');
  }

  // Footer / Meta Info
  sections.push('---');
  sections.push(`<div align="right">`);
  sections.push(`<sub>Confidence: ${confidenceEmoji} ${suggestion.confidence}% | Provider: ${provider.toUpperCase()} | Error: ${errorTypeEmoji} ${analysis.errorType}</sub>`);
  sections.push(`</div>`);
  
  return sections.join('\n');
}

/**
 * Get emoji based on confidence level
 */
function getConfidenceEmoji(confidence: number): string {
  if (confidence >= 90) return '🟢';
  if (confidence >= 75) return '🟡';
  if (confidence >= 60) return '🟠';
  return '🔴';
}

/**
 * Get emoji based on error type
 */
function getErrorTypeEmoji(errorType: string): string {
  const emojiMap: Record<string, string> = {
    'test-failure': '🧪',
    'build-error': '🔨',
    'lint-error': '📏',
    'dependency-error': '📦',
    'compilation-error': '⚙️',
    'runtime-error': '⚡',
    'timeout-error': '⏰',
    'unknown': '❓'
  };
  
  return emojiMap[errorType] || '❓';
}

/**
 * Get appropriate language identifier for code block
 */
function getLanguageForCodeBlock(language: string, fixContent: string): string {
  // If the fix looks like a shell command, use bash
  if (fixContent.includes('npm') || 
      fixContent.includes('yarn') || 
      fixContent.includes('pip') ||
      fixContent.includes('git') ||
      fixContent.startsWith('$')) {
    return 'bash';
  }
  
  // Map language names to code block identifiers
  const languageMap: Record<string, string> = {
    'javascript': 'javascript',
    'typescript': 'typescript',
    'python': 'python',
    'java': 'java',
    'go': 'go',
    'rust': 'rust',
    'ruby': 'ruby',
    'php': 'php',
    'csharp': 'csharp',
    'cpp': 'cpp',
    'swift': 'swift',
    'kotlin': 'kotlin'
  };
  
  return languageMap[language.toLowerCase()] || '';
}