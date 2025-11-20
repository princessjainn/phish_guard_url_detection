# PhishGuard AI - Chrome Extension

**Real-time phishing protection powered by AI**

## 🚀 Quick Installation Guide

### Step 1: Install the Extension

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Select the `chrome-extension` folder from this project
6. PhishGuard AI icon will appear in your toolbar

### Step 2: Start the Backend API

```bash
# From the project root directory
python main.py
```

The API runs on `http://localhost:5000`

### Step 3: Configure API Connection

1. Click the PhishGuard AI icon in Chrome toolbar
2. Click the settings icon (⚙️) at the top right
3. Verify API URL is `http://localhost:5000`
4. Click **"Save"**
5. Check that status shows "Connected to API" with green dot

## ✨ Features

### Automatic Protection
- **Zero-click blocking** - Phishing sites blocked before loading
- **Real-time URL scanning** - Every page is checked automatically
- **Fake login detection** - Identifies phishing forms on the page
- **Smart caching** - Fast repeated scans with intelligent cache

### Manual Scanning
- Click extension icon → "Scan Current Page"
- Use keyboard shortcut: **Alt+Z** (all platforms)
- Hover over links for background scanning

### User Interface
- **Modern glassmorphism design** with smooth animations
- **Circular safety gauge** (0-100 score)
- **Dark/light mode** toggle
- **Live stats dashboard** - Blocked, Scanned, Reports
- **Toast notifications** - Subtle, non-intrusive alerts

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt+Z` | Scan current page (all platforms) |

**Customize shortcuts:**
1. Go to `chrome://extensions/shortcuts`
2. Find "PhishGuard AI"
3. Click the edit icon to change shortcuts

## 🎯 How It Works

### Automatic Scanning (Zero-Click)

1. You navigate to any website
2. Background script intercepts the URL
3. URL is sent to backend API for ML analysis
4. If phishing detected → Page is blocked instantly
5. You see a warning page with option to go back

### Manual Scanning

1. Click extension icon or press `Ctrl+Shift+S`
2. Current page URL is analyzed
3. Safety score (0-100) is displayed
4. Explainable AI shows why the site is safe/dangerous
5. Stats are updated automatically

### Link Hover Scanning

1. Hover your mouse over any link
2. Extension scans the link in background
3. Dangerous links get red border + warning tooltip
4. No need to click to check safety

## 📊 Understanding Results

### Safety Scores

| Score | Risk Level | Meaning |
|-------|-----------|---------|
| 75-100 | ✅ Safe | Trusted site, low risk |
| 50-74 | ⚠️ Suspicious | Proceed with caution |
| 0-49 | 🚨 Phishing | High risk, likely malicious |

### Explainable AI

The extension shows exactly why a URL was flagged:

- ⚠️ Unusually long URL
- 🔓 Not using HTTPS
- 🚨 IP address instead of domain
- ⚠️ Suspicious keywords detected
- 🚨 High-risk domain extension
- ⚠️ Domain contains many numbers

## 🛡️ Protection Features

### Real-Time Blocking

- Malicious URLs blocked **before** page loads
- No user interaction required
- Blocked page shows detailed warning
- Option to proceed anyway (not recommended)

### Fake Login Detection

Detects phishing pages impersonating:
- Google/Gmail
- PayPal
- Amazon
- Microsoft
- Apple
- Facebook/Instagram
- Banking sites

**How it works:**
- Scans for login forms on the page
- Compares page content with actual domain
- Alerts if mismatch detected

## ⚙️ Settings

### API Configuration

**Default:** `http://localhost:5000`

**For remote API:**
```
https://your-phishguard-api.com
```

**For Replit deployment:**
```
https://your-repl-name.your-username.repl.co
```

### Auto-Block Toggle

Enable/disable automatic phishing blocking:
- **ON** (default): Dangerous sites blocked automatically
- **OFF**: Warning shown but page loads

### Theme

- **Dark mode** (default): Modern dark blue gradient
- **Light mode**: Clean white with subtle gradients

## 🐛 Troubleshooting

### Extension Not Working

**Problem:** Extension icon is grayed out
- **Solution:** Refresh the page you're on

