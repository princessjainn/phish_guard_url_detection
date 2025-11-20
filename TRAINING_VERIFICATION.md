# PhishGuard AI - Model Training Verification

## Dataset Information

- **Source**: Mendeley Phishing URL Dataset
- **Total URLs**: 450,177 URLs
- **File**: `dataset.csv` (31MB)
- **Composition**: Legitimate and phishing URLs

```bash
$ wc -l dataset.csv
450177 dataset.csv
```

## Training Execution

**Command Run:**
```bash
python train.py 100000
```

**Training Process:**
1. Loaded full dataset from `dataset.csv`
2. Sampled 100,000 URLs randomly (stratified sampling)
3. Extracted 18 features per URL
4. Split into 80% train (80K), 20% test (20K)
5. Trained Random Forest with 150 estimators, max depth 15
6. Saved model to `phishguard_model.pkl` and scaler to `phishguard_scaler.pkl`

## Training Output

```
loading dataset from dataset.csv...
sampled 100000 URLs for training
extracting features from URLs...
processed 5000/100000 URLs
...
processed 100000/100000 URLs
training on 99999 samples...
training accuracy: 99.62%
test accuracy: 99.41%

model saved! you can now run the api
```

## Model Files Generated

```bash
$ ls -lh *.pkl
-rw-r--r-- 1 runner runner 5.9M Nov 20 16:36 phishguard_model.pkl
-rw-r--r-- 1 runner runner  882 Nov 20 16:36 phishguard_scaler.pkl
```

**File Timestamps**: Generated during current session after dataset import

## Model Configuration

From `model.py`:

```python
self.model = RandomForestClassifier(
    n_estimators=150,
    max_depth=15,
    min_samples_split=5,
    random_state=42,
    n_jobs=-1,
    class_weight='balanced'
)
```

## Performance Metrics

| Metric | Value |
|--------|-------|
| Training Accuracy | 99.62% |
| Test Accuracy | **99.41%** |
| Training Samples | 80,000 URLs |
| Test Samples | 20,000 URLs |
| Total Processed | 99,999 URLs |

## Feature Engineering

18 features extracted per URL:
1. url_length
2. domain_length
3. has_https
4. num_dots
5. num_hyphens
6. num_underscores
7. num_at_symbols
8. num_question_marks
9. num_ampersands
10. num_equals
11. has_ip_address
12. num_suspicious_keywords
13. has_suspicious_tld
14. num_special_chars
15. subdomain_count
16. path_length
17. has_port
18. digit_ratio_in_domain

## Reproducibility

To reproduce training:

```bash
# Ensure dataset is present
ls dataset.csv  # Should show 450K+ URLs

# Run training with same parameters
python train.py 100000

# Verify output
ls -lh phishguard_model.pkl phishguard_scaler.pkl
```

**Note**: Random state is fixed (42) for reproducibility, but exact results may vary slightly due to multiprocessing non-determinism.

## Verification Tests

Test the trained model:

```bash
# Start API
python main.py

# Test with known safe URL
curl -X POST http://localhost:5000/api/check \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}'

# Should return high safety score (75-100)
```

## Model Persistence

- Model serialized using Python `pickle`
- Compatible with scikit-learn 1.7.x
- Can be loaded and used immediately without retraining
- Portable across systems with same Python/scikit-learn versions

---

**Verified**: Model successfully trained on 100,000 URLs from 450K dataset with 99.41% test accuracy.

**Training Date**: November 20, 2025
**Training Duration**: ~3 minutes
**Training Environment**: Replit Python 3.11
