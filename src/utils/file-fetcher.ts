import * as core from '@actions/core';
import * as github from '@actions/github';
import type { GitHubContext, FileContent } from '../types';

/**
 * Fetch relevant file contents from GitHub for AI context
 */
export async function fetchRelevantFiles(
  octokit: ReturnType<typeof github.getOctokit>,
  context: GitHubContext,
  filePaths: string[]
): Promise<FileContent[]> {
  
  const fileContents: FileContent[] = [];
  
  for (const filePath of filePaths) {
    try {
      // Clean up the file path
      const cleanPath = cleanFilePath(filePath);
      
      if (!cleanPath) {
        continue;
      }
      
      core.debug(`Fetching file: ${cleanPath}`);
      
      const response = await octokit.rest.repos.getContent({
        owner: context.owner,
        repo: context.repo,
        path: cleanPath,
        ref: context.commitSha
      });
      
      // Check if it's a file (not a directory)
      if (!('content' in response.data) || Array.isArray(response.data)) {
        core.debug(`${cleanPath} is not a file, skipping`);
        continue;
      }
      
      // Decode the base64 content
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      
      // Get file extension to determine language
      const ext = cleanPath.split('.').pop()?.toLowerCase() || '';
      const language = getLanguageFromExtension(ext);
      
      fileContents.push({
        path: cleanPath,
        content,
        language
      });
      
      core.debug(`Successfully fetched ${cleanPath} (${content.split('\n').length} lines)`);
      
    } catch (error) {
      core.debug(`Could not fetch ${filePath}: ${error}`);
      // Continue with other files
    }
  }
  
  return fileContents;
}

/**
 * Clean up file path from various log formats
 */
function cleanFilePath(path: string): string | null {
  
  // Remove common prefixes and artifacts
  let cleaned = path
    .replace(/^\(/, '')          // Remove leading (
    .replace(/\)$/, '')          // Remove trailing )
    .replace(/:\d+:\d+$/, '')    // Remove :line:col
    .replace(/:\d+$/, '')        // Remove :line
    .trim();
  
  // Remove absolute paths, keep relative
  if (cleaned.startsWith('/')) {
    // Try to find a common project directory indicator
    const indicators = [
      '/src/',
      '/lib/',
      '/app/',
      '/test/',
      '/tests/',
      '/spec/',
      '/dist/',
      '/build/'
    ];
    
    for (const indicator of indicators) {
      const index = cleaned.indexOf(indicator);
      if (index !== -1) {
        cleaned = cleaned.substring(index + 1);
        break;
      }
    }
    
    // If still absolute and no indicator found, try to get filename only
    if (cleaned.startsWith('/')) {
      const parts = cleaned.split('/');
      cleaned = parts[parts.length - 1];
    }
  }
  
  // Remove leading ./
  cleaned = cleaned.replace(/^\.\//, '');
  
  // Validate it looks like a real file path
  if (!cleaned.includes('.') || cleaned.length < 3) {
    return null;
  }
  
  // Don't fetch node_modules or similar
  if (cleaned.includes('node_modules') || 
      cleaned.includes('venv/') || 
      cleaned.includes('vendor/')) {
    return null;
  }
  
  return cleaned;
}

/**
 * Map file extension to language identifier
 */
function getLanguageFromExtension(ext: string): string {
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'java': 'java',
    'kt': 'kotlin',
    'rb': 'ruby',
    'php': 'php',
    'go': 'go',
    'rs': 'rust',
    'cpp': 'cpp',
    'c': 'c',
    'h': 'c',
    'cs': 'csharp',
    'swift': 'swift',
    'dart': 'dart',
    'yaml': 'yaml',
    'yml': 'yaml',
    'json': 'json',
    'xml': 'xml',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sh': 'bash',
    'bash': 'bash',
    'zsh': 'bash',
    'dockerfile': 'dockerfile',
    'makefile': 'makefile'
  };
  
  return languageMap[ext.toLowerCase()] || ext;
}