**Problem:** "API offline" message
- **Solution:** Start the backend API with `python main.py`

**Problem:** Extension doesn't appear
- **Solution:** Make sure Developer mode is enabled in `chrome://extensions/`

### API Connection Issues

**Check API is running:**
```bash
curl http://localhost:5000/health
```

**Expected response:**
```json
{
  "status": "online",
  "model_trained": true
}
```

**Check firewall:**
- Ensure port 5000 is not blocked
- Disable antivirus temporarily to test

### Performance Issues

**Problem:** Slow scanning
- **Solution:** API caches results for 5 minutes per URL
- **Solution:** Close other Chrome tabs

**Problem:** High memory usage
- **Solution:** Cache is limited to 100 URLs max
- **Solution:** Restart Chrome to clear cache

## 🔐 Privacy

### What We Collect
- **Nothing!** Zero data collection

### What We Store Locally
- API URL setting
- Theme preference
- Stats (blocked, scanned, reports)
- URL scan cache (5-minute expiry)

### What We Send to API
- Only URLs you visit (for scanning)
- No personal information
- No browsing history stored

## 🚀 Advanced Usage

### Using with Remote API

1. Deploy the Flask API to a server (Replit, AWS, Heroku, etc.)
2. Get the public URL
3. Update extension settings with new API URL
4. Extension works from anywhere!

### Reporting Phishing Sites

1. Visit a suspected phishing site
2. Click PhishGuard AI icon
3. Click "Report Phishing Site"
4. Report is logged (future: sent to community database)

### Viewing Stats

Stats are shown in the popup:
- **Blocked**: Phishing sites automatically blocked
- **Scanned**: Total URLs analyzed
- **Reports**: Phishing reports submitted

**Reset stats:**
```javascript
// In Chrome DevTools console on popup
chrome.storage.sync.set({stats: {blocked: 0, scanned: 0, reports: 0}})
```

## 📱 Chrome Extension Permissions

### Required Permissions

| Permission | Why Needed |
|-----------|-----------|
| `activeTab` | Access current page URL |
| `tabs` | Update tabs when blocking |
| `storage` | Save settings and stats |
| `webNavigation` | Intercept URLs before load |
| `notifications` | Show scan results |
| `<all_urls>` | Scan any website |

**All permissions are necessary for protection features.**

## 🎨 Customization

### Change Colors

Edit `styles.css`:

```css
:root {
    --accent-blue: #3b82f6;    /* Change primary color */
    --accent-purple: #8b5cf6;  /* Change secondary color */
}
```

### Change Icons

Replace files in `icons/` folder:
- `icon16.png` - 16x16px
- `icon48.png` - 48x48px
- `icon128.png` - 128x128px

### Change Keyboard Shortcut

1. Go to `chrome://extensions/shortcuts`
2. Find "Scan current page"
3. Click edit icon
4. Press your preferred key combination

## 🔄 Updates

### Manual Update

1. Pull latest code from repository
2. Go to `chrome://extensions/`
3. Click refresh icon on PhishGuard AI
4. New features available instantly!

### Auto-Update (Future)

When published to Chrome Web Store, updates are automatic.

## 💡 Tips

1. **Keep API running** - Extension needs backend to function
2. **Use keyboard shortcut** - Faster than clicking icon
3. **Check stats regularly** - See how many threats blocked
4. **Report false positives** - Help improve the model
5. **Enable auto-block** - Maximum protection

## 🆘 Support

### Common Issues

**Q: Extension blocks legitimate sites**
- A: Check Explainable AI to understand why
- A: Report false positive for model improvement

**Q: Extension not blocking known phishing site**
- A: Model is 99.41% accurate, not perfect
- A: Retrain model with more recent data

**Q: Keyboard shortcut not working**
- A: Check `chrome://extensions/shortcuts`
- A: Ensure no conflict with other extensions

### Getting Help

1. Check this README first
2. Check main project README
3. Review console logs (`Ctrl+Shift+J`)
4. Check background script logs in extension page

## 📚 Resources

- [Main Project README](../README.md)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)

---

**Stay safe online with PhishGuard AI! 🛡️**
