import type { LogParserResult, ErrorType } from '../types';

/**
 * Parse logs and extract error information
 */
export function parseLogForErrors(logs: string): LogParserResult {
  
  const lines = logs.split('\n');
  
  // Detect error type first
  const errorType = detectErrorType(logs);
  
  // Find error lines
  const errorLines = findErrorLines(lines);
  
  // Extract stack trace
  const stackTrace = extractStackTrace(lines, errorLines);
  
  // Find error context (lines around the error)
  const errorContext = extractErrorContext(lines, errorLines, 20);
  
  // Extract affected file paths
  const affectedFiles = extractFileReferences(errorContext);
  
  return {
    errorLines,
    errorContext,
    stackTrace,
    affectedFiles,
    errorType
  };
}

/**
 * Detect the type of error from log patterns
 */
function detectErrorType(logs: string): ErrorType {
  
  // RENAME to avoid variable shadowing
  const ERROR_DEFINITIONS: Array<{ type: ErrorType; patterns: RegExp[] }> = [
    {
      type: 'test-failure',
      patterns: [
        /FAIL:|FAILED:/i,
        /Test.*failed/i,
        /AssertionError/,
        /jest.*FAIL/i,
        /pytest.*FAILED/i,
        /phpunit.*FAILURES/i,
        /\d+ failing/i
      ]
    },
    {
      type: 'build-error',
      patterns: [
        /BUILD FAILED/i,
        /build.*error/i,
        /compilation failed/i,
        /webpack.*error/i,
        /gradle.*failed/i,
        /maven.*failed/i
      ]
    },
    {
      type: 'compilation-error',
      patterns: [
        /SyntaxError/,
        /ParseError/,
        /compilation error/i,
        /cannot find symbol/i,
        /undeclared identifier/i,
        /expected.*got/i
      ]
    },
    {
      type: 'lint-error',
      patterns: [
        /ESLint/i,
        /pylint/i,
        /rubocop/i,
        /phpcs/i,
        /\d+ error.*\d+ warning/i
      ]
    },
    {
      type: 'dependency-error',
      patterns: [
        /cannot find module/i,
        /modulenotfounderror/i,
        /no matching distribution/i,
        /could not resolve/i,
        /npm ERR!/,
        /pip.*error/i,
        /gem.*error/i,
        /composer.*error/i
      ]
    },
    {
      type: 'runtime-error',
      patterns: [
        /RuntimeError/,
        /TypeError/,
        /ReferenceError/,
        /undefined is not/i,
        /cannot read property/i,
        /null pointer/i
      ]
    },
    {
      type: 'timeout-error',
      patterns: [
        /timeout/i,
        /timed out/i,
        /exceeded.*time/i
      ]
    }
  ];
  
  for (const { type, patterns } of ERROR_DEFINITIONS) {
    for (const pattern of patterns) {
      if (pattern.test(logs)) {
        return type;
      }
    }
  }
  
  return 'unknown';
}

/**
 * Find lines that contain error messages
 */
function findErrorLines(lines: string[]): string[] {
  
  const errorPatterns = [
    /error:/i,
    /exception:/i,
    /fail(ed)?:/i,
    /✗|✘|❌/,
    /^\s*at /,  // Stack trace lines
    /SyntaxError|TypeError|ReferenceError|AssertionError/,
    /ENOENT|EACCES|ECONNREFUSED/,
    /npm ERR!/,
    /fatal:/i
  ];
  
  const errorLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (const pattern of errorPatterns) {
      if (pattern.test(line)) {
        errorLines.push(line);
        break;
      }
    }
  }
  
  return errorLines;
}

/**
 * Extract stack trace from logs
 */
function extractStackTrace(lines: string[], errorLines: string[]): string[] {
  
  const stackTrace: string[] = [];
  
  // Find the first error line index
  const firstErrorIndex = errorLines.length > 0 
    ? lines.indexOf(errorLines[0])
    : -1;
  
  if (firstErrorIndex === -1) {
    return stackTrace;
  }
  
  // Look for stack trace patterns after the error
  const stackTracePatterns = [
    /^\s+at /,           // JavaScript/TypeScript
    /^\s+File ".*", line \d+/,  // Python
    /^\s+.*\.java:\d+/,  // Java
    /^\s+from /,         // Ruby
    /^\s+#\d+/           // PHP
  ];
  
  for (let i = firstErrorIndex; i < Math.min(firstErrorIndex + 30, lines.length); i++) {
    const line = lines[i];
    
    for (const pattern of stackTracePatterns) {
      if (pattern.test(line)) {
        stackTrace.push(line);
        break;
      }
    }
  }
  
  return stackTrace;
}

/**
 * Extract context lines around errors
 */
function extractErrorContext(
  lines: string[], 
  errorLines: string[], 
  contextSize: number = 20
): string[] {
  
  if (errorLines.length === 0) {
    // No specific errors found, return last N lines
    return lines.slice(-contextSize);
  }
  
  const contextLines = new Set<string>();
  
  for (const errorLine of errorLines) {
    const index = lines.indexOf(errorLine);
    if (index === -1) continue;
    
    // Add lines before and after the error
    const start = Math.max(0, index - contextSize / 2);
    const end = Math.min(lines.length, index + contextSize / 2);
    
    for (let i = start; i < end; i++) {
      contextLines.add(lines[i]);
    }
  }
  
  return Array.from(contextLines);
}

/**
 * Extract file paths from error messages
 */
export function extractFileReferences(lines: string[]): string[] {
  
  const filePaths = new Set<string>();
  
  const filePatterns = [
    // JavaScript/TypeScript: at Object.<anonymous> (/path/to/file.js:10:5)
    /\(([^)]+\.(js|ts|jsx|tsx|mjs)):\d+:\d+\)/,
    // Python: File "/path/to/file.py", line 10
    /File "([^"]+\.py)", line \d+/,
    // Java: at com.example.MyClass.method(MyClass.java:10)
    /at .+\(([^)]+\.java):\d+\)/,
    // Generic: /path/to/file.ext
    /\/[\w\-./]+\.(js|ts|py|java|rb|php|go|rs|cpp|c|h|swift|kt|cs)/,
    // Windows paths: C:\path\to\file.ext
    /[A-Z]:\\[\w\-\\]+\.(js|ts|py|java|rb|php|go|rs|cpp|c|h|swift|kt|cs)/,
    // Relative paths: ./src/file.js or src/file.js
    /\.?\/?\w+\/[\w\-./]+\.(js|ts|py|java|rb|php|go|rs|cpp|c|h|swift|kt|cs)/
  ];
  
  for (const line of lines) {
    for (const pattern of filePatterns) {
      const match = line.match(pattern);
      if (match) {
        let filePath = match[1] || match[0];
        // Clean up the path
        filePath = filePath.replace(/^.*\/node_modules\//, ''); // Remove node_modules prefix
        filePath = filePath.replace(/^\(/, '').replace(/\)$/, ''); // Remove parentheses
        filePath = filePath.trim();
        
        if (filePath && !filePath.includes('node_modules')) {
          filePaths.add(filePath);
        }
      }
    }
  }
  
  return Array.from(filePaths).slice(0, 10); // Limit to 10 files
}