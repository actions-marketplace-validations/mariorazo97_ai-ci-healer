import type { LogParserResult } from '../types';
/**
 * Parse logs and extract error information
 */
export declare function parseLogForErrors(logs: string): LogParserResult;
/**
 * Extract file paths from error messages
 */
export declare function extractFileReferences(lines: string[]): string[];
//# sourceMappingURL=log-parser.d.ts.map