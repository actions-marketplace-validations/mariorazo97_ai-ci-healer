# Contributing to AI CI Healer

Thank you for your interest in contributing! 🎉

## How Can I Contribute?

### 1. Report Bugs 🐛

Found a bug? Please open an issue with:
- A clear title
- Steps to reproduce
- Expected vs actual behavior
- Your workflow file (sanitized)
- Error logs (if applicable)

### 2. Suggest Features 💡

Have an idea? Open an issue with:
- Clear description of the feature
- Why it would be useful
- How you imagine it working

### 3. Add Language/Framework Support 🌍

We're always looking to support more languages!

**To add a new language:**

1. Update `src/utils/language-detector.ts`:
   ```typescript
   {
     language: 'your-language',
     patterns: [/pattern1/, /pattern2/]
   }
   ```

2. Update `src/utils/log-parser.ts` with error patterns for that language

3. Add test fixtures in `tests/fixtures/your-language-error.log`

4. Update README.md with the new language

### 4. Improve AI Prompts 🤖

The quality of suggestions depends on our prompts!

Edit `src/prompt-builder.ts` to:
- Add more context
- Improve clarity
- Make prompts more specific

### 5. Write Tests ✅

We need more test coverage! Add tests in `tests/unit/`

### 6. Improve Documentation 📚

Help others understand the project:
- Fix typos
- Add examples
- Improve explanations
- Create tutorials

---

## Development Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- Git

### Getting Started

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/ai-ci-healer.git
cd ai-ci-healer

# 3. Add upstream remote
git remote add upstream https://github.com/ORIGINAL-OWNER/ai-ci-healer.git

# 4. Install dependencies
npm install

# 5. Create a branch
git checkout -b feature/your-feature-name

# 6. Make your changes

# 7. Run tests
npm test

# 8. Build
npm run build

# 9. Commit your changes
git add .
git commit -m "feat: add awesome feature"

# 10. Push to your fork
git push origin feature/your-feature-name

# 11. Open a Pull Request on GitHub
```

---

## Code Style

We use:
- **ESLint** for linting
- **Prettier** for formatting
- **TypeScript** for type safety

Run before committing:
```bash
npm run lint
npm run format
```

---

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add support for Python
fix: correct TypeScript detection
docs: update README examples
test: add unit tests for analyzer
refactor: simplify log parser
chore: update dependencies
```

---

## Pull Request Process

1. **Update documentation** if you changed functionality
2. **Add tests** for new features
3. **Ensure all tests pass** (`npm test`)
4. **Update README.md** if you added features
5. **Keep PRs focused** - one feature per PR
6. **Write a clear description** of what and why

---

## Testing Your Changes

### Local Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- log-parser.test.ts

# Watch mode
npm run test:watch
```

### Testing in a Real Repository

1. Build your action:
   ```bash
   npm run build
   ```

2. In a test repository, use your local action:
   ```yaml
   - uses: ./path/to/your-local-ai-ci-healer
   ```

3. Push a commit that will fail CI

4. Check if your action posts the correct suggestion

---

## Project Structure

```
ai-ci-healer/
├── src/
│   ├── index.ts              # Main entry point
│   ├── analyzer.ts           # Log analysis logic
│   ├── llm-router.ts         # AI provider routing
│   ├── prompt-builder.ts     # AI prompt engineering
│   ├── github-poster.ts      # GitHub API interactions
│   ├── types.ts              # TypeScript types
│   └── utils/
│       ├── config.ts
│       ├── github-api.ts
│       ├── log-parser.ts     # Error pattern matching
│       ├── language-detector.ts
│       └── file-fetcher.ts
├── tests/
│   ├── fixtures/             # Sample error logs
│   └── unit/                 # Unit tests
├── docs/                     # Additional documentation
└── .github/workflows/        # CI workflows
```

---

## Questions?

- **Discord**: [Join our community](https://discord.gg/yourserver)
- **GitHub Discussions**: [Start a discussion](https://github.com/yourusername/ai-ci-healer/discussions)
- **Email**: your-email@example.com

---

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to learn and build something awesome together! 🚀

---

## Recognition

Contributors will be:
- Added to our [Contributors page](https://github.com/yourusername/ai-ci-healer/graphs/contributors)
- Mentioned in release notes
- Featured in our README (for significant contributions)

---

**Thank you for contributing to AI CI Healer!** 🙏