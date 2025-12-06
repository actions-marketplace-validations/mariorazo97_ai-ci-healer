# Contributing to AI CI Healer

Thank you for your interest in contributing! 🎉

We're building a community of developers who are tired of debugging CI/CD failures. Every contribution—big or small—helps make this tool better for everyone.

---

## 🚀 Quick Links

- **Report a Bug**: [Create an issue](https://github.com/mariorazo97/ai-ci-healer/issues/new?template=bug_report.md)
- **Request a Feature**: [Create an issue](https://github.com/mariorazo97/ai-ci-healer/issues/new?template=feature_request.md)
- **Ask a Question**: [GitHub Discussions](https://github.com/mariorazo97/ai-ci-healer/discussions)
- **View Roadmap**: [Project Board](https://github.com/mariorazo97/ai-ci-healer/projects)

---

## 💡 Ways to Contribute

### 1. Report Bugs 🐛

Found a bug? Help us fix it by opening a detailed issue:

**Include:**
- ✅ Clear, descriptive title
- ✅ Steps to reproduce the bug
- ✅ Expected behavior vs actual behavior
- ✅ Your workflow file (remove sensitive data)
- ✅ Relevant error logs
- ✅ Environment details (Node version, OS, etc.)

[**Report a Bug →**](https://github.com/mariorazo97/ai-ci-healer/issues/new)

---

### 2. Suggest Features 💡

Have an idea to make AI CI Healer better?

**Include:**
- 📝 Clear description of the feature
- 🎯 Problem it solves (or value it adds)
- 💭 How you imagine it working
- 📊 Any examples or mockups (optional)

[**Request a Feature →**](https://github.com/mariorazo97/ai-ci-healer/issues/new)

---

### 3. Add Language/Framework Support 🌍

Help us support more programming languages and frameworks!

**Current Support:** JavaScript, TypeScript, Python, Java, Go, Rust, PHP, Ruby, C#, Swift

**To add a new language:**

1. **Update language detection** (`src/utils/language-detector.ts`):
```typescript
   {
     language: 'kotlin',  // Your language
     patterns: [/\.kt/, /kotlin/i, /kotlinc/]
   }
```

2. **Add error patterns** (`src/utils/log-parser.ts`):
```typescript
   {
     type: 'compilation-error',
     patterns: [/Unresolved reference/i, /Type mismatch/i]
   }
```

3. **Create test fixtures** (`tests/fixtures/kotlin-error.log`):
   - Add real error logs from that language
   - Include stack traces and error messages

4. **Update documentation** (`README.md`):
   - Add language to supported list
   - Add example error/fix

5. **Test it**:
```bash
   npm test
   npm run build
   # Test in a real repo with that language
```

**Helpful Resources:**
- [Language Detector Code](./src/utils/language-detector.ts)
- [Log Parser Code](./src/utils/log-parser.ts)
- [Existing Test Fixtures](./tests/fixtures/)

---

### 4. Improve AI Prompts 🤖

The quality of fix suggestions depends on our prompts!

**Edit** [`src/prompt-builder.ts`](./src/prompt-builder.ts) to:
- ✨ Add more contextual information
- 🎯 Improve clarity and specificity
- 📚 Include examples of good fixes
- 🧠 Make the AI "think" better about errors

**Example Improvement:**
```typescript
// Before
"Fix this error"

// After
"Analyze this error in the context of a {framework} project.
Consider the dependency versions and common gotchas.
Provide a fix with explanation and confidence score."
```

---

### 5. Write Tests ✅

We need better test coverage! 

**Areas that need tests:**
- [ ] `src/analyzer.ts` - Edge cases in log analysis
- [ ] `src/llm-router.ts` - Fallback logic
- [ ] `src/utils/log-parser.ts` - More error patterns
- [ ] Integration tests with mock GitHub API

**Add tests in:** `tests/unit/`

---

### 6. Improve Documentation 📚

Help make AI CI Healer easier to understand:

- 📝 Fix typos and grammar
- 📸 Add screenshots or GIFs
- 💡 Write tutorials or guides
- 🎥 Create video walkthroughs
- 🌍 Translate to other languages
- 📊 Add diagrams or flowcharts

---

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Git**
- **GitHub account**

### Getting Started
```bash
# 1. Fork the repository on GitHub
#    Click "Fork" at https://github.com/mariorazo97/ai-ci-healer

# 2. Clone YOUR fork (not the original)
git clone https://github.com/YOUR-USERNAME/ai-ci-healer.git
cd ai-ci-healer

# 3. Add the original repo as "upstream"
git remote add upstream https://github.com/mariorazo97/ai-ci-healer.git

# 4. Install dependencies
npm install

# 5. Create a feature branch
git checkout -b feature/my-awesome-feature

# 6. Make your changes
# Edit files, add features, fix bugs...

# 7. Run tests
npm test

# 8. Lint your code
npm run lint

# 9. Build the project
npm run build

# 10. Commit with conventional commit message
git add .
git commit -m "feat: add support for Kotlin"

# 11. Push to YOUR fork
git push origin feature/my-awesome-feature

# 12. Open a Pull Request
#     Go to https://github.com/mariorazo97/ai-ci-healer
#     Click "Pull Requests" → "New Pull Request"
```

---

## 📝 Code Style & Standards

### Code Quality Tools

We use:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Jest** for testing

### Before Committing
```bash
# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm test

# Build
npm run build
```

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add support for Kotlin` |
| `fix` | Bug fix | `fix: correct Python error detection` |
| `docs` | Documentation only | `docs: update installation guide` |
| `test` | Add/update tests | `test: add unit tests for analyzer` |
| `refactor` | Code refactoring | `refactor: simplify log parser` |
| `perf` | Performance improvement | `perf: optimize log parsing` |
| `chore` | Maintenance | `chore: update dependencies` |

**Examples:**
```bash
git commit -m "feat: add Rust language support"
git commit -m "fix: handle empty stack traces gracefully"
git commit -m "docs: add troubleshooting guide"
git commit -m "test: add integration tests for Groq API"
```

---

## 🔍 Pull Request Process

### Before Opening a PR

- [ ] Code follows our style guidelines
- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow convention
- [ ] Branch is up to date with `main`

### PR Guidelines

1. **One feature per PR** - Keep it focused
2. **Write a clear title** - Use conventional commit format
3. **Describe what and why** - Not just what changed, but why
4. **Add screenshots/GIFs** - If UI changes
5. **Link related issues** - Use "Fixes #123" or "Closes #123"
6. **Be responsive** - Reply to review comments promptly

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe your testing process

## Checklist
- [ ] Tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

---

## 🧪 Testing Your Changes

### Run Tests Locally
```bash
# Run all tests
npm test

# Run specific test file
npm test -- analyzer.test.ts

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test in a Real Repository

The best way to test is with an actual failing workflow:

1. **Build your local action:**
```bash
   npm run build
```

2. **Create a test repository** with a failing workflow

3. **Point to your local action:**
```yaml
   - name: Test AI CI Healer
     if: failure()
     uses: ./path/to/your-local-ai-ci-healer
     with:
       github-token: ${{ secrets.GITHUB_TOKEN }}
       groq-api-key: ${{ secrets.GROQ_API_KEY }}
```

4. **Push a commit** that will trigger the failure

5. **Check the PR comment** - Does it suggest the right fix?

---

## 📂 Project Structure
```
ai-ci-healer/
├── src/
│   ├── index.ts              # 🎯 Main entry point & orchestration
│   ├── analyzer.ts           # 🔍 Log analysis & error extraction
│   ├── llm-router.ts         # 🤖 AI provider routing & fallback
│   ├── prompt-builder.ts     # 💬 Prompt engineering for AI
│   ├── github-poster.ts      # 📝 GitHub comment formatting
│   ├── types.ts              # 📋 TypeScript type definitions
│   └── utils/
│       ├── config.ts         # ⚙️  Action configuration
│       ├── github-api.ts     # 🐙 GitHub API interactions
│       ├── log-parser.ts     # 🔎 Error pattern matching
│       ├── language-detector.ts  # 🌐 Language/framework detection
│       └── file-fetcher.ts   # 📂 Source code fetching
├── tests/
│   ├── fixtures/             # 📄 Sample error logs for testing
│   │   ├── jest-test-failure.log
│   │   ├── typescript-build-error.log
│   │   └── pytest-failure.log
│   └── unit/                 # ✅ Unit tests (to be added)
├── .github/
│   └── workflows/            # 🔄 CI/CD workflows
│       └── ci.yml
├── docs/                     # 📚 Additional documentation
├── action.yml                # 🎬 GitHub Action definition
├── package.json              # 📦 Dependencies
├── tsconfig.json             # 🔧 TypeScript config
└── README.md                 # 📖 Main documentation
```

---

## 💬 Get Help

### Community Channels

- **GitHub Discussions**: [Ask questions, share ideas](https://github.com/mariorazo97/ai-ci-healer/discussions)
- **Issues**: [Report bugs, request features](https://github.com/mariorazo97/ai-ci-healer/issues)
- **Email**: [mariorazo97@gmail.com]
- **YouTube**: [Watch tutorials & build videos](https://www.youtube.com/@QuizMyBrainz) 📺

### Response Time

- 🐛 **Bugs**: We aim to respond within 48 hours
- 💡 **Features**: We review all requests weekly
- 🔀 **PRs**: We review within 3-5 business days

---

## 🤝 Code of Conduct

### Our Standards

- ✅ Be respectful and inclusive
- ✅ Welcome newcomers warmly
- ✅ Provide constructive feedback
- ✅ Focus on what's best for the community
- ✅ Show empathy towards others

### Unacceptable Behavior

- ❌ Harassment or discriminatory language
- ❌ Trolling or insulting comments
- ❌ Personal attacks
- ❌ Spam or off-topic content

**Enforcement**: Violations may result in temporary or permanent ban from the project.

---

## 🏆 Recognition

Your contributions matter! Contributors will be:

- ⭐ **Featured** in our [Contributors page](https://github.com/mariorazo97/ai-ci-healer/graphs/contributors)
- 📢 **Mentioned** in release notes
- 🎖️ **Highlighted** in README for significant contributions
- 💌 **Thanked** personally by the maintainer
- 🎁 **Sent swag** (for major contributions - when available)

### Hall of Fame

Major contributors will be featured in our README with:
- Your name/username
- Avatar
- Link to your GitHub profile
- Description of your contribution

---

## 📋 Contributor License Agreement

By contributing, you agree that:
- Your contributions will be licensed under the MIT License
- You have the right to submit the contribution
- Your contribution is your original work

---

## 🎉 Thank You!

Every line of code, every bug report, every documentation improvement makes AI CI Healer better for developers worldwide.

**Special thanks to all our contributors!**

<div align="center">

[![Contributors](https://contrib.rocks/image?repo=mariorazo97/ai-ci-healer)](https://github.com/mariorazo97/ai-ci-healer/graphs/contributors)

</div>

---

<div align="center">

**Built with ❤️ by [Mario Razo @ QuizMyBrainz](https://github.com/mariorazo97)**

[Report Bug](https://github.com/mariorazo97/ai-ci-healer/issues) · 
[Request Feature](https://github.com/mariorazo97/ai-ci-healer/issues) · 
[Ask Question](https://github.com/mariorazo97/ai-ci-healer/discussions)

</div>
