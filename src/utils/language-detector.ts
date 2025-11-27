/**
 * Detect programming language from logs and file patterns
 */
export function detectLanguage(logs: string, affectedFiles: string[] = []): string {
  
    // Check file extensions first (most reliable)
    for (const file of affectedFiles) {
      const ext = file.split('.').pop()?.toLowerCase();
      
      const extMap: Record<string, string> = {
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
        'cs': 'csharp',
        'swift': 'swift',
        'dart': 'dart',
        'm': 'objective-c'
      };
      
      if (ext && extMap[ext]) {
        return extMap[ext];
      }
    }
    
    // Fallback to log pattern detection
    const LANGUAGE_DEFINITIONS: Array<{ language: string; patterns: RegExp[] }> = [
      {
        language: 'typescript',
        patterns: [/tsc\s/, /\.tsx?/, /typescript/i, /ts-node/]
      },
      {
        language: 'javascript',
        patterns: [/node\.js/i, /npm\s/, /yarn\s/, /\.jsx?/, /webpack/, /jest/]
      },
      {
        language: 'python',
        patterns: [/python/i, /pip\s/, /\.py/, /pytest/, /django/, /flask/]
      },
      {
        language: 'java',
        patterns: [/\.java/, /gradle/, /maven/, /junit/]
      },
      {
        language: 'go',
        patterns: [/go build/i, /\.go/, /go test/i]
      },
      {
        language: 'rust',
        patterns: [/cargo/i, /\.rs/, /rustc/]
      },
      {
        language: 'ruby',
        patterns: [/\.rb/, /gem\s/, /bundler/, /rspec/]
      },
      {
        language: 'php',
        patterns: [/\.php/, /composer/, /phpunit/]
      },
      {
        language: 'csharp',
        patterns: [/\.cs/, /dotnet/, /msbuild/, /nuget/]
      },
      {
        language: 'swift',
        patterns: [/\.swift/, /swiftc/, /xcodebuild/]
      },
      {
        language: 'kotlin',
        patterns: [/\.kt/, /kotlinc/]
      }
    ];
    
    for (const { language, patterns } of LANGUAGE_DEFINITIONS) {
        for (const pattern of patterns) {
          if (pattern.test(logs)) {
            return language;
          }
        }
    }
    
    return 'unknown';
  }
  
  /**
   * Detect framework/testing library from logs
   */
  export function detectFramework(logs: string, language: string): string {
    
    const frameworks: Record<string, Array<{ name: string; patterns: RegExp[] }>> = {
      'javascript': [
        { name: 'jest', patterns: [/jest/i, /FAIL.*test\.js/] },
        { name: 'mocha', patterns: [/mocha/i] },
        { name: 'react', patterns: [/react/i, /\.jsx/] },
        { name: 'next.js', patterns: [/next/i, /next build/] },
        { name: 'vue', patterns: [/vue/i, /\.vue/] },
        { name: 'angular', patterns: [/angular/i, /@angular/] },
        { name: 'express', patterns: [/express/i] },
        { name: 'webpack', patterns: [/webpack/i] },
        { name: 'vite', patterns: [/vite/i] }
      ],
      'typescript': [
        { name: 'jest', patterns: [/jest/i, /FAIL.*test\.ts/] },
        { name: 'react', patterns: [/react/i, /\.tsx/] },
        { name: 'next.js', patterns: [/next/i, /next build/] },
        { name: 'angular', patterns: [/angular/i, /@angular/] },
        { name: 'nest.js', patterns: [/nest/i, /@nestjs/] }
      ],
      'python': [
        { name: 'pytest', patterns: [/pytest/i, /FAILED.*test_/] },
        { name: 'unittest', patterns: [/unittest/i] },
        { name: 'django', patterns: [/django/i, /manage\.py/] },
        { name: 'flask', patterns: [/flask/i] },
        { name: 'fastapi', patterns: [/fastapi/i] },
        { name: 'pandas', patterns: [/pandas/i] },
        { name: 'numpy', patterns: [/numpy/i] }
      ],
      'java': [
        { name: 'junit', patterns: [/junit/i] },
        { name: 'maven', patterns: [/maven/i, /mvn\s/] },
        { name: 'gradle', patterns: [/gradle/i] },
        { name: 'spring', patterns: [/spring/i] }
      ],
      'go': [
        { name: 'go test', patterns: [/go test/i] },
        { name: 'gin', patterns: [/gin-gonic/i] },
        { name: 'echo', patterns: [/echo/i] }
      ],
      'ruby': [
        { name: 'rspec', patterns: [/rspec/i] },
        { name: 'rails', patterns: [/rails/i, /ruby on rails/i] },
        { name: 'sinatra', patterns: [/sinatra/i] }
      ],
      'php': [
        { name: 'phpunit', patterns: [/phpunit/i] },
        { name: 'laravel', patterns: [/laravel/i] },
        { name: 'symfony', patterns: [/symfony/i] },
        { name: 'composer', patterns: [/composer/i] }
      ],
      'rust': [
        { name: 'cargo', patterns: [/cargo test/i, /cargo build/i] }
      ],
      'csharp': [
        { name: 'xunit', patterns: [/xunit/i] },
        { name: 'nunit', patterns: [/nunit/i] },
        { name: '.net', patterns: [/dotnet/i] }
      ]
    };
    
    const languageFrameworks = frameworks[language] || [];
    
    for (const { name, patterns } of languageFrameworks) {
      for (const pattern of patterns) {
        if (pattern.test(logs)) {
          return name;
        }
      }
    }
    
    return 'none';
  }