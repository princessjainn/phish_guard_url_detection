# 🛡️ Chrome Extension Setup Guide

Super quick guide to get PhishGuard running in Chrome.

## Step 1: Get the API Running

1. Make sure you're in the Replit project
2. The API should already be running on port 5000
3. If not, just hit the "Run" button or restart the workflow

## Step 2: Find Your Replit URL

1. In Replit, look at the Webview panel
2. Your URL will be something like: `https://YOUR-REPL-NAME.YOUR-USERNAME.repl.co`
3. Copy this URL - you'll need it!

## Step 3: Load Extension in Chrome

1. Open Chrome and type `chrome://extensions/` in the address bar
2. Toggle ON "Developer mode" (top right corner)
3. Click "Load unpacked"
4. In the file picker, navigate to your Replit project
5. Select the `chrome-extension` folder
6. Click "Select Folder"

## Step 4: Configure the Extension

1. Click the PhishGuard icon in your Chrome toolbar (🛡️)
2. In the popup, you'll see an API URL input field
3. Paste your Replit URL (from Step 2)
4. Click "save"
5. The status should change to "api: connected ✨"

## Step 5: Test It Out!

1. Navigate to any website
2. Click the PhishGuard icon
3. Click "check this page"
4. See the results! 🎯

## Testing Examples

Try these sites to see it in action:

**Should be safe:**
- github.com
- stackoverflow.com
- replit.com

**Should be flagged:**
- Anything with IP addresses instead of domains
- URLs with lots of hyphens and weird characters
- Fake login pages

## Troubleshooting

### "api: offline 💀"
- Make sure your Replit app is running
- Check that you entered the correct Replit URL
- Try restarting the Replit workflow

### Extension not showing up
- Make sure you selected the `chrome-extension` folder (not the root folder)
- Check that Developer mode is enabled
- Try refreshing the extensions page

### "model not trained yet lol"
- The model needs to be trained first
- Run `python train.py` in the Replit console
- Wait for training to complete (~2-3 minutes)
- Restart the API

## Local Development

If you're running this locally (not on Replit):

1. Start the API: `python main.py`
2. API runs on `http://localhost:5000`
3. In the extension, set API URL to: `http://localhost:5000`
4. Save and you're good to go!

---

that's it fam! you're now protected from phishing scams ✨
