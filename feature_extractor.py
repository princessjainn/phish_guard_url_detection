import re
import tldextract
from urllib.parse import urlparse
import socket

class URLFeatureExtractor:
    def __init__(self):
        self.suspicious_keywords = [
            'login', 'signin', 'account', 'verify', 'secure', 'update',
            'confirm', 'banking', 'paypal', 'ebay', 'amazon', 'apple',
            'microsoft', 'google', 'facebook', 'password', 'wallet'
        ]
        
        self.phishing_tlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top']
    
    def extract_features(self, url):
        features = {}
        explanation = []
        
        if not url.startswith('http'):
            url = 'http://' + url
        
        parsed = urlparse(url)
        ext = tldextract.extract(url)
        
        features['url_length'] = len(url)
        if len(url) > 75:
            explanation.append(f"⚠️ Unusually long URL ({len(url)} characters)")
        
        features['domain_length'] = len(ext.domain) if ext.domain else 0
        
        features['has_https'] = 1 if parsed.scheme == 'https' else 0
        if not features['has_https']:
            explanation.append("🔓 Not using HTTPS (unsecure)")
        
        features['num_dots'] = url.count('.')
        if features['num_dots'] > 4:
            explanation.append(f"⚠️ Too many subdomains ({features['num_dots']} dots)")
        
        features['num_hyphens'] = url.count('-')
        if features['num_hyphens'] > 2:
            explanation.append(f"⚠️ Suspicious use of hyphens ({features['num_hyphens']})")
        
        features['num_underscores'] = url.count('_')
        
        features['num_at_symbols'] = url.count('@')
        if features['num_at_symbols'] > 0:
            explanation.append("🚨 Contains @ symbol (common phishing technique)")
        
        features['num_question_marks'] = url.count('?')
        
        features['num_ampersands'] = url.count('&')
        
        features['num_equals'] = url.count('=')
        
        features['has_ip_address'] = 1 if self._has_ip_address(parsed.netloc) else 0
        if features['has_ip_address']:
            explanation.append("🚨 Using IP address instead of domain name")
        
        features['num_suspicious_keywords'] = sum(
            1 for keyword in self.suspicious_keywords 
            if keyword in url.lower()
        )
        if features['num_suspicious_keywords'] > 0:
            explanation.append(f"⚠️ Contains {features['num_suspicious_keywords']} suspicious keyword(s)")
        
        features['has_suspicious_tld'] = 1 if any(
            url.endswith(tld) for tld in self.phishing_tlds
        ) else 0
        if features['has_suspicious_tld']:
            explanation.append("🚨 Uses high-risk domain extension")
        
        features['num_special_chars'] = len(re.findall(r'[^a-zA-Z0-9]', url))
        
        features['subdomain_count'] = len(ext.subdomain.split('.')) if ext.subdomain else 0
        
        features['path_length'] = len(parsed.path)
        
        features['has_port'] = 1 if parsed.port else 0
        
        digit_ratio = len(re.findall(r'\d', ext.domain)) / len(ext.domain) if ext.domain and len(ext.domain) > 0 else 0
        features['digit_ratio_in_domain'] = digit_ratio
        if digit_ratio > 0.3:
            explanation.append("⚠️ Domain contains many numbers")
        
        return features, explanation
    
    def _has_ip_address(self, netloc):
        try:
            socket.inet_aton(netloc.split(':')[0])
            return True
        except socket.error:
            return False
    
    def get_feature_names(self):
        return [
            'url_length', 'domain_length', 'has_https', 'num_dots', 
            'num_hyphens', 'num_underscores', 'num_at_symbols',
            'num_question_marks', 'num_ampersands', 'num_equals',
            'has_ip_address', 'num_suspicious_keywords', 'has_suspicious_tld',
            'num_special_chars', 'subdomain_count', 'path_length',
            'has_port', 'digit_ratio_in_domain'
        ]
