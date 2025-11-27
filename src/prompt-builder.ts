import type { FailureAnalysis } from './types';

/**
 * System prompt that defines the AI's role and response format
 */
/**
 * System prompt that defines the AI's role and response format
 */
export const SYSTEM_PROMPT = `You are an expert DevOps engineer and debugging specialist. Your job is to analyze CI/CD build failures and provide actionable fixes.

ANALYSIS GUIDELINES:
1. Identify the ROOT CAUSE of the failure (not just symptoms)
2. Provide the EXACT fix with code, commands, or configuration changes
3. Explain WHY this fix solves the problem
4. Rate your confidence (0-100) based on:
   - Clarity of the error message
   - Familiarity with the tech stack
   - Uniqueness of the error pattern
5. Suggest additional steps if the fix might not be complete

RESPONSE FORMAT (JSON only):
{
  "analysis_step_by_step": "First, I see the error is X. Looking at the code, I see Y...",
  "rootCause": "Clear, concise explanation of what caused the failure",
  "fix": "Exact code, command, or configuration to fix the issue",
  "explanation": "Why this fix works and what it changes",
  "confidence": 85,
  "additionalSteps": ["Optional array of follow-up actions"],
  "relatedDocs": ["Optional array of relevant documentation URLs"]
}

RULES:
- Be concise - developers want solutions, not essays
- Provide copy-paste ready fixes when possible
- If multiple fixes are possible, choose the most common/safest
- Never guess wildly - if confidence is low, say so
- Include file paths and line numbers when relevant
- Consider the language/framework ecosystem conventions

OUTPUT: Return ONLY valid JSON, no markdown formatting, no explanations outside the JSON structure.`;

/**
 * Build the user prompt with all failure context
 */
export function buildPrompt(analysis: FailureAnalysis, customContext: string = ''): string {
  const sections: string[] = [];
  
  // Header
  sections.push('# CI/CD Build Failure Analysis\n');
  
  // Error overview
  sections.push('## Error Overview');
  sections.push(`**Type:** ${analysis.errorType}`);
  sections.push(`**Language:** ${analysis.language}`);
  sections.push(`**Framework:** ${analysis.framework}`);
  sections.push('');
  
  // Main error message
  sections.push('## Error Message');
  sections.push('```');
  sections.push(analysis.errorMessage);
  sections.push('```');
  sections.push('');
  
  // Stack trace (if available)
  if (analysis.stackTrace.length > 0) {
    sections.push('## Stack Trace');
    sections.push('```');
    sections.push(analysis.stackTrace.slice(0, 15).join('\n')); // Limit to 15 lines
    sections.push('```');
    sections.push('');
  }
  
  // Relevant log context
  if (analysis.relevantLogLines.length > 0) {
    sections.push('## Relevant Log Context');
    sections.push('```');
    sections.push(analysis.relevantLogLines.slice(0, 30).join('\n')); // Limit to 30 lines
    sections.push('```');
    sections.push('');
  }
  
  // Affected files
  if (analysis.affectedFiles.length > 0) {
    sections.push('## Affected Files');
    analysis.affectedFiles.forEach(file => {
      sections.push(`- ${file}`);
    });
    sections.push('');
  }
  
  // File contents (if available)
  if (analysis.fileContents && analysis.fileContents.length > 0) {
    sections.push('## File Contents (Context)');
    analysis.fileContents.forEach(file => {
      sections.push(`### ${file.path}`);
      sections.push('```' + file.language);
      // Limit file content to first 100 lines
      const lines = file.content.split('\n').slice(0, 100);
      sections.push(lines.join('\n'));
      if (file.content.split('\n').length > 100) {
        sections.push('... (truncated)');
      }
      sections.push('```');
      sections.push('');
    });
  }
  
  // Dependencies
  if (analysis.dependencies.length > 0) {
    sections.push('## Dependencies');
    sections.push(analysis.dependencies.join(', '));
    sections.push('');
  }
  
  // Repository context
  sections.push('## Repository Context');
  sections.push(`**Repository:** ${analysis.context.repoName}`);
  sections.push(`**Branch:** ${analysis.context.branch}`);
  sections.push(`**Workflow:** ${analysis.context.workflow}`);
  if (analysis.context.prNumber) {
    sections.push(`**Pull Request:** #${analysis.context.prNumber}`);
  }
  sections.push('');
  
  // Custom context (internal docs, common fixes, etc.)
  if (customContext.trim()) {
    sections.push('## Additional Context');
    sections.push(customContext.trim());
    sections.push('');
  }
  
  // Call to action
  sections.push('---');
  sections.push('Analyze this failure and provide the fix in JSON format as specified.');
  
  return sections.join('\n');
}

/**
 * Build a simplified prompt for very large contexts
 */
export function buildSimplifiedPrompt(analysis: FailureAnalysis): string {
  return `
Error Type: ${analysis.errorType}
Language: ${analysis.language}
Framework: ${analysis.framework}

Error Message:
${analysis.errorMessage}

Stack Trace (first 10 lines):
${analysis.stackTrace.slice(0, 10).join('\n')}

Affected Files:
${analysis.affectedFiles.join(', ') || 'Not identified'}

Provide the fix in JSON format.
`.trim();
}