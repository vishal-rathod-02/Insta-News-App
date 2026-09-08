import { getApiUrl } from "../utils/apiConfig";

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

export const fetchMarkets = async (): Promise<MarketItem[]> => {
  try {
    const res = await fetch(getApiUrl("/api/markets"));
    if (!res.ok) throw new Error("Failed to fetch markets");
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn("Market fetch error, using local defaults:", err);
    return [
      { id: "nifty", symbol: "NIFTY 50", name: "NSE India", price: "24,852.15", change: "+148.60", changePercent: 0.60, type: "index", currency: "INR" },
      { id: "sensex", symbol: "SENSEX", name: "BSE India", price: "81,332.72", change: "+492.35", changePercent: 0.61, type: "index", currency: "INR" },
      { id: "sp500", symbol: "S&P 500", name: "US Large Cap", price: "5,828.40", change: "+34.20", changePercent: 0.59, type: "index", currency: "USD" },
      { id: "btc", symbol: "BTC/USD", name: "Bitcoin", price: "$88,420.00", change: "+2,150.00", changePercent: 2.49, type: "crypto", currency: "USD" },
      { id: "eth", symbol: "ETH/USD", name: "Ethereum", price: "$3,140.50", change: "+85.20", changePercent: 2.79, type: "crypto", currency: "USD" },
      { id: "gold", symbol: "GOLD", name: "Gold (oz)", price: "$2,684.50", change: "+12.80", changePercent: 0.48, type: "commodity", currency: "USD" },
    ];
  }
};
