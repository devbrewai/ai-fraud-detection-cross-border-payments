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

**Note**: OFAC has updated their download system. Automated curl downloads are no longer supported.

**Manual Download Steps**:

1. Visit the OFAC Sanctions List site:

   - SDN List: https://sanctionslist.ofac.treas.gov/Home/SdnList
   - Consolidated List: https://sanctionslist.ofac.treas.gov/Home/ConsolidatedList

2. Download **CSV format** for both lists (recommended for easier processing):
   - **SDN List**: Download all 4 CSV files:
     - `SDN.CSV` (primary names)
     - `ADD.CSV` (addresses)
     - `ALT.CSV` (alternate/AKA names - critical for fuzzy matching)
     - `SDN_COMMENTS.CSV` (extended remarks)
   - **Consolidated List**: Download all 4 CSV files:
     - `CONS_PRIM.CSV` (primary names)
     - `CONS_ADD.CSV` (addresses)
     - `CONS_ALT.CSV` (alternate/AKA names)
     - `CONS_COMMENTS.CSV` (extended remarks)
3. Move downloaded files to the project:

```bash
cd data_catalog
mkdir -p ofac/sdn ofac/consolidated

# Move SDN list files
mv ~/Downloads/sdn.csv ofac/sdn/
mv ~/Downloads/add.csv ofac/sdn/
mv ~/Downloads/alt.csv ofac/sdn/
mv ~/Downloads/sdn_comments.csv ofac/sdn/

# Move Consolidated list files
mv ~/Downloads/cons_prim.csv ofac/consolidated/
mv ~/Downloads/cons_add.csv ofac/consolidated/
mv ~/Downloads/cons_alt.csv ofac/consolidated/
mv ~/Downloads/cons_comments.csv ofac/consolidated/
```

**Alternative**: If you prefer XML format, download the XML versions and adjust filenames accordingly.

## Important Notes

⚠️ **Do not commit raw datasets to version control**

- Datasets are excluded via `.gitignore`
- Large files bloat repository size
- Some datasets have license restrictions on redistribution

✅ **Reproducibility**

- All datasets are publicly available
- Download instructions provided in setup instructions
- Processed/cleaned data schemas documented in notebooks
