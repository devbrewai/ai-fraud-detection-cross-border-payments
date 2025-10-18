# Data Catalog

This directory contains datasets used for the fraud detection and sanctions screening research case study.

> [!WARNING]
> **IEEE-CIS Dataset Restrictions**
>
> The IEEE-CIS Fraud Detection dataset is licensed for **non-commercial research use only**.
>
> - Cannot redistribute the dataset
> - Cannot use trained models commercially
> - Must comply with [Kaggle competition rules](https://www.kaggle.com/c/ieee-fraud-detection/rules)

## Datasets

### 1. IEEE-CIS Fraud Detection

- **Source**: [Kaggle Competition](https://www.kaggle.com/c/ieee-fraud-detection)
- **License**: Non-commercial research use only
  - **Cannot redistribute** dataset or trained models
  - **Cannot use for commercial model training**
  - Academic research and education only
  - Must accept [competition rules](https://www.kaggle.com/c/ieee-fraud-detection/rules)
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
- **Location**: `ofac/` (raw data, not committed)
- **Files**:
  - SDN List (Specially Designated Nationals)
  - Consolidated Sanctions List

### 4. Processed Data (Included in Repository)

- **Location**: `processed/`
- **Description**: Pre-processed datasets and metadata included in the repository for convenience
- **Files**:
  - `sanctions_names.csv` / `sanctions_names.parquet` - Processed OFAC sanctions names (~39K entities)
  - `sanctions_names_summary.json` - Statistics on sanctions data coverage
  - `exploration_metadata.json` - Dataset overview and quality metrics
- **Note**: These files are derived from public domain OFAC data and contain no proprietary information

## Quick Start

**Option A: Use Processed Data (Fastest)**

The `processed/` directory contains pre-processed OFAC sanctions data ready to use. This is sufficient for:

- Sanctions screening module development
- Testing fuzzy matching algorithms
- Initial prototyping

**Option B: Download Full Raw Datasets**

For fraud model training and full EDA, download the raw datasets following the instructions below.

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

### 3. Download OFAC Sanctions Lists (Optional)

> **Note**: Pre-processed OFAC data is already available in `processed/sanctions_names.csv`. Only download raw files if you need to regenerate or customize the processing.

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

> [!CAUTION]
>
> **IEEE-CIS Dataset Compliance**
>
> - **Do NOT redistribute** IEEE-CIS raw data (violates license)
> - **Do NOT commit** datasets to version control
> - **Do NOT use** trained models for commercial purposes
> - **Do NOT remove** license attributions from shared models
> - **Only for** academic research and education
> - Trained models may be shared for research/educational purposes with proper attribution

**Raw datasets excluded via `.gitignore`:**

- Large files bloat repository size
- IEEE-CIS has strict redistribution restrictions (cannot be shared)
- PaySim and OFAC raw files are large but publicly available
- Processed derivatives (in `processed/`) are committed for convenience

**Reproducibility**

- All raw datasets are publicly available via the download instructions above
- Processed OFAC data is committed to the repository (`processed/` directory)
- Dataset exploration metadata included for transparency
- Data schemas and processing pipelines documented in notebooks

## Data Inventory

| Dataset              | Status            | Size   | Committed                | License             |
| -------------------- | ----------------- | ------ | ------------------------ | ------------------- |
| IEEE-CIS raw         | Download required | ~500MB | No (license restriction) | Non-commercial only |
| PaySim raw           | Download required | ~470MB | No (large file)          | Open data           |
| OFAC raw             | Optional          | ~10MB  | No (large file)          | Public domain       |
| OFAC processed       | Included          | ~2.1MB | Yes                      | Public domain       |
| Exploration metadata | Included          | <1KB   | Yes                      | N/A                 |
