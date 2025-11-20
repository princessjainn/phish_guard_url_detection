let scannedLinks = new Set();

function createWarningBanner(message, severity = 'warning') {
    const existingBanner = document.getElementById('phishguard-banner');
    if (existingBanner) {
        existingBanner.remove();
    }
    
    const banner = document.createElement('div');
    banner.id = 'phishguard-banner';
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, ${severity === 'danger' ? '#ef4444' : '#f59e0b'}, ${severity === 'danger' ? '#dc2626' : '#d97706'});
        color: white;
        padding: 16px 20px;
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: slideDown 0.3s ease-out;
    `;
    
    banner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
                <div style="font-weight: 700; font-size: 14px; margin-bottom: 2px;">⚠️ PhishGuard Warning</div>
                <div style="font-size: 12px; opacity: 0.95;">${message}</div>
            </div>
        </div>
        <div style="display: flex; gap: 10px;">
            <button id="phishguard-proceed" style="
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
            ">Proceed Anyway</button>
            <button id="phishguard-close" style="
                background: white;
                border: none;
                color: #1f2937;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
            ">Go Back</button>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.insertBefore(banner, document.body.firstChild);
    
    document.getElementById('phishguard-close').addEventListener('click', () => {
        window.history.back();
    });
    
    document.getElementById('phishguard-proceed').addEventListener('click', () => {
        banner.remove();
    });
    
    setTimeout(() => {
        if (banner.parentElement) {
            banner.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => banner.remove(), 300);
        }
    }, 10000);
}

function detectFakeLoginForms() {
    const forms = document.querySelectorAll('form');
    const suspiciousBrands = ['google', 'gmail', 'paypal', 'amazon', 'microsoft', 'apple', 'facebook', 'instagram', 'twitter', 'bank'];
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[type="password"], input[type="email"], input[name*="user"], input[name*="login"]');
        
        if (inputs.length > 0) {
            const pageText = document.body.innerText.toLowerCase();
            const pageUrl = window.location.hostname.toLowerCase();
            
            for (const brand of suspiciousBrands) {
                if (pageText.includes(brand) && !pageUrl.includes(brand)) {
                    createWarningBanner(
                        `This page contains a ${brand} login form but is not hosted on ${brand}'s official domain. This could be a phishing attempt.`,
                        'danger'
                    );
                    return;
                }
            }
        }
    });
}

function scanLinks() {
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
        if (scannedLinks.has(link.href)) return;
        
        link.addEventListener('mouseenter', async () => {
            if (scannedLinks.has(link.href)) return;
            
            scannedLinks.add(link.href);
            
            chrome.runtime.sendMessage(
                { action: 'scanUrl', url: link.href },
                (response) => {
                    if (response && response.result && response.result.risk_level === 'phishing') {
                        link.style.cssText += `
                            border: 2px solid #ef4444 !important;
                            background-color: rgba(239, 68, 68, 0.1) !important;
                            padding: 2px 4px !important;
                            border-radius: 4px !important;
                        `;
                        
                        link.title = `⚠️ PhishGuard Warning: This link may be dangerous (Safety Score: ${response.result.safety_score}/100)`;
                    }
                }
            );
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        detectFakeLoginForms();
        scanLinks();
    });
} else {
    detectFakeLoginForms();
    scanLinks();
}

const observer = new MutationObserver(() => {
    scanLinks();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log('PhishGuard AI is protecting this page 🛡️');
