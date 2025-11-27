import * as core from '@actions/core';
import * as github from '@actions/github';
import type { 
  FailureAnalysis, 
  GitHubContext, 
  ActionConfig,
  FileContent 
} from './types';
import { detectLanguage, detectFramework } from './utils/language-detector';
import { parseLogForErrors } from './utils/log-parser';
import { fetchRelevantFiles } from './utils/file-fetcher';

/**
 * Main analyzer function that processes build logs and extracts failure context
 */
export async function analyzeFailure(
  logs: string,
  octokit: ReturnType<typeof github.getOctokit>,
  _config: ActionConfig
): Promise<FailureAnalysis> {
  
  // Parse the log for error patterns
  const parserResult = parseLogForErrors(logs);
  
  // Detect the language and framework
  const language = detectLanguage(logs, parserResult.affectedFiles);
  const framework = detectFramework(logs, language);
  
  core.info(`Detected language: ${language}`);
  core.info(`Detected framework: ${framework}`);
  
  // Get GitHub context
  const context = getGitHubContext();
  
  // Extract dependencies
  const dependencies = await extractDependencies(octokit, context, language);
  
  // Fetch actual file contents for better context (if files were identified)
  let fileContents: FileContent[] | undefined;
  if (parserResult.affectedFiles.length > 0) {
    try {
      fileContents = await fetchRelevantFiles(
        octokit, 
        context, 
        parserResult.affectedFiles.slice(0, 3) // Limit to first 3 files
      );
    } catch (error) {
      core.warning(`Could not fetch file contents: ${error}`);
    }
  }
  
  const analysis: FailureAnalysis = {
    errorType: parserResult.errorType,
    errorMessage: extractMainErrorMessage(parserResult.errorLines),
    stackTrace: parserResult.stackTrace,
    affectedFiles: parserResult.affectedFiles,
    language,
    framework,
    dependencies,
    context,
    relevantLogLines: parserResult.errorContext,
    fileContents
  };
  
  return analysis;
}

/**
 * Extract the main error message from error lines
 */
function extractMainErrorMessage(errorLines: string[]): string {
  if (errorLines.length === 0) {
    return 'Unknown error - no error message found in logs';
  }
  
  // Common error patterns to prioritize
  const patterns = [
    /error\[.*\]: .+/i,   // Rust
    /fatal error: .+/i,   // C/C++
    /panic: .+/i,         // Go
    /build failed/i,      // Gradle/Maven generic
    /exit code \d+/,      // Generic shell failure
    /Error: (.+)/,
    /Exception: (.+)/,
    /FAIL: (.+)/,
    /FAILED: (.+)/,
    /AssertionError: (.+)/,
    /SyntaxError: (.+)/,
    /TypeError: (.+)/,
    /ReferenceError: (.+)/,
  ];
  
  for (const line of errorLines) {
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }
  }
  
  // If no pattern matched, return the first non-empty error line
  return errorLines.find(line => line.trim().length > 0) || errorLines[0];
}

/**
 * Get GitHub context from the current workflow run
 */
function getGitHubContext(): GitHubContext {
  const context = github.context;
  
  return {
    owner: context.repo.owner,
    repo: context.repo.repo,
    repoName: `${context.repo.owner}/${context.repo.repo}`,
    branch: context.ref.replace('refs/heads/', ''),
    commitSha: context.sha,
    runId: context.runId,
    runNumber: context.runNumber,
    workflow: context.workflow,
    job: context.job,
    prNumber: context.payload.pull_request?.number,
    prUrl: context.payload.pull_request?.html_url
  };
}

/**
 * Extract dependencies from package/requirements/build files
 */
async function extractDependencies(
  octokit: ReturnType<typeof github.getOctokit>,
  context: GitHubContext,
  language: string
): Promise<string[]> {
  
  const dependencyFiles: Record<string, string> = {
    'javascript': 'package.json',
    'typescript': 'package.json',
    'python': 'requirements.txt',
    'java': 'pom.xml',
    'gradle': 'build.gradle',
    'ruby': 'Gemfile',
    'go': 'go.mod',
    'rust': 'Cargo.toml',
    'php': 'composer.json',
    'csharp': 'packages.config'
  };
  
  const depFile = dependencyFiles[language.toLowerCase()];
  if (!depFile) {
    return [];
  }
  
  try {
    const response = await octokit.rest.repos.getContent({
      owner: context.owner,
      repo: context.repo,
      path: depFile,
      ref: context.commitSha
    });
    
    if ('content' in response.data && response.data.content) {
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      return parseDependenciesFromFile(content, language);
    }
  } catch (error) {
    core.debug(`Could not fetch ${depFile}: ${error}`);
  }
  
  return [];
}

/**
 * Parse dependencies from file content based on language
 */
function parseDependenciesFromFile(content: string, language: string): string[] {
  const deps: string[] = [];
  
  try {
    if (language === 'javascript' || language === 'typescript') {
      const pkg = JSON.parse(content);
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies
      };
      deps.push(...Object.keys(allDeps).slice(0, 10)); // Limit to 10
    } else if (language === 'python') {
      // Parse requirements.txt
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const pkgName = trimmed.split(/[=<>]/)[0].trim();
          deps.push(pkgName);
        }
      }
    }
    // Add more parsers for other languages as needed
  } catch (error) {
    core.debug(`Error parsing dependencies: ${error}`);
  }
  
  return deps.slice(0, 15); // Limit total to 15
}