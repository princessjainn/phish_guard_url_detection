# PhishGuard AI - Testing Guide

## Test Phishing Sites

PhishGuard AI includes built-in test URLs that will **always be blocked** to demonstrate the protection features. These URLs don't actually exist but will trigger the blocking mechanism.

### How to Test Blocking

1. **Load the Chrome Extension**
   - Follow installation instructions in README.md
   - Make sure the API is running (`python main.py`)

2. **Try to Visit a Test Phishing Site**

Simply type any of these URLs in Chrome's address bar and press Enter:

```
http://secure-paypal-verify.tk
http://account-login-verify.ml
http://google-security-alert.ga
http://apple-id-unlock.cf
http://amazon-account-suspended.xyz
http://bank-security-update.online
http://microsoft-account-verify.top
http://netflix-payment-update.site
https://goog1e.com
https://amaz0n.com
https://paypa1.com
https://app1e.com
http://verify-your-account-now.tk
http://update-payment-info.ml
http://confirm-identity-urgent.ga
http://account-will-be-closed.xyz
```

3. **What Should Happen**

When you try to visit any test phishing site:
- ✅ Page is **blocked immediately** before loading
- ✅ You see a **warning screen** with red gradient background
- ✅ Warning shows the blocked URL and reason
- ✅ Options to "Go Back to Safety" or "Proceed Anyway"
- ✅ Stats counter increments (Blocked: +1)
- ✅ Extension popup shows updated threat count

### Expected Blocking Screen

```
┌─────────────────────────────────────────┐
│  🚨                                      │
│                                          │
│  Phishing Site Blocked                   │
│  PhishGuard AI prevented you from        │
│  visiting a dangerous website            │
│                                          │
│  BLOCKED URL:                            │
│  http://secure-paypal-verify.tk          │
│                                          │
│  This site has been identified as a      │
│  phishing attempt.                       │
│                                          │
│  [⬅️ Go Back to Safety]  [⚠️ Proceed]   │
└─────────────────────────────────────────┘
```

## Testing Different Features

### 1. Zero-Click Auto-Blocking (Default)

**Test:** Navigate to `http://google-security-alert.ga`

**Expected Result:**
- Page blocked automatically
- Warning screen appears
- No user interaction needed
- Stats updated automatically

### 2. Manual URL Scanning

**Test:** 
1. Click PhishGuard AI icon
2. Visit `https://github.com` (safe site)
3. Click "Scan Current Page"
4. Press `Alt+Z` keyboard shortcut

**Expected Result:**
- Safety score: 75-100 (Safe)
- Status: ✅ SAFE
- Green indicators

### 3. Popup Warning on Hover

**Test:**
1. Visit any webpage
2. Create a test link: Open DevTools console and run:
```javascript
document.body.innerHTML += '<a href="http://paypa1.com" style="display:block;padding:20px;font-size:20px;">Hover over this phishing link</a>';
```
3. Hover your mouse over the link

**Expected Result:**
- Red border appears around link
- Tooltip warning appears
- Link marked as dangerous

### 4. Fake Login Form Detection

**Test:**
1. Create a test page with fake login form
2. Open DevTools console and run:
```javascript
document.body.innerHTML = '<h1>Google Login</h1><form><input type="email" placeholder="Email"><input type="password" placeholder="Password"><button>Sign In</button></form>';
```
3. Wait 2 seconds

**Expected Result:**
- Warning banner appears at top
- Message: "Contains Google login form but not on Google's domain"
- Options to proceed or go back

### 5. Keyboard Shortcut

**Test:**
1. Visit any website
2. Press `Alt+Z`

**Expected Result:**
- Scan initiated automatically
- Toast notification appears
- Results shown in popup
- Notification with safety score

### 6. Stats Dashboard

**Test:**
1. Visit 3 test phishing sites
2. Scan 2 safe sites manually
3. Click "Report Phishing Site" once
4. Open extension popup

**Expected Result:**
- Blocked: 3
- Scanned: 5
- Reports: 1

## API Testing

### Test Health Endpoint

```bash
curl http://localhost:5000/health
```

**Expected:**
```json
{
  "status": "online",
  "model_trained": true
}
```

### Test Real Phishing Detection

```bash
# Test with IP address (usually phishing)
curl -X POST http://localhost:5000/api/check \
  -H "Content-Type: application/json" \
  -d '{"url": "http://192.168.1.1/login.php"}'
```

**Expected:**
- Low safety score (0-49)
- risk_level: "phishing"
- Explanations about IP address usage

### Test Safe URL

```bash
curl -X POST http://localhost:5000/api/check \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}'
```

**Expected:**
- High safety score (75-100)
- risk_level: "safe"
- Clean bill of health

## Common Test Scenarios

### Scenario 1: First-Time User
1. Install extension
2. Visit `http://amazon-account-suspended.xyz`
3. See blocking page
4. Click "Go Back to Safety"
5. Check stats: Blocked: 1

### Scenario 2: Power User
1. Press `Alt+Z` on current page
2. Check safety score
3. Visit known phishing site
4. Auto-blocked
5. Report the site

### Scenario 3: Hovering Links
1. Visit any news website
2. Add test phishing link via console
3. Hover over it
4. See red border warning
5. Don't click, navigate away safely

## Troubleshooting Tests

### Test Not Working?

**Problem:** Phishing sites not being blocked

**Solutions:**
1. Check auto-block is enabled (settings)
2. Refresh extension: `chrome://extensions/` → reload
3. Check API is running: `curl http://localhost:5000/health`
4. Check browser console for errors (F12)

**Problem:** Warning page not showing

**Solutions:**
1. Verify `web_accessible_resources` in manifest.json
2. Check `blocked.html` exists in chrome-extension folder
3. Reload extension
4. Try incognito mode

**Problem:** Stats not updating

**Solutions:**
1. Clear extension storage:
```javascript
chrome.storage.sync.clear()
```
2. Reload extension
3. Reset stats in popup settings

## Performance Testing

### Test Scan Speed

Run this in browser console on extension popup:

```javascript
console.time('scan');
// Click "Scan Current Page"
// Then in console:
console.timeEnd('scan');
```

**Expected:** <100ms for cached URLs, <500ms for new scans

### Test Cache Effectiveness

1. Scan a URL
2. Scan same URL again immediately
3. Second scan should be instant (<10ms)

## Real-World Testing

### Safe Sites (Should NOT Block)
- https://google.com
- https://github.com
- https://stackoverflow.com
- https://wikipedia.org
- https://amazon.com

### Actually Dangerous (Use with caution)
**WARNING: Don't visit real phishing sites unless in a VM/sandbox**

Use testing tools instead:
- PhishTank (phishtank.org) - Database of verified phishing
- OpenPhish (openphish.com) - Real-time phishing feed

## Automated Testing (Future)

Create `test.js` for automated tests:

```javascript
// Puppeteer test example
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`
    ]
  });
  
  const page = await browser.newPage();
  
  // Test blocking
  await page.goto('http://secure-paypal-verify.tk');
  
  // Check for blocked.html
  const content = await page.content();
  assert(content.includes('Phishing Site Blocked'));
  
  await browser.close();
})();
```

## Success Criteria

✅ **All tests pass if:**
1. Test phishing sites are blocked automatically
2. Warning page renders correctly
3. Safe sites are not blocked
4. Stats update correctly
5. Keyboard shortcut works
6. API returns accurate results
7. No console errors
8. Performance under 500ms per scan

---

**Need Help?** Check README.md or chrome-extension/README.md for detailed documentation.
