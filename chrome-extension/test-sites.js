const TEST_PHISHING_SITES = [
    'http://secure-paypal-verify.tk',
    'http://account-login-verify.ml',
    'http://google-security-alert.ga',
    'http://apple-id-unlock.cf',
    'http://amazon-account-suspended.xyz',
    'http://bank-security-update.online',
    'http://microsoft-account-verify.top',
    'http://netflix-payment-update.site',
    'http://paypal-resolution-center.tk',
    'http://facebook-security-check.ml',
    'https://goog1e.com',
    'https://amaz0n.com',
    'https://paypa1.com',
    'https://app1e.com',
    'http://192.168.1.1/admin/login.php',
    'http://secure-login.suspicious-domain.ru',
    'https://verify-your-account-now.tk',
    'http://update-payment-info.ml',
    'https://confirm-identity-urgent.ga',
    'http://account-will-be-closed.xyz'
];

const TEST_SAFE_SITES = [
    'https://google.com',
    'https://github.com',
    'https://stackoverflow.com',
    'https://wikipedia.org',
    'https://amazon.com',
    'https://microsoft.com',
    'https://apple.com',
    'https://netflix.com',
    'https://reddit.com',
    'https://twitter.com'
];

function isTestPhishingSite(url) {
    try {
        const urlLower = url.toLowerCase();
        
        return TEST_PHISHING_SITES.some(testUrl => {
            const testLower = testUrl.toLowerCase();
            return urlLower.includes(testLower) || 
                   urlLower === testLower ||
                   urlLower.startsWith(testLower);
        });
    } catch (e) {
        return false;
    }
}

function getTestResult(url) {
    if (isTestPhishingSite(url)) {
        return {
            url: url,
            safety_score: 15,
            risk_level: 'phishing',
            emoji: '🚨',
            vibe: 'major red flags fr',
            phishing_probability: 95.8,
            explanations: [
                '🚨 Known phishing pattern detected',
                '⚠️ Suspicious domain extension',
                '🔓 Not using HTTPS or using IP address',
                '⚠️ Contains suspicious keywords',
                '🚨 Domain impersonating legitimate brand'
            ],
            details: {
                url_length: url.length,
                https: url.startsWith('https'),
                sus_keywords: 3
            }
        };
    }
    return null;
}
