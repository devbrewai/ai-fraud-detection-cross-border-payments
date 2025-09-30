# Data Catalog

This directory contains datasets used for the fraud detection and sanctions screening research case study.

## Datasets

### 1. IEEE-CIS Fraud Detection

- **Source**: [Kaggle Competition](https://www.kaggle.com/c/ieee-fraud-detection)
- **License**: Non-commercial use only (academic research and education)
- **Location**: `ieee-fraud/`
- **Files**:
  - `train_transaction.csv` - Training transaction data (~590K rows)
  - `train_identity.csv` - Identity information for training set
  - `test_transaction.csv` - Test transaction data
  - `test_identity.csv` - Identity information for test set
  - `sample_submission.csv` - Submission format reference

### 2. PaySim Synthetic Dataset

- **Source**: [Kaggle - Synthetic Financial Datasets](https://www.kaggle.com/datasets/ealaxi/paysim1)
- **License**: Open data
- **Location**: `paysim/`
- **Description**: Synthetic mobile money transactions based on real financial logs

### 3. OFAC Sanctions Lists

- **Source**: [U.S. Treasury Department](https://sanctionssearch.ofac.treas.gov/)
- **License**: Public domain (U.S. Government data)
- **Location**: `ofac/`
- **Files**:
  - SDN List (Specially Designated Nationals)
  - Consolidated Sanctions List

## Setup Instructions

### Prerequisites

```bash
# Install Kaggle CLI
pip install kaggle

# Set up Kaggle API credentials
# 1. Go to https://www.kaggle.com/account
# 2. Click "Create New API Token"
# 3. Place the downloaded kaggle.json in ~/.kaggle/
mkdir -p ~/.kaggle
mv ~/Downloads/kaggle.json ~/.kaggle/
chmod 600 ~/.kaggle/kaggle.json
```

### 1. Download IEEE-CIS Fraud Detection Dataset

```bash
cd data_catalog

# Accept competition rules first at:
# https://www.kaggle.com/c/ieee-fraud-detection/rules

# Download and extract
kaggle competitions download -c ieee-fraud-detection
unzip ieee-fraud-detection.zip -d ieee-fraud/
rm ieee-fraud-detection.zip
```

### 2. Download PaySim Synthetic Dataset

```bash
cd data_catalog

# Download and extract
kaggle datasets download -d ealaxi/paysim1
unzip paysim1.zip -d paysim/
rm paysim1.zip
```

### 3. Download OFAC Sanctions Lists

```bash
cd data_catalog
mkdir -p ofac

# Download SDN List (XML format)
curl -o ofac/sdn.xml https://www.treasury.gov/ofac/downloads/sdn.xml

# Download Consolidated Sanctions List (CSV format)
curl -o ofac/consolidated.csv https://www.treasury.gov/ofac/downloads/consolidated/consolidated.csv
```

## Important Notes

⚠️ **Do not commit raw datasets to version control**

- Datasets are excluded via `.gitignore`
- Large files bloat repository size
- Some datasets have license restrictions on redistribution

✅ **Reproducibility**

- All datasets are publicly available
- Download instructions provided in setup instructions
- Processed/cleaned data schemas documented in notebooks
