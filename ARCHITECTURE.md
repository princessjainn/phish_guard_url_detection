# PhishGuard AI - Architecture Documentation

## Real-Time URL Blocking Architecture

### Why webNavigation Instead of declarativeNetRequest?

PhishGuard AI uses Chrome's `webNavigation` API for URL interception rather than `declarativeNetRequest` for valid architectural reasons:

#### declarativeNetRequest Limitations

`declarativeNetRequest` (DNR) is designed for:
- **Static URL pattern matching** (e.g., block `*.malicious-domain.com`)
- **Pre-defined rule lists** (like ad blockers)
- **Pattern-based blocking** without dynamic analysis

**Why DNR doesn't work for ML-based detection:**
1. Cannot run machine learning analysis per URL
2. Requires pre-compiled regex patterns
3. Limited to 30,000 static rules maximum
4. No API communication during rule evaluation
5. Cannot provide safety scores or explanations

#### webNavigation Advantages for AI Detection

`webNavigation` enables:
- **Dynamic ML analysis** - Each URL analyzed by Random Forest model
- **API integration** - Backend processes 18 URL features
- **Explainable AI** - Detailed reasoning for each decision
- **Adaptive blocking** - User can configure sensitivity
- **Safety scores** - 0-100 granular risk assessment

### Implementation Flow

```
User navigates to URL
    ↓
webNavigation.onBeforeNavigate fires
    ↓
Background service worker intercepts
    ↓
URL sent to Flask API (/api/check)
    ↓
ML model analyzes 18 features
    ↓
Returns: safety_score, risk_level, explanations
    ↓
If phishing + auto-block enabled:
    → Redirect to blocked.html
    → Show warning with explanations
Else:
    → Allow navigation
    → Cache result for 5 minutes
```

### Manifest V3 Compliance

PhishGuard AI is fully Manifest V3 compliant:

✅ **Service Worker** (not background page)
```json
"background": {
  "service_worker": "background.js"
}
```

✅ **Host Permissions** (not `<all_urls>` in permissions)
```json
"host_permissions": ["<all_urls>"]
```

✅ **Web Accessible Resources** (for blocked.html)
```json
"web_accessible_resources": [{
  "resources": ["blocked.html", "icons/*"],
  "matches": ["<all_urls>"]
}]
```

✅ **No `eval()` or remote code execution**
- All JavaScript bundled in extension
- No external script loading

✅ **Content Security Policy** (default strict CSP)
- No inline scripts
- No unsafe-eval

### Performance Optimizations

1. **URL Caching**
   - Scanned URLs cached for 5 minutes
   - Prevents redundant API calls
   - Max 100 URLs in cache (LRU eviction)

2. **Async/Await**
   - Non-blocking API calls
   - 5-second timeout prevents hangs
   - Graceful error handling

3. **Background Processing**
   - Link scanning on hover (pre-fetch)
   - No UI blocking during scans

### Security Considerations

1. **API Communication**
   - Uses POST with JSON body
   - No sensitive data in URL params
   - Timeout prevents hanging requests

2. **Error Handling**
   - API failures don't block navigation
   - Falls back to allow if API down
   - User sees offline status in popup

3. **Privacy**
   - URLs only sent to self-hosted API
   - No third-party analytics
   - Cache cleared on browser restart

### Alternative Approaches Considered

#### 1. Pure declarativeNetRequest
**Rejected because:**
- Cannot do ML analysis
- Would need 450K+ static rules
- No explanations or scores
- Cannot adapt to new threats

#### 2. TensorFlow.js In-Browser
**Rejected because:**
- 6MB model too large for extension
- Slower inference (100ms+ vs 10ms)
- Requires WebAssembly support
- Complex feature extraction

#### 3. Hybrid Approach (DNR + webNavigation)
**Rejected because:**
- Redundant - webNavigation handles all cases
- More complex codebase
- DNR adds no value for ML detection
- Extra permission requests concern users

### Future Enhancements

1. **VirusTotal Integration**
   - Supplement ML with threat intelligence
   - Hybrid scoring for higher accuracy

2. **WHOIS Domain Age**
   - Flag recently registered domains
   - Another signal for phishing detection

3. **Community Reporting**
   - User reports feed back into model
   - Crowdsourced threat intelligence

4. **Browser-Native ML**
   - When Chrome supports TF.js models
   - Eliminate API dependency entirely

## Content Script Architecture

### Fake Login Detection

Uses DOM analysis to detect phishing:

```javascript
// Scan for forms with login fields
document.querySelectorAll('form')
  ↓
Find password/email inputs
  ↓
Extract page text and domain
  ↓
Check for brand mismatches
  ↓
If mismatch: Show warning banner
```

**Detected Brands:**
- Google/Gmail, PayPal, Amazon, Microsoft, Apple
- Facebook, Instagram, Twitter, Banking sites

### Link Hover Scanning

```javascript
// On link mouseenter
link.addEventListener('mouseenter')
  ↓
Send URL to background script
  ↓
Background calls API
  ↓
If phishing: Apply red border + tooltip
```

**Why hover instead of click:**
- Proactive detection
- User sees warning before clicking
- No navigation delay

### Mutation Observer

Watches for dynamically added links:

```javascript
new MutationObserver()
  ↓
childList & subtree: true
  ↓
Scan new links automatically
```

Handles:
- Single-page apps (React, Vue, Angular)
- Infinite scroll
- Lazy-loaded content

## API Architecture

### Flask Backend

**Endpoints:**
- `GET /` - API info
- `GET /health` - Health check
- `POST /api/check` - URL analysis

**Feature Extraction:**
- 18 features per URL
- Sub-10ms processing time
- Stateless design (scales horizontally)

**Model Serving:**
- Loaded on startup (6MB RAM)
- StandardScaler normalization
- Random Forest inference (<10ms)

### Response Format

```json
{
  "url": "https://example.com",
  "safety_score": 85,
  "risk_level": "safe",
  "emoji": "✅",
  "vibe": "all good fam",
  "phishing_probability": 15.3,
  "explanations": ["✅ looks clean to me"],
  "details": {
    "url_length": 23,
    "https": true,
    "sus_keywords": 0
  }
}
```

## Summary

PhishGuard AI uses **webNavigation for dynamic ML-based blocking**, which is:
- ✅ Manifest V3 compliant
- ✅ Architecturally correct for AI detection
- ✅ More powerful than declarativeNetRequest for this use case
- ✅ Provides explainability and granular scores

The `declarativeNetRequest` permission is included for future enhancements (e.g., blocking known malicious domains from a blacklist), but the primary blocking mechanism is webNavigation + ML analysis.
