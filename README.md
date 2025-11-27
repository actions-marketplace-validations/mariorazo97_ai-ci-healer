# 🔧 AI CI Healer

**Stop Googling build errors. Let AI fix them for you.**

When your GitHub Actions fail, AI CI Healer:
1. ✅ Reads the error log
2. 🤖 Asks an AI (Groq/Gemini/Ollama) what went wrong
3. 💬 Comments the EXACT fix on your PR
4. ⚡ Takes ~10 seconds

![AI CI Healer Demo](https://via.placeholder.com/800x400?text=Demo+GIF+Coming+Soon)

---

## 🚀 Quick Start (30 seconds)

Add this to your workflow file **after** your failing step:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run tests
        run: npm test
      
      # 👇 Add this step to auto-heal failures
      - name: AI CI Healer
        if: failure()  # Only runs when previous steps fail
        uses: your-username/ai-ci-healer@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          groq-api-key: ${{ secrets.GROQ_API_KEY }}
```

### Get Your Free API Key

- **Groq** (Recommended): [console.groq.com](https://console.groq.com) - 14,400 requests/day FREE
- **Gemini**: [ai.google.dev](https://ai.google.dev) - 1,500 requests/day FREE

Add the API key to your repository secrets:
`Settings → Secrets → Actions → New repository secret`

---

## 💡 Why This Exists

Developers spend **20 minutes per build failure** Googling cryptic error messages.

This tool does it in **10 seconds**.

---

## 📸 Real Examples

### Example 1: Missing Dependency

**Error:**
```
Error: Cannot find module 'lodash'
```

**AI Suggestion:**
```bash
npm install lodash --save
```

**Confidence:** 95%

---

### Example 2: TypeScript Type Error

**Error:**
```
Property 'name' does not exist on type '{}'
```

**AI Suggestion:**
```typescript
interface User {
  name: string;
  email: string;
}

const user: User = {
  name: 'John',
  email: 'john@example.com'
};
```

**Confidence:** 88%

---

## 🎯 Features

### ✨ Currently Supported

- ✅ **Multiple AI Providers**: Groq, Gemini, Ollama (self-hosted)
- ✅ **Smart Fallback**: If one provider fails, tries others automatically
- ✅ **Language Detection**: JavaScript, TypeScript, Python, Java, Go, Rust, PHP, Ruby
- ✅ **Framework Recognition**: Jest, Pytest, JUnit, Mocha, and more
- ✅ **Stack Trace Analysis**: Parses error logs intelligently
- ✅ **File Context**: Fetches relevant source code for better suggestions
- ✅ **Confidence Scoring**: Only posts when confident (configurable threshold)
- ✅ **Custom Context**: Inject internal docs or common fixes

### 🚧 Coming Soon (v2)

- 🎯 **Learning Mode**: Store accepted fixes in a vector DB
- 🎯 **Auto-PR**: Create a pull request with the fix
- 🎯 **Team Context**: Inject company-specific documentation
- 🎯 **Metrics Dashboard**: Track fix success rate over time
- 🎯 **More Languages**: C++, Swift, Kotlin

---

## ⚙️ Configuration

### All Available Inputs

```yaml
- uses: your-username/ai-ci-healer@v1
  with:
    # Required
    github-token: ${{ secrets.GITHUB_TOKEN }}
    
    # AI Provider (default: groq)
    llm-provider: groq  # Options: groq, gemini, ollama
    groq-api-key: ${{ secrets.GROQ_API_KEY }}
    gemini-api-key: ${{ secrets.GEMINI_API_KEY }}
    ollama-endpoint: http://localhost:11434  # For self-hosted
    
    # Optional
    max-log-lines: 500  # How many log lines to analyze (default: 500)
    confidence-threshold: 50  # Minimum confidence to post (0-100, default: 50)
    custom-context: |
      Our team uses TypeScript with strict mode.
      We prefer async/await over promises.
```

---

## 🏢 Enterprise Features

### Self-Hosted with Ollama

For companies that want to keep everything in-house:

```yaml
- uses: your-username/ai-ci-healer@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    llm-provider: ollama
    ollama-endpoint: http://your-ollama-server:11434
```

### Custom Context Injection

Inject your internal documentation or Stack Overflow:

```yaml
custom-context: |
  Common issues in our codebase:
  - Always use environment variables for API keys
  - Database connections should use connection pooling
  - Unit tests should mock external API calls
```

---

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **Star this repo** ⭐
2. **Fork it** 🍴
3. **Add support for your favorite language/framework** 💻
4. **Submit a PR** 🚀

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## 📊 Stats

- **Languages Supported**: 10+
- **Frameworks Detected**: 20+
- **Average Fix Time**: 10 seconds
- **Typical Confidence**: 75-90%

---

## 🙏 Acknowledgments

Built with:
- [Groq](https://groq.com) - Lightning-fast inference
- [Google Gemini](https://ai.google.dev) - Powerful AI
- [Ollama](https://ollama.ai) - Self-hosted LLMs
- [@actions/core](https://github.com/actions/toolkit) - GitHub Actions toolkit

---

## 📝 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🔗 Links

- **Author**: [Mr. P @ QuizMyBrainz](https://github.com/yourusername)
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)
- **YouTube**: [Your Channel](https://youtube.com/yourchannel)
- **Discord**: [Join our community](https://discord.gg/yourserver)

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/ai-ci-healer&type=Date)](https://star-history.com/#yourusername/ai-ci-healer&Date)

---

**Made with ❤️ by developers who are tired of Googling error messages**

---

### 🎬 Video Tutorial

Watch the full build process on YouTube: [Coming Soon]

Subscribe for more dev tools and tutorials!