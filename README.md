# Diamonds Visualization

Small Flask app built as a visualization practice project for exploring a diamonds dataset in the browser with D3.js.

The app serves a single page with:

- a scatter plot built from `data/diamonds.csv`
- X/Y axis selectors for any dataset column
- filters for `color`, `clarity`, and `cut`
- point coloring by `color`, `cut`, or `clarity`
- a JSON endpoint at `/data` used by the frontend

The repository also includes a notebook, `draft.ipynb`, that appears to be the analysis scratchpad behind the app.

## Tech Stack

- Python
- Flask
- pandas
- D3.js via CDN
- Bootstrap via CDN

## Repository Layout

```text
.
├── app.py                  # Flask server
├── data/diamonds.csv       # Dataset used by the app
├── static/main.js          # D3 scatter plot logic
├── templates/index.html    # UI template
├── draft.ipynb             # Notebook / exploratory work
└── archive.zip             # Archived project artifact
```

## Dataset

`data/diamonds.csv` contains 53,940 rows with these columns:

- `carat`
- `cut`
- `color`
- `clarity`
- `depth`
- `table`
- `price`
- `x`
- `y`
- `z`

## Getting Started

No Python dependency file is currently checked in, so install the runtime packages manually.

```bash
python -m venv venv
source venv/bin/activate
pip install Flask pandas
```

## Run Locally

```bash
python app.py
```

The Flask app starts on `http://localhost:8080`.

## How It Works

- `GET /` renders `templates/index.html`
- `GET /data` reads `data/diamonds.csv` with pandas and returns it as JSON
- `static/main.js` fetches `/data` and draws the scatter plot client-side with D3

## Notes

- The app currently reads the CSV on each request rather than caching it.
- Frontend dependencies are loaded from CDNs, so internet access is needed for Bootstrap and D3 unless those assets are vendored later.
- There is no pinned dependency or Python version metadata in the repo yet.
