let API_URL = 'http://localhost:5000';
let stats = { blocked: 0, scanned: 0, reports: 0 };

chrome.storage.sync.get(['apiUrl', 'stats'], function(result) {
    if (result.apiUrl) {
        API_URL = result.apiUrl;
        document.getElementById('apiUrl').value = API_URL;
    }
    if (result.stats) {
        stats = result.stats;
        updateStatsDisplay();
    }
    checkAPIStatus();
});

document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    chrome.storage.sync.set({ theme: isLight ? 'light' : 'dark' });
});

chrome.storage.sync.get(['theme'], function(result) {
    if (result.theme === 'light') {
        document.body.classList.add('light-mode');
    }
});

document.getElementById('settingsToggle').addEventListener('click', function() {
    const content = document.getElementById('settingsContent');
    const toggle = document.getElementById('settingsToggle');
    content.classList.toggle('active');
    toggle.classList.toggle('active');
});

document.getElementById('saveApi').addEventListener('click', function() {
    const url = document.getElementById('apiUrl').value.trim();
    if (url) {
        API_URL = url;
        chrome.storage.sync.set({ apiUrl: url }, function() {
            showToast('API URL saved successfully!');
            checkAPIStatus();
        });
    }
});

document.getElementById('scanButton').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0]) {
            scanURL(tabs[0].url);
        }
    });
});

document.getElementById('reportButton').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0]) {
            reportPhishing(tabs[0].url);
        }
    });
});

chrome.commands.onCommand.addListener((command) => {
    if (command === 'scan-current-page') {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0]) {
                scanURL(tabs[0].url);
                showToast('Scanning page with Alt+Z shortcut...');
            }
        });
    }
});

async function checkAPIStatus() {
    const statusDot = document.getElementById('statusDot');
    const statusMessage = document.getElementById('statusMessage');
    
    try {
        const response = await fetch(`${API_URL}/health`, { 
            method: 'GET',
            signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
            statusDot.classList.add('online');
            statusDot.classList.remove('offline');
            statusMessage.textContent = 'Connected to API';
        } else {
            throw new Error('API not responding');
        }
    } catch (error) {
        statusDot.classList.add('offline');
        statusDot.classList.remove('online');
        statusMessage.textContent = 'API offline';
    }
}

async function scanURL(url) {
    const button = document.getElementById('scanButton');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const statusBadge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');
    const gaugeProgress = document.getElementById('gaugeProgress');
    
    button.classList.add('scanning');
    button.querySelector('span').textContent = 'Scanning...';
    scoreDisplay.textContent = '...';
    statusText.textContent = 'SCANNING';
    statusBadge.className = 'status-badge';
    
    try {
        const response = await fetch(`${API_URL}/api/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        });
        
        if (!response.ok) {
            throw new Error('API error');
        }
        
        const data = await response.json();
        
        const score = data.safety_score;
        const circumference = 534;
        const offset = circumference - (score / 100) * circumference;
        
        setTimeout(() => {
            scoreDisplay.textContent = score;
            gaugeProgress.style.strokeDashoffset = offset;
            
            if (data.risk_level === 'safe') {
                statusBadge.className = 'status-badge';
                statusText.textContent = 'SAFE';
                gaugeProgress.style.stroke = 'url(#gaugeGradient)';
            } else if (data.risk_level === 'suspicious') {
                statusBadge.className = 'status-badge suspicious';
                statusText.textContent = 'SUSPICIOUS';
                gaugeProgress.style.stroke = '#f59e0b';
            } else {
                statusBadge.className = 'status-badge phishing';
                statusText.textContent = 'PHISHING';
                gaugeProgress.style.stroke = '#ef4444';
            }
            
            stats.scanned++;
            if (data.risk_level === 'phishing') {
                stats.blocked++;
            }
            saveStats();
            updateStatsDisplay();
            
            showToast(`Scan complete: ${data.vibe}`);
        }, 500);
        
    } catch (error) {
        scoreDisplay.textContent = '—';
        statusText.textContent = 'ERROR';
        showToast('Failed to scan URL. Check API connection.');
    } finally {
        button.classList.remove('scanning');
        button.querySelector('span').textContent = 'Scan Current Page';
    }
}

async function reportPhishing(url) {
    stats.reports++;
    saveStats();
    updateStatsDisplay();
    showToast('Phishing report submitted!');
}

function updateStatsDisplay() {
    document.getElementById('blockedCount').textContent = stats.blocked;
    document.getElementById('scannedCount').textContent = stats.scanned;
    document.getElementById('reportsCount').textContent = stats.reports;
}

function saveStats() {
    chrome.storage.sync.set({ stats: stats });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const content = toast.querySelector('.toast-content');
    content.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

checkAPIStatus();
setInterval(checkAPIStatus, 30000);

chrome.storage.sync.get(['currentPageScore'], function(result) {
    if (result.currentPageScore !== undefined) {
        const score = result.currentPageScore;
        document.getElementById('scoreDisplay').textContent = score;
        const circumference = 534;
        const offset = circumference - (score / 100) * circumference;
        document.getElementById('gaugeProgress').style.strokeDashoffset = offset;
    }
});
