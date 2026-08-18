export const portfolio = {
  owner: {
    name: "Maya",
    currency: "INR",
  },

  totalValue: 7240000,

  performance: {
    ytdPercent: 8.4,
    monthlyGain: 210000,
    history: [
      100, 101.2, 100.8, 102.1, 103.4, 102.9, 104.8, 106.1, 105.6, 107.2, 108.4,
      107.9, 109.6, 111.2, 110.7, 112.4, 113.1, 112.6, 114.3, 115.7, 116.4,
      117.2, 117.9, 118.4, 118.7, 118.4, 118.4,
    ],
  },

  previousSnapshot: {
    technologyExposure: 24,
  },

  activity: [
    {
      id: "technology-target-crossed",
      title: "Technology exposure crossed target",
      detail: "24% → 31%",
      time: "10:42 AM",
      tone: "warning",
    },
    {
      id: "crypto-volatility",
      title: "Crypto volatility increased",
      detail: "+12%",
      time: "09:18 AM",
      tone: "risk",
    },
    {
      id: "portfolio-performance",
      title: "Portfolio gained this month",
      detail: "+₹2.1L",
      time: "08:02 AM",
      tone: "positive",
    },
  ],

  targets: {
    technologyExposure: 25,
  },

  holdings: [
    // ─────────────────────────────────────────────
    // STOCKS — 29%
    // ─────────────────────────────────────────────

    {
      id: "tcs",
      name: "TCS",
      assetType: "stock",
      sector: "Technology",
      region: "India",
      value: 593680,
      allocation: 8.2,
      returnYtd: 14.8,
      volatility: 22.4,
      liquidity: "high",
      targetAllocation: 7,
      technologyExposure: 8.2,
    },

    {
      id: "infosys",
      name: "Infosys",
      assetType: "stock",
      sector: "Technology",
      region: "India",
      value: 369240,
      allocation: 5.1,
      returnYtd: 11.2,
      volatility: 24.1,
      liquidity: "high",
      targetAllocation: 4.5,
      technologyExposure: 5.1,
    },

    {
      id: "hdfc-bank",
      name: "HDFC Bank",
      assetType: "stock",
      sector: "Financials",
      region: "India",
      value: 325800,
      allocation: 4.5,
      returnYtd: 8.7,
      volatility: 18.2,
      liquidity: "high",
      targetAllocation: 5,
      technologyExposure: 0,
    },

    {
      id: "reliance",
      name: "Reliance Industries",
      assetType: "stock",
      sector: "Energy",
      region: "India",
      value: 253400,
      allocation: 3.5,
      returnYtd: 9.4,
      volatility: 20.1,
      liquidity: "high",
      targetAllocation: 4,
      technologyExposure: 0,
    },

    {
      id: "nvidia",
      name: "Nvidia",
      assetType: "stock",
      sector: "Technology",
      region: "US",
      value: 311320,
      allocation: 4.3,
      returnYtd: 31.6,
      volatility: 42.5,
      liquidity: "high",
      targetAllocation: 3,
      technologyExposure: 4.3,
    },

    {
      id: "apple",
      name: "Apple",
      assetType: "stock",
      sector: "Technology",
      region: "US",
      value: 246160,
      allocation: 3.4,
      returnYtd: 16.3,
      volatility: 28.7,
      liquidity: "high",
      targetAllocation: 3,
      technologyExposure: 3.4,
    },

    // ─────────────────────────────────────────────
    // MUTUAL FUNDS — 21%
    // Technology look-through exposure = 10%
    // ─────────────────────────────────────────────

    {
      id: "nifty-index",
      name: "Nifty 50 Index Fund",
      assetType: "mutual_fund",
      sector: "Diversified",
      region: "India",
      value: 506800,
      allocation: 7,
      returnYtd: 10.6,
      volatility: 16.4,
      liquidity: "high",
      targetAllocation: 7,
      technologyExposure: 2.1,
    },

    {
      id: "flexi-cap",
      name: "Flexi Cap Fund",
      assetType: "mutual_fund",
      sector: "Diversified",
      region: "India",
      value: 253400,
      allocation: 3.5,
      returnYtd: 12.1,
      volatility: 17.8,
      liquidity: "high",
      targetAllocation: 4,
      technologyExposure: 0.7,
    },

    {
      id: "mid-cap",
      name: "Mid Cap Fund",
      assetType: "mutual_fund",
      sector: "Diversified",
      region: "India",
      value: 181000,
      allocation: 2.5,
      returnYtd: 15.4,
      volatility: 24.8,
      liquidity: "high",
      targetAllocation: 3,
      technologyExposure: 0.4,
    },

    {
      id: "international-fund",
      name: "International Equity Fund",
      assetType: "mutual_fund",
      sector: "International",
      region: "Global",
      value: 282360,
      allocation: 3.9,
      returnYtd: 18.2,
      volatility: 25.6,
      liquidity: "high",
      targetAllocation: 4,
      technologyExposure: 2.7,
    },

    {
      id: "technology-fund",
      name: "Global Technology Fund",
      assetType: "mutual_fund",
      sector: "Technology",
      region: "Global",
      value: 296840,
      allocation: 4.1,
      returnYtd: 24.7,
      volatility: 31.8,
      liquidity: "high",
      targetAllocation: 3,
      technologyExposure: 4.1,
    },

    // ─────────────────────────────────────────────
    // REAL ESTATE — 36%
    // ─────────────────────────────────────────────

    {
      id: "bangalore-apartment",
      name: "Bangalore Apartment",
      assetType: "real_estate",
      sector: "Residential",
      region: "India",
      value: 1737600,
      allocation: 24,
      returnYtd: 7.2,
      volatility: 8.5,
      liquidity: "low",
      targetAllocation: 24,
      technologyExposure: 0,
    },

    {
      id: "patna-property",
      name: "Patna Property",
      assetType: "real_estate",
      sector: "Residential",
      region: "India",
      value: 868800,
      allocation: 12,
      returnYtd: 6.1,
      volatility: 7.8,
      liquidity: "low",
      targetAllocation: 12,
      technologyExposure: 0,
    },

    // ─────────────────────────────────────────────
    // CRYPTO — 7%
    // ─────────────────────────────────────────────

    {
      id: "bitcoin",
      name: "Bitcoin",
      assetType: "crypto",
      sector: "Digital Assets",
      region: "Global",
      value: 325800,
      allocation: 4.5,
      returnYtd: 28.4,
      volatility: 58.2,
      liquidity: "high",
      targetAllocation: 4,
      technologyExposure: 0,
    },

    {
      id: "ethereum",
      name: "Ethereum",
      assetType: "crypto",
      sector: "Digital Assets",
      region: "Global",
      value: 181000,
      allocation: 2.5,
      returnYtd: 19.7,
      volatility: 64.8,
      liquidity: "high",
      targetAllocation: 2,
      technologyExposure: 0,
    },

    // ─────────────────────────────────────────────
    // CASH — 7%
    // ─────────────────────────────────────────────

    {
      id: "cash",
      name: "Cash Reserve",
      assetType: "cash",
      sector: "Cash",
      region: "India",
      value: 506800,
      allocation: 7,
      returnYtd: 3.5,
      volatility: 0,
      liquidity: "very_high",
      targetAllocation: 7,
      technologyExposure: 0,
    },
  ],
};
