# 🚀 Quick Start Guide - Get This Running in 15 Minutes

## ⚡ Immediate Steps

### 1. Install Dependencies (2 minutes)

```bash
cd ai-ci-healer
npm install
```

### 2. Build the Action (1 minute)

```bash
npm run build
```

This compiles TypeScript and packages everything into `dist/index.js`.

### 3. Get Free API Keys (5 minutes)

**Option A: Groq (Recommended)**
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (free)
3. Create an API key
4. Copy it - you'll need it soon
5. **Limit:** 14,400 requests/day FREE

**Option B: Gemini**
1. Go to [ai.google.dev](https://ai.google.dev)
2. Get API key
3. **Limit:** 1,500 requests/day FREE

### 4. Test in a Repository (7 minutes)

#### Create a Test Repo

```bash
mkdir test-repo
cd test-repo
git init
npm init -y
```

#### Add a Failing Test

```bash
# Create a simple test that will fail
cat > test.js << 'EOF'
function add(a, b) {
  return a - b; // Wrong! Should be a + b
}

if (add(2, 3) !== 5) {
  throw new Error('Test failed: 2 + 3 should equal 5');
}
EOF
```

#### Create GitHub Workflow

```bash
mkdir -p .github/workflows

cat > .github/workflows/test.yml << 'EOF'
name: Test with AI Healer

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run test
        run: node test.js
      
      - name: AI CI Healer
        if: failure()
        uses: YOUR-USERNAME/ai-ci-healer@main  # Change this!
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          groq-api-key: ${{ secrets.GROQ_API_KEY }}
EOF
```

#### Add Your API Key as Secret

1. Go to your test repo on GitHub
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `GROQ_API_KEY`
5. Value: [paste your API key]
6. Click "Add secret"

#### Push and Watch!

```bash
git add .
git commit -m "test: add failing test"
git remote add origin https://github.com/YOUR-USERNAME/test-repo.git
git push -u origin main
```

**What Will Happen:**
1. ✅ Workflow runs
2. ❌ Test fails
3. 🤖 AI analyzes the error
4. 💬 Posts fix suggestion as a comment
5. 🎉 You see the magic!

---

## 🎬 Video Content Ideas

### Video #1: "Watch Me Build This" (Already Done!)
Show them the architecture we just created. Walk through each file explaining:
- Why we made these choices
- How the pieces fit together
- The smart parts (log parsing, AI prompts, etc.)

### Video #2: "Testing It Live"
Record yourself:
1. Creating a failing test
2. Pushing to GitHub
3. Watching AI post the fix
4. Actually applying the fix

### Video #3: "Launch Day"
Document:
- Reddit posts going viral
- GitHub stars climbing
- Community reactions
- First contributors

---

## 📝 Content Calendar

### Week 1: Build & Polish
- **Day 1-2**: Final testing
- **Day 3**: Record "Watch Me Build This" video
- **Day 4**: Create demo GIFs/screenshots
- **Day 5**: Write launch blog post
- **Day 6-7**: Buffer for fixes

### Week 2: Launch
- **Monday**: Soft launch on Twitter
- **Tuesday**: r/programming, r/github posts
- **Wednesday**: Product Hunt launch
- **Thursday**: Dev.to blog post
- **Friday**: LinkedIn post

### Week 3: Growth
- **Content**: "How I Got 1,000 Stars" video
- **Community**: Discord setup
- **Features**: Start adding V2 features

---

## 🐛 Troubleshooting

### Build Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Action Doesn't Run

**Check:**
- [ ] `if: failure()` is present
- [ ] API key is in secrets
- [ ] Action has correct permissions

### No Comment Posted

**Debug:**
- Check workflow run logs
- Look for "AI CI Healer" step
- Check confidence score (might be below threshold)
- Verify GITHUB_TOKEN has write permissions

### API Rate Limits

**Solutions:**
- Use fallback: Add both Groq AND Gemini keys
- Self-host: Set up Ollama
- Increase threshold: Only post high-confidence fixes

---

## 🎯 Making It Go Viral

### Reddit Strategy

**Best Subreddits:**
1. r/github (50k members)
2. r/devops (200k members)
3. r/programming (5M members)
4. r/webdev (1.5M members)

**Title Examples:**
- "Built a GitHub Action that uses AI to fix failed builds automatically"
- "Stop Googling CI errors - this AI does it for you in 10 seconds"
- "I made a free tool that analyzes failed GitHub Actions and suggests fixes"

**Post Structure:**
1. Problem statement (1 sentence)
2. Solution (1 sentence)
3. Demo GIF
4. GitHub link
5. "It's free and open source"

### Twitter/X Strategy

**Tweet Thread:**
```
1/ Built something cool this weekend 🚀

When your GitHub Actions fail, instead of Googling the error...

This AI analyzes the logs and comments the EXACT fix on your PR.

Takes 10 seconds. Free tier. Open source.

[Demo GIF]

2/ Here's how it works:
- Reads failed build logs
- Parses stack traces
- Sends to AI (Groq/Gemini)
- Posts fix as PR comment

Real example: [Screenshot]

3/ Why I built this:
Developers waste 20 minutes per build failure Googling cryptic errors.

14,400 free API calls/day means most teams never hit limits.

4/ Tech stack:
- TypeScript
- GitHub Actions
- Groq API (llama-3.3-70b)
- Smart log parsing
- Error pattern recognition

5/ Want to try it?

Add 3 lines to your workflow:
[Code snippet]

⭐ Star on GitHub: [link]
📺 Watch me build it: [link]

It's 100% free and open source.
```

### Product Hunt Strategy

**Tagline:** "AI that fixes your failed CI/CD builds automatically"

**First Comment (as maker):**
```
Hey Product Hunters! 👋

I'm Mr. P, and I built AI CI Healer because I was tired of Googling the same CI errors over and over.

What it does:
✅ Analyzes failed GitHub Actions
✅ Uses AI to understand what went wrong
✅ Comments the exact fix on your PR
✅ Works with 10+ programming languages

It's completely free (14,400 AI calls/day on free tier) and open source.

Would love your feedback! What CI/CD pain points do you face?

[Add demo video here]
```

---

## 💰 Monetization Ideas (Future)

**Don't monetize initially** - focus on growth and stars.

**After 1,000+ stars, consider:**

1. **GitHub Sponsors** - "Buy me a coffee"
2. **Consulting** - Help companies set up custom versions
3. **Enterprise Support** - SLA, priority fixes
4. **Hosted Version** - Managed service with dashboard
5. **Video Course** - "Build Your Own GitHub Actions"

---

## 🎓 What You Learned

By building this, you now deeply understand:
- GitHub Actions architecture
- TypeScript for tooling
- AI API integration (Groq, Gemini, Ollama)
- Log parsing and pattern matching
- Error classification
- Prompt engineering for code fixes
- CI/CD workflows
- Open source project structure

**This is portfolio gold!** 💎

---

## 🔥 Final Checklist Before Launch

- [ ] All files compile without errors
- [ ] Tested in a real repository
- [ ] README has demo GIF
- [ ] CONTRIBUTING.md is clear
- [ ] LICENSE file present
- [ ] GitHub repo description set
- [ ] Topics added (github-actions, ai, devops, cicd)
- [ ] Demo video recorded
- [ ] Social media posts drafted
- [ ] Product Hunt listing ready

---

**Ready? Let's launch this thing! 🚀**

```bash
# Final build
npm run build

# Push to GitHub
git add .
git commit -m "feat: initial release"
git push origin main

# Create release
git tag v1.0.0
git push origin v1.0.0
```

**Then post everywhere and watch the stars roll in!** ⭐⭐⭐