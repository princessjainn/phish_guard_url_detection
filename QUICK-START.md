# PhishGuard AI - Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Start the API (30 seconds)

```bash
python main.py
```

Wait for: `Running on http://127.0.0.1:5000`

### Step 2: Install Extension (1 minute)

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the `chrome-extension` folder
5. Done! Icon appears in toolbar

### Step 3: Test It! (1 minute)

**Try the keyboard shortcut:**
- Press `Alt+Z` on any page
- See safety score instantly

**Try blocking a phishing site:**
- Type in address bar: `http://secure-paypal-verify.tk`
- Press Enter
- 🚨 **BOOM! Blocked automatically!**
- See warning screen with details

**Try the popup:**
- Click PhishGuard AI icon in toolbar
- Click "Scan Current Page"
- See animated gauge and results

## Test Phishing URLs (Copy & Paste)

```
http://secure-paypal-verify.tk
http://google-security-alert.ga
http://amazon-account-suspended.xyz
https://goog1e.com
https://amaz0n.com
https://paypa1.com
```

**All of these will be BLOCKED instantly!**

## What You'll See

### Blocked Page
```
┌────────────────────────────────┐
│   🚨 Phishing Site Blocked     │
│                                │
│   PhishGuard AI prevented you  │
│   from visiting a dangerous    │
│   website                      │
│                                │
│   ⬅️  Go Back to Safety       │
└────────────────────────────────┘
```

### Extension Popup
- **Animated circular gauge** (0-100 safety score)
- **Live stats** - Blocked, Scanned, Reports
- **Dark/light mode** toggle
- **Modern glassmorphism UI**

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Alt+Z` | Scan current page |

## Quick Tips

✅ **Auto-blocking is ON by default** - You're protected immediately

✅ **Press Alt+Z anytime** - Instant scan of current page

✅ **Hover over links** - They get scanned automatically

✅ **Check your stats** - Click extension icon to see how many threats blocked

## Troubleshooting

**Extension not working?**
- Make sure API is running (`python main.py`)
- Check connection status in extension popup (should be green)

**Sites not being blocked?**
- Refresh the extension in `chrome://extensions/`
- Make sure auto-block is enabled in settings

**Shortcut not working?**
- Check `chrome://extensions/shortcuts`
- Make sure Alt+Z isn't used by another extension

## What's Next?

📖 Read [README.md](README.md) for full documentation

🧪 Check [TESTING.md](TESTING.md) for comprehensive testing guide

🏗️ Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand how it works

---

**You're protected! Start browsing safely with PhishGuard AI 🛡️**
