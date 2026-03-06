/**
 * Crypto Assets Database
 * Centralized source of truth for all crypto assets covered in the blog.
 * Used by RelatedCoinsComponent, Ticker, and other dynamic components.
 */

const cryptoAssetsData = [
    // Layer 1
    {
        id: "bitcoin",
        symbol: "BTC",
        name: "Bitcoin",
        sector: "Layer1",
        description: "數位黃金，最安全的去中心化價值儲存網絡。",
        contractAddress: ""
    },
    {
        id: "ethereum",
        symbol: "ETH",
        name: "Ethereum",
        sector: "Layer1",
        description: "智能合約之王，Web3 的基礎結算層。",
        contractAddress: ""
    },
    {
        id: "solana",
        symbol: "SOL",
        name: "Solana",
        sector: "Layer1",
        description: "高性能公鏈，以低手續費與高吞吐量著稱。",
        contractAddress: ""
    },
    {
        id: "celestia",
        symbol: "TIA",
        name: "Celestia",
        sector: "Infrastructure",
        description: "模組化區塊鏈的數據可用性層。",
        contractAddress: ""
    },

    // DeFi
    {
        id: "uniswap",
        symbol: "UNI",
        name: "Uniswap",
        sector: "DeFi",
        description: "最大的去中心化交易所 (DEX)。",
        contractAddress: ""
    },
    {
        id: "pendle",
        symbol: "PENDLE",
        name: "Pendle",
        sector: "DeFi",
        description: "收益代幣化協議，LSDFi 賽道龍頭。",
        contractAddress: ""
    },

    // RWA
    {
        id: "ondo",
        symbol: "ONDO",
        name: "Ondo Finance",
        sector: "RWA",
        description: "將美國國債等真實資產代幣化的領先協議。",
        contractAddress: ""
    },

    // AI
    {
        id: "bittensor",
        symbol: "TAO",
        name: "Bittensor",
        sector: "AI",
        description: "去中心化機器學習網絡。",
        contractAddress: ""
    },

    // Oracle
    {
        id: "chainlink",
        symbol: "LINK",
        name: "Chainlink",
        sector: "Infrastructure",
        description: "去中心化預言機網絡，Web3 與傳統金融的橋樑。",
        contractAddress: ""
    }
];

// Helper Function to get asset by ID
function getAssetById(id) {
    return cryptoAssetsData.find(asset => asset.id === id);
}

// Helper Function to get assets by Sector
function getAssetsBySector(sector, excludeId = null) {
    return cryptoAssetsData.filter(asset => asset.sector === sector && asset.id !== excludeId);
}
