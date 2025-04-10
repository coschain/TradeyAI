# TradeyAI

This project aims to build an AI agent that analyzes the cryptocurrency market by scraping tweets from key opinion leaders (KOLs) on Twitter. The goal is to leverage real-time social sentiment to assess market trends and enable automated trading decisions. Planned features include web scraping, natural language processing for sentiment analysis, and integration with algorithmic trading systems.

## 🚀 Quick Start

Install dependencies packages and copy .env.example to .env and fill in the appropriate values.

```bash
npm i
cp .env.example .env
```

Update kols.json with the list of KOLs you want to track.

```bash
vi kols.json
```

Run index.js to fetch the latest tweets from KOLs within the past hour, analyze the current market trend, and send a signal to the webhook.

```bash
node index.js
```

# Folder Structure

    .
    ├── openai             # openai api
    ├── signal             # send signal to webhook
    ├── twitter-agent      # agent for scraping tweets
    ├── .env.example       # example of environment file
    ├── index.js           # main entry point
    ├── kols.json          # list of KOLs
    ├── README.md
    └── ...
