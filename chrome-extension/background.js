let API_URL = 'http://localhost:5000';
let autoBlockEnabled = true;
let scannedUrls = new Map();

const TEST_PHISHING_SITES = [
    'secure-paypal-verify.tk',
    'account-login-verify.ml',
    'google-security-alert.ga',
    'apple-id-unlock.cf',
    'amazon-account-suspended.xyz',
    'bank-security-update.online',
    'microsoft-account-verify.top',
    'netflix-payment-update.site',
    'paypal-resolution-center.tk',
    'facebook-security-check.ml',
    'goog1e.com',
    'amaz0n.com',
    'paypa1.com',
    'app1e.com',
    'verify-your-account-now.tk',
    'update-payment-info.ml',
    'confirm-identity-urgent.ga',
    'account-will-be-closed.xyz'
];

function isTestPhishingSite(url) {
    const urlLower = url.toLowerCase();
    return TEST_PHISHING_SITES.some(domain => urlLower.includes(domain));
}

chrome.storage.sync.get(['apiUrl', 'autoBlock'], function(result) {
    if (result.apiUrl) {
        API_URL = result.apiUrl;
    }
    if (result.autoBlock !== undefined) {
        autoBlockEnabled = result.autoBlock;
    }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.apiUrl) {
        API_URL = changes.apiUrl.newValue;
    }
    if (changes.autoBlock) {
        autoBlockEnabled = changes.autoBlock.newValue;
    }
});

chrome.runtime.onInstalled.addListener(() => {
    console.log('PhishGuard AI installed and protecting you!');
    
    chrome.storage.sync.set({
        stats: { blocked: 0, scanned: 0, reports: 0 },
        autoBlock: true
    });
});

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    if (details.frameId !== 0) return;
    
    const url = details.url;
    
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || 
        url.startsWith('about:') || url.startsWith('edge://')) {
        return;
    }
    
    const result = await scanUrlQuick(url);
    
    if (result && result.risk_level === 'phishing' && autoBlockEnabled) {
        chrome.tabs.update(details.tabId, {
            url: chrome.runtime.getURL('blocked.html') + '?url=' + encodeURIComponent(url) + '&reason=' + encodeURIComponent(result.vibe)
        });
        
        chrome.storage.sync.get(['stats'], (data) => {
            const stats = data.stats || { blocked: 0, scanned: 0, reports: 0 };
            stats.blocked++;
            chrome.storage.sync.set({ stats });
        });
    }
    
    chrome.storage.sync.set({ currentPageScore: result ? result.safety_score : 0 });
});

async function scanUrlQuick(url) {
    if (isTestPhishingSite(url)) {
        return {
            url: url,
            safety_score: 5,
            risk_level: 'phishing',
            emoji: '🚨',
            vibe: 'major red flags - this is a test phishing site',
            phishing_probability: 99.9,
            explanations: [
                '🚨 Known phishing domain pattern',
                '⚠️ Suspicious domain extension (.tk, .ml, .ga)',
                '⚠️ Domain impersonating legitimate brand',
                '🔓 High-risk phishing indicators detected'
            ],
            details: {
                url_length: url.length,
                https: url.startsWith('https'),
                sus_keywords: 5
            }
        };
    }
    
    if (scannedUrls.has(url)) {
        const cached = scannedUrls.get(url);
        if (Date.now() - cached.timestamp < 300000) {
            return cached.result;
        }
    }
    
    try {
        const response = await fetch(`${API_URL}/api/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url }),
            signal: AbortSignal.timeout(5000)
        });
        
        if (!response.ok) {
            return null;
        }
        
        const result = await response.json();
        
        scannedUrls.set(url, {
            result: result,
            timestamp: Date.now()
        });
        
        if (scannedUrls.size > 100) {
            const firstKey = scannedUrls.keys().next().value;
            scannedUrls.delete(firstKey);
        }
        
        return result;
        
    } catch (error) {
        console.error('PhishGuard scan error:', error);
        return null;
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'scanUrl') {
        scanUrlQuick(request.url).then(result => {
            sendResponse({ result: result });
        });
        return true;
    }
    
    if (request.action === 'reportPhishing') {
        chrome.storage.sync.get(['stats'], (data) => {
            const stats = data.stats || { blocked: 0, scanned: 0, reports: 0 };
            stats.reports++;
            chrome.storage.sync.set({ stats });
        });
        sendResponse({ success: true });
        return true;
    }
});

chrome.commands.onCommand.addListener((command) => {
    if (command === 'scan-current-page') {
        // Prefer to open the extension popup (MV3 API). If not available, fallback to opening popup.html in a new tab.
        if (chrome.action && chrome.action.openPopup) {
            chrome.action.openPopup().catch((err) => {
                console.error('Failed to open popup via chrome.action.openPopup():', err);
                // Fallback: open popup page in a new tab
                const popupUrl = chrome.runtime.getURL('popup.html');
                chrome.tabs.create({ url: popupUrl });
            });
        } else {
            const popupUrl = chrome.runtime.getURL('popup.html');
            chrome.tabs.create({ url: popupUrl });
        }
    }
});
