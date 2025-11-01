# When NOT to Deploy: A Hyperparameter Tuning Investigation

We ran 50 trials of Bayesian optimization on our fraud detection model and got validation PR-AUC to improve by 4.7%. Good news, right? Not quite.

When we evaluated on the test set, we discovered the tuned model would have **increased operational costs by $43,870** (+9.2%) compared to our baseline. This is the story of how systematic diagnostics caught that issue before deployment.

## What We Did

**Optimization Setup:**
- Framework: Optuna with Tree-structured Parzen Estimator
- Search space: 9 LightGBM hyperparameters
- Trials: 50 iterations with early pruning
- Target metric: Validation PR-AUC
- Validation: Bootstrap significance testing (1,000 samples)

**Baseline Reference:**
- ROC-AUC: 0.8861 (target: ≥0.85)
- PR-AUC: 0.4743 (target: ≥0.35)
- Cost savings: $225,625 at optimal threshold
- Training time: 8.35 seconds

The baseline already exceeded our success criteria, but we wanted to see if tuning could push performance further.

## What Happened

| Metric | Baseline | Tuned | Change |
|--------|----------|-------|--------|
| Validation PR-AUC | 0.4743 | 0.4967 | +4.7% ✅ |
| Test PR-AUC | 0.4743 | 0.4705 | -0.8% ❌ |
| Statistical Significance | - | p = 0.27 | Not significant |

The tuned model improved validation metrics but actually performed worse on test data. Bootstrap testing confirmed this wasn't statistically significant.

**Business Impact:**

At a fraud-rate-aligned threshold (3.44%):
- Baseline: 3,990 fraud caught, 93,912 false positives → Cost: $476,960
- Tuned: 4,026 fraud caught (+36), 103,856 false positives (+9,944) → Cost: $520,830

The tuned model caught 36 more fraud cases but triggered 9,944 additional manual reviews. At $5 per false positive review, that's a net cost increase of $43,870, a 9.2% jump in operational expenses.

## Why This Happened: Diagnostic Investigation

We ran four diagnostics to understand the root cause. Here's what we found.

### 1. Temporal Drift

Validation and test sets showed significant distribution differences:
- Fraud rate: 3.90% (validation) vs 3.44% (test) = 13.46% relative difference
- Feature drift: 9 out of 10 top features showed significant KS test results (p < 0.05)

This is common in fraud detection. Attack patterns evolve over time, so the validation set didn't fully represent future production conditions.

### 2. Prediction Similarity

Despite different hyperparameters, the models produced nearly identical predictions:
- Pearson correlation: r = 0.9674 (>0.95 indicates high similarity)
- Disagreement rate: Only 8.68% of samples
- Disagreement pattern: Concentrated on fraud cases (6.17% fraud rate in disagreements vs 3.44% overall)

Both models were making similar scoring decisions overall.

### 3. Feature Importance Instability

This is where things got interesting. The models produced similar predictions but relied on completely different features:

| Feature | Baseline Importance | Tuned Importance | Shift |
|---------|---------------------|------------------|-------|
| V258 | 11.14% | 4.24% | -6.89% |
| V294 | 6.44% | 0.83% | -5.61% |
| V70 | 1.64% | 6.06% | +4.42% |
| C1 | 1.97% | 5.11% | +3.14% |

- Feature importance correlation: 0.76 (< 0.85 threshold indicates instability)
- Prediction correlation: 0.97 (> 0.95 indicates similarity)

This revealed the problem: the tuned model learned validation-specific patterns rather than generalizable fraud signals. It found features that worked on validation data but didn't transfer to the test set.

### 4. Sample-Level Impact

Breaking down where predictions changed:
- True positive gains: 36 fraud cases
- False positive additions: 9,944 legitimate transactions
- Cost impact: +$49,720 (FP) - $3,600 (FN) = +$46,120 net increase

The precision collapsed. For every additional fraud case caught, we flagged 276 legitimate transactions.

## The Decision

We selected the baseline model for production.

**Reasoning:**
1. Meets all success criteria (ROC-AUC 0.8861 > 0.85, PR-AUC 0.4743 > 0.35)
2. $43,870 cost advantage over tuned model
3. More stable feature reliance (less likely to degrade on new fraud patterns)
4. No statistical evidence of test set improvement

This wasn't about finding the "best" model. It was about preventing a costly deployment mistake.

## Key Lessons

### 1. Validation metrics don't tell the whole story

A 4.7% validation improvement translated to a -0.8% test decline and a $43K cost increase. We learned to:
- Always evaluate on holdout test sets
- Use statistical significance testing (not just point metrics)
- Consider temporal splits for time-series data

### 2. Feature importance stability matters

The 0.76 feature importance correlation revealed overfitting that the 0.97 prediction correlation missed. Production monitoring should track:
- Feature importance drift alongside prediction drift
- Major shifts in which features drive decisions
- Validation-specific patterns vs generalizable signals

### 3. Business metrics drive deployment decisions

AUC improved but cost increased. This misalignment taught us that:
- Accuracy metrics (AUC, F1) don't capture operational reality
- Cost-sensitive thresholds can change model selection entirely
- Define business constraints early, optimize for them directly

## What This Means for Production ML

Payment fraud detection operates in an adversarial environment where patterns shift constantly. Models need temporal robustness, not just validation performance.

Our diagnostic framework (temporal drift detection, feature stability analysis, business impact quantification, and statistical validation) caught what standard evaluation would have missed. The $43,870 we avoided losing is as valuable as the $225,625 our baseline saves.

For ML teams working on fraud detection, credit risk, or other temporal data: sometimes the best model update is no update at all. Build the diagnostics to know the difference.

## Artifacts

All code and artifacts available in this repository:
- Model: `packages/models/fraud_baseline_v1.txt` (1.18 MB, LightGBM)
- Evaluation: `packages/models/fraud_baseline_v1_evaluation.json`
- Feature importance: `packages/models/fraud_baseline_v1_feature_importance.csv`
- Diagnostic notebook: `notebooks/03_model_training.ipynb` (cells 60-65)

**Dataset:** IEEE-CIS Fraud Detection (590K transactions, 3.5% fraud rate)  
**License:** Non-commercial research use only

---

*Part of Devbrew's AI engineering research for fintech and payments.*

