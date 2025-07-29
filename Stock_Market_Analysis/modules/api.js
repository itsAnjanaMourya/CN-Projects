export async function fetchStockData() {
    const res = await fetch(`https://stock-market-api-k9vl.onrender.com/api/stocksdata`);
    const data = await res.json();
    // console.log("data.stocksData", data.stocksData)
    return data.stocksData;
}

export async function fetchStatsData() {
    const res = await fetch('https://stock-market-api-k9vl.onrender.com/api/stocksstatsdata');
    const data = await res.json();
    // console.log("data.stocksStatsData", data.stocksStatsData)
    return data.stocksStatsData;
}

export async function fetchProfileData() {
    const res = await fetch(`https://stock-market-api-k9vl.onrender.com/api/profiledata`);
    const data = await res.json();
    // console.log("data.stocksProfileData", data.stocksProfileData)
    return data.stocksProfileData;
}
