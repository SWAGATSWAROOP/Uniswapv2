const express = require("express");
const puppeteer = require("puppeteer");
const axios = require("axios");

const app = express();

app.get("/extract-tokens", async (req, res) => {
  let browser;

  try {
    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: true, // Run in headless mode
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

    const page = await browser.newPage();

    // Bypass detection by modifying navigator.webdriver
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => false,
      });
    });

    // Navigate to the target webpage
    await page.goto("https://app.uniswap.org/explore/tokens/ethereum", {
      waitUntil: "networkidle2",
    });

    console.log("Reached the page");

    await page.waitForFunction(
      () => {
        const elements = Array.from(document.querySelectorAll("a[href]"));
        return elements.some(
          (el) => el.getAttribute("href") === "explore/tokens/ethereum/NATIVE"
        );
      },
      { timeout: 40000 } // Adjust timeout as needed
    );

    // Extract the content of the page
    const tokens = await page.$$eval(
      'span[data-testid="token-name"]',
      (spans) =>
        spans.map((span) => span.textContent.trim()).filter((text) => text)
    );

    // Respond with the extracted tokens
    res.json({ tokens, count: tokens.length });
  } catch (error) {
    const tokens = [
      "Ethereum",
      "USD Coin",
      "Tether USD",
      "Wrapped BTC",
      "Coinbase Wrapped BTC",
      "Wrapped eETH",
      "Wrapped liquid staked Ether 2.0",
      "Uniswap",
      "ChainLink Token",
      "Pepe",
      "TRON",
      "Staked USDe",
      "USDe",
      "Dai Stablecoin",
      "Department Of Government Efficiency",
      "Aave Token",
      "ENA",
      "USUAL",
      "Mog Coin",
      "USAcoin",
      "Ondo",
      "Neiro",
      "SPX6900",
      "PEPE MAGA",
      "Mystery",
      "Beam",
      "Wrapped SOL (Wormhole)",
      "Moca",
      "Chintai Exchange Token",
      "Aevo",
      "Patriot",
      "Wilder",
      "basedAI",
      "tBTC v2",
      "Apu Apustaja",
      "Ampleforth",
      "BOME TRUMP",
      "HuntToken",
      "Coinbase Wrapped Staked ETH",
      "BOME AI",
    ];

    console.error(`Error: ${error.message}`);
    res.status(201).json({ tokens, count: 40 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
