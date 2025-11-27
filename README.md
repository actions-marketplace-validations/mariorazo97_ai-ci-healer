# 🚑 AI CI Healer

[![GitHub Release](https://img.shields.io/github/v/release/mariorazo97/ai-ci-healer?style=for-the-badge&color=purple)](https://github.com/mariorazo97/ai-ci-healer/releases)
[![License](https://img.shields.io/github/license/mariorazo97/ai-ci-healer?style=for-the-badge)](./LICENSE)
[![Support](https://img.shields.io/badge/Support-Buy%20me%20a%20coffee-yellow?style=for-the-badge&logo=buymeacoffee)](https://buymeacoffee.com/quizmybrai7)
[![QuizMyBrainz](https://img.shields.io/badge/QuizMyBrainz-Powered%20by%20AI-9C27B0?style=for-the-badge&logo=lightning&logoColor=white)](https://quizmybrainz.com)

**Stop Googling build errors. Let AI fix them for you.**

When your GitHub Actions fail, **AI CI Healer** analyzes the logs, finds the root cause (using Groq, Gemini, or Ollama), and posts the **exact fix** directly to your PR or commit.

![AI CI Healer Demo](https://github.com/mariorazo97/ai-ci-healer/blob/main/images/solution01.png?raw=true)

---

## ✨ Features

- **🧠 Multi-Brain Support:** Choose between **Groq** (Fastest), **Gemini** (Smartest), or **Ollama** (Private/Local).
- **🛡️ Smart Fallback:** Automatically tries alternative providers if one API fails.
- **👁️ Chain of Thought:** Expands the "Reasoning" dropdown to show *why* the AI chose the fix.
- **⚡ Blazing Fast:** Zero-config setup. Drops into any workflow in seconds.
- **🔒 Enterprise Ready:** Works with private repositories and self-hosted runners.

---

## 🚀 Quick Start

Add this step to your workflow file (e.g., `.github/workflows/ci.yml`) **after** your build/test steps.

> **Note:** The `if: failure()` line is crucial. It ensures the Healer only runs when something breaks.

```yaml
- name: Run Tests
  run: npm test

# 👇 Add this step to auto-heal failures
- name: AI CI Healer
  if: failure()
  uses: mariorazo97/ai-ci-healer@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    llm-provider: "groq"
    groq-api-key: ${{ secrets.GROQ_API_KEY }}
```

---

## ⚙️ Configuration

### Action Inputs

| Input | Description | Default | Required |
|-------|-------------|---------|----------|
| `github-token` | GitHub token for posting comments | `${{ secrets.GITHUB_TOKEN }}` | ✅ Yes |
| `llm-provider` | AI provider: `groq`, `gemini`, or `ollama` | `groq` | No |
| `groq-api-key` | Groq API key ([Get free key](https://console.groq.com)) | - | If using Groq |
| `gemini-api-key` | Gemini API key ([Get free key](https://ai.google.dev)) | - | If using Gemini |
| `ollama-endpoint` | Self-hosted Ollama URL (e.g., `http://localhost:11434`) | - | If using Ollama |
| `enable-comments` | Enable/disable PR commenting | `true` | No |
| `confidence-threshold` | Minimum confidence to post (0-100) | `50` | No |
| `max-log-lines` | Maximum log lines to analyze | `500` | No |
| `custom-context` | Team-specific rules (e.g., "Use TypeScript strict mode") | `""` | No |

### Example Configuration
```yaml
- name: AI CI Healer
  if: failure()
  uses: your-username/ai-ci-healer@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    llm-provider: groq
    groq-api-key: ${{ secrets.GROQ_API_KEY }}
    confidence-threshold: 60
    custom-context: |
      Our team conventions:
      - Always use TypeScript strict mode
      - Prefer async/await over promises
      - Follow Airbnb style guide
```

---

## 🔒 Security & Privacy

We take your code security seriously:

- **🚫 Zero Data Retention**: Your code is never stored. Logs are sent to the AI provider only for analysis and immediately discarded.
- **🔍 Fully Transparent**: Audit the entire source code in [`src/`](./src) to see exactly what data is transmitted.
- **🏠 Self-Hosted Option**: Use the `ollama` provider to keep 100% of your data on your own infrastructure—no external API calls.
- **🔐 API Keys**: All API keys are stored securely in GitHub Secrets and never logged or exposed.

> **Note**: When using Groq or Gemini, error logs are sent to their APIs for analysis. Read their privacy policies: [Groq](https://groq.com/privacy-policy/) | [Gemini](https://ai.google.dev/gemini-api/terms)

---

## 🤝 Contributing

We love contributions! Here's how you can help:

### Quick Start
1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/amazing-feature`)
3. ✍️ Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. 🚀 Push to the branch (`git push origin feature/amazing-feature`)
5. 🎉 Open a Pull Request

### Ways to Contribute
- 🐛 Report bugs in [Issues](../../issues)
- 💡 Suggest features in [Discussions](../../discussions)
- 📝 Improve documentation
- 🌍 Add support for new languages
- ⚡ Optimize performance
- ✅ Write tests

Read our [**CONTRIBUTING.md**](./CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## ⭐ Show Your Support

If AI CI Healer saved you time and frustration, consider:

<div align="center">

### Give it a star ⭐

[![Star History](https://img.shields.io/github/stars/mariorazo97/ai-ci-healer?style=social)](https://github.com/mariorazo97/ai-ci-healer)

### Buy me a coffee ☕

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/quizmybrai7)

### Follow for updates 📢

[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/QMybrainz)
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@QuizMyBrainz)

</div>

---

<div align="center">

**Made with ❤️ by [Mr. P @ QuizMyBrainz](https://github.com/mariorazo97)**

[Report Bug](../../issues) · [Request Feature](../../issues) · [Ask Question](../../discussions)

</div>
