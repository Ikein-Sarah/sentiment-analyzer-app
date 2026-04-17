# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pip install streamlit openai pandas plotly

# Run the app
streamlit run app_final.py
```

## Architecture

Single-file Streamlit app (`app_final.py`) that classifies CSV review text as positive/neutral/negative via OpenAI's GPT-4o API.

**Flow:** User provides OpenAI API key → uploads a CSV → selects the text column → each row is sent individually to GPT-4o for classification → results shown as counts/percentages and a Plotly pie chart.

`app.py` is a stub/template (imports only). The working app is `app_final.py`. `reviews.csv` is sample data for testing.

## Key Details

- OpenAI API key is entered at runtime via a Streamlit sidebar input (not an env var or config file).
- Each review makes a separate API call; no batching.
- GPT-4o is hardcoded as the model — change the `model=` parameter in the `analyze_sentiment()` call to switch models.
- No tests, linting config, or requirements file exist in this repo.
