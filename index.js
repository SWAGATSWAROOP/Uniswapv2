const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/extract-tokens", async (req, res) => {
  let browser;

  try {
    // Launch Puppeteer
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

    const page = await browser.newPage();

    // Bypass detection
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => false,
      });
    });

    // Navigate to the token page
    await page.goto("https://app.uniswap.org/explore/tokens/ethereum", {
      waitUntil: "networkidle2",
    });

    console.log("Page loaded successfully.");

    // Wait for the token rows to load
    await page.waitForSelector('a[data-testid^="token-table-row"]', {
      timeout: 40000,
    });

    console.log("Cryptos Loaded successfully");

    // Scrape detailed token data
    const tokens = await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll('a[data-testid^="token-table-row"]')
      );
      return rows.map((row) => {
        const name =
          row.querySelector('[data-testid="token-name"]')?.textContent.trim() ||
          "";
        const ticker =
          row
            .querySelector('span[data-testid="token-name"] + span')
            ?.textContent.trim() || "";
        const price =
          row
            .querySelector('[data-testid="price-cell"] span')
            ?.textContent.trim() || "";
        const fdv =
          row
            .querySelector('[data-testid="fdv-cell"] span')
            ?.textContent.trim() || "";
        const volume =
          row
            .querySelector('[data-testid="volume-cell"] span')
            ?.textContent.trim() || "";
        const change =
          row
            .querySelector('[data-testid="price-change-cell"] span')
            ?.textContent.trim() || "";
        const contractAddress =
          row.getAttribute("href")?.split("/").pop() || ""; // Extract contract address from href

        return { name, ticker, price, fdv, volume, change, contractAddress };
      });
    });

    console.log("Tokens extracted:", tokens);

    // Respond with the extracted tokens
    res.json({ tokens, count: tokens.length });
  } catch (error) {
    console.error(`Error: ${error.message}`);

    // Fallback response with mock data
    const fallbackTokens = [
      {
        name: "Ethereum",
        ticker: "ETH",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "NATIVE",
      },
      {
        name: "USD Coin",
        ticker: "USDC",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
      {
        name: "Tether USD",
        ticker: "USDT",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
      {
        name: "Coinbase Wrapped BTC",
        ticker: "cbBTC",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
      },
      {
        name: "Wrapped liquid staked Ether 2.0",
        ticker: "wstETH",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
      },
      {
        name: "ChainLink Token",
        ticker: "LINK",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      },
      {
        name: "USUAL",
        ticker: "USUAL",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0xC4441c2BE5d8fA8126822B9929CA0b81Ea0DE38E",
      },
      {
        name: "Reploy",
        ticker: "RAI",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0xc575BD129848Ce06A460A19466c30E1D0328F52C",
      },
      {
        name: "Uniswap",
        ticker: "UNI",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      },
      {
        name: "Morpho Token",
        ticker: "MORPHO",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0x58D97B57BB95320F9a05dC918Aef65434969c2B2",
      },
      {
        name: "PEPE MAGA",
        ticker: "MAGA",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0xDa2E903b0B67F30BF26bD3464f9EE1a383BbbE5F",
      },
      {
        name: "Ondo",
        ticker: "ONDO",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3",
      },
      {
        name: "Wrapped eETH",
        ticker: "weETH",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee",
      },
      {
        name: "Staked USDe",
        ticker: "sUSDe",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0x9D39A5DE30e57443BfF2A8307A4256c8797A3497",
      },
      {
        name: "USDe",
        ticker: "USDe",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0x4c9EDD5852cd905f086C759E8383e09bff1E68B3",
      },
      {
        name: "Dai Stablecoin",
        ticker: "DAI",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      },
      {
        name: "SPX6900",
        ticker: "SPX",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0xE0f63A424a4439cBE457D80E4f4b51aD25b2c56C",
      },
      {
        name: "Aave Token",
        ticker: "AAVE",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
      },
      {
        name: "STARS",
        ticker: "STARS",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0x04F121600c8C47A754636fc9d75661a9525e05D5",
      },
      {
        name: "ENA",
        ticker: "ENA",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0x57e114B691Db790C35207b2e685D4A43181e6061",
      },
      {
        name: "SORA GROK",
        ticker: "GROK",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0x2bB84fd8F7eD0FfAe3da36AD60d4D7840bdeEADa",
      },
      {
        name: "Beam",
        ticker: "BEAM",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0x62D0A8458eD7719FDAF978fe5929C6D342B0bFcE",
      },
      {
        name: "Mog Coin",
        ticker: "Mog",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0xaaeE1A9723aaDB7afA2810263653A34bA2C21C7a",
      },
      {
        name: "SPX69000",
        ticker: "SPX",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0x5ff0d2De4Cd862149c6672C99B7Edf3B092667A3",
      },
      {
        name: "Mystery",
        ticker: "MYSTERY",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0x64c5cbA9A1BfBD2A5faf601D91Beff2dCac2c974",
      },
      {
        name: "Hoppy",
        ticker: "HOPPY",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0x6E79B51959CF968d87826592f46f819F92466615",
      },
      {
        name: "trumpwifhat",
        ticker: "TRUMP",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0x555907a0b5c32DF0fEb35401187aED60a9191D74",
      },
      {
        name: "Pepe",
        ticker: "PEPE",
        price: "",
        fdv: "",
        volume: "",
        change: "",
        contractAddress: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
      },
    ];
    res
      .status(200)
      .json({ tokens: fallbackTokens, count: fallbackTokens.length });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
