# Uniswap Token Scraper API

## Overview
This project is a Node.js application using Express.js and Puppeteer to scrape token data from the Uniswap app. The API fetches token details, such as name, ticker, price, fully diluted valuation (FDV), 24-hour volume, price change, and contract address from the Uniswap Ethereum token page.

## Features
- Uses Puppeteer to interact with the Uniswap app.
- Extracts detailed token information including:
  - Token name
  - Ticker symbol
  - Current price
  - Fully Diluted Valuation (FDV)
  - 24-hour volume
  - Price change
  - Contract address
- Handles anti-bot detection using Puppeteer configurations.

## Prerequisites
- Node.js (v14 or above)
- npm (Node Package Manager)
- Chromium/Chrome installed on the system
- Docker (optional, for containerization)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/uniswap-token-scraper.git
   cd uniswap-token-scraper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure Chromium is installed on your system. For Ubuntu, you can install it using:
   ```bash
   sudo apt install chromium-browser
   ```

4. Start the server:
   ```bash
   node index.js
   ```

   The server will run at `http://localhost:3000`.

## Running with Docker

1. Build the Docker image:
   ```bash
   docker build -t uniswap-token-scraper .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 3000:3000 uniswap-token-scraper
   ```

   The server will run at `http://localhost:3000`.

## API Endpoint
### GET `/extract-tokens`

#### Description
Fetches token data from the Uniswap Ethereum token page.

#### Response Format
```json
{
  "tokens": [
    {
      "name": "Ethereum",
      "ticker": "ETH",
      "price": "$1,500",
      "fdv": "$180,000,000,000",
      "volume": "$20,000,000",
      "change": "+2.5%",
      "contractAddress": "0x1234567890abcdef..."
    },
    {
      "name": "USD Coin",
      "ticker": "USDC",
      "price": "$1.00",
      "fdv": "$50,000,000,000",
      "volume": "$15,000,000",
      "change": "-0.1%",
      "contractAddress": "0xabcdef1234567890..."
    }
  ],
  "count": 2
}
```

## How It Works
1. **Launch Puppeteer**: The API launches a Puppeteer browser instance in headless mode with configurations to bypass anti-bot detection.
2. **Navigate to Uniswap**: Opens the Uniswap token exploration page for Ethereum.
3. **Scrape Token Data**: Extracts token information using DOM queries.
4. **Return Results**: Sends the extracted token data in JSON format.

## Key Code Highlights
### Puppeteer Configurations
- **Anti-Bot Detection Bypass**:
  ```javascript
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => false,
    });
  });
  ```
- **Headless Browser Settings**:
  ```javascript
  browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/chromium-browser",
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--disable-http2",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled",
      "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.110 Safari/537.36",
    ],
  });
  ```

### Scraping Tokens
- Extract token details by querying DOM elements:
  ```javascript
  const tokens = await page.evaluate(() => {
    const rows = Array.from(
      document.querySelectorAll('a[data-testid^="token-table-row"]')
    );
    return rows.map((row) => {
      const name =
        row.querySelector('[data-testid="token-name"]')?.textContent.trim() || "";
      const ticker =
        row.querySelector('span[data-testid="token-name"] + span')?.textContent.trim() || "";
      const price =
        row.querySelector('[data-testid="price-cell"] span')?.textContent.trim() || "";
      const fdv =
        row.querySelector('[data-testid="fdv-cell"] span')?.textContent.trim() || "";
      const volume =
        row.querySelector('[data-testid="volume-cell"] span')?.textContent.trim() || "";
      const change =
        row.querySelector('[data-testid="price-change-cell"] span')?.textContent.trim() || "";
      const contractAddress =
        row.getAttribute("href")?.split("/").pop() || "";

      return { name, ticker, price, fdv, volume, change, contractAddress };
    });
  });
  ```

## Error Handling
- If tokens fail to load:
  - Timeout errors are logged.
  - Returns a `500 Internal Server Error` with an appropriate message.

#### Example Error Response
```json
{
  "error": "Failed to load tokens: Timeout exceeded"
}
```

## Technologies Used
- **Node.js**: Backend runtime environment.
- **Express.js**: Framework for creating APIs.
- **Puppeteer**: Headless browser automation.
- **Docker**: Containerization platform for deployment.

## Future Improvements
- Add support for other DEX platforms.
- Introduce filters for token properties (e.g., price range, volume).
- Implement caching for faster subsequent requests.
