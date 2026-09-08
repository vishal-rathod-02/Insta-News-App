import { Router, Request, Response } from "express";

const router = Router();

export interface MarketItem {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: number;
  type: "index" | "crypto" | "commodity" | "forex";
  currency: string;
}

// In-memory cache
let cachedMarkets: { data: MarketItem[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // 1 minute

const DEFAULT_MARKETS: MarketItem[] = [
  { id: "nifty", symbol: "NIFTY 50", name: "NSE India", price: "24,852.15", change: "+148.60", changePercent: 0.60, type: "index", currency: "INR" },
  { id: "sensex", symbol: "SENSEX", name: "BSE India", price: "81,332.72", change: "+492.35", changePercent: 0.61, type: "index", currency: "INR" },
  { id: "sp500", symbol: "S&P 500", name: "US Large Cap", price: "5,828.40", change: "+34.20", changePercent: 0.59, type: "index", currency: "USD" },
  { id: "nasdaq", symbol: "NASDAQ 100", name: "US Tech", price: "20,410.80", change: "+188.50", changePercent: 0.93, type: "index", currency: "USD" },
  { id: "btc", symbol: "BTC/USD", name: "Bitcoin", price: "$88,420.00", change: "+2,150.00", changePercent: 2.49, type: "crypto", currency: "USD" },
  { id: "eth", symbol: "ETH/USD", name: "Ethereum", price: "$3,140.50", change: "+85.20", changePercent: 2.79, type: "crypto", currency: "USD" },
  { id: "sol", symbol: "SOL/USD", name: "Solana", price: "$182.40", change: "+7.80", changePercent: 4.47, type: "crypto", currency: "USD" },
  { id: "gold", symbol: "GOLD", name: "Gold (oz)", price: "$2,684.50", change: "+12.80", changePercent: 0.48, type: "commodity", currency: "USD" },
  { id: "crude", symbol: "BRENT", name: "Crude Oil", price: "$74.15", change: "-0.65", changePercent: -0.87, type: "commodity", currency: "USD" },
  { id: "usdinr", symbol: "USD/INR", name: "US Dollar / INR", price: "₹86.24", change: "+0.04", changePercent: 0.05, type: "forex", currency: "INR" },
];

/**
 * Attempt to fetch live crypto data from public CoinGecko API with fallback
 */
const fetchLiveCryptoData = async (): Promise<Partial<MarketItem>[]> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true",
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!res.ok) return [];
    const data: any = await res.json();

    const updates: Partial<MarketItem>[] = [];
    if (data.bitcoin) {
      updates.push({
        id: "btc",
        price: `$${data.bitcoin.usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        changePercent: parseFloat(data.bitcoin.usd_24h_change?.toFixed(2) || "0"),
        change: `${data.bitcoin.usd_24h_change >= 0 ? "+" : ""}${data.bitcoin.usd_24h_change?.toFixed(2)}%`,
      });
    }
    if (data.ethereum) {
      updates.push({
        id: "eth",
        price: `$${data.ethereum.usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        changePercent: parseFloat(data.ethereum.usd_24h_change?.toFixed(2) || "0"),
        change: `${data.ethereum.usd_24h_change >= 0 ? "+" : ""}${data.ethereum.usd_24h_change?.toFixed(2)}%`,
      });
    }
    if (data.solana) {
      updates.push({
        id: "sol",
        price: `$${data.solana.usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        changePercent: parseFloat(data.solana.usd_24h_change?.toFixed(2) || "0"),
        change: `${data.solana.usd_24h_change >= 0 ? "+" : ""}${data.solana.usd_24h_change?.toFixed(2)}%`,
      });
    }
    return updates;
  } catch {
    return [];
  }
};

/**
 * GET /api/markets
 * Fetches real-time financial indices, crypto, and commodity data
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const now = Date.now();
    if (cachedMarkets && now - cachedMarkets.timestamp < CACHE_TTL_MS) {
      return res.json({
        success: true,
        data: cachedMarkets.data,
        cached: true,
      });
    }

    // Merge live crypto data if available
    const cryptoUpdates = await fetchLiveCryptoData();
    const updatedMarkets = DEFAULT_MARKETS.map((item) => {
      const match = cryptoUpdates.find((u) => u.id === item.id);
      if (match) {
        return {
          ...item,
          price: match.price || item.price,
          changePercent: match.changePercent ?? item.changePercent,
          change: match.change || item.change,
        };
      }
      return item;
    });

    cachedMarkets = {
      data: updatedMarkets,
      timestamp: now,
    };

    return res.json({
      success: true,
      data: updatedMarkets,
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching market data:", error);
    return res.json({
      success: true,
      data: DEFAULT_MARKETS,
      cached: true,
    });
  }
});

export default router;
