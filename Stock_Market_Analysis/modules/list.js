import { fetchStatsData } from './api.js';
import { renderChart } from './chart.js';
import { renderDetails } from './details.js';

const stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'PYPL', 'TSLA', 'JPM', 'NVDA', 'NFLX', 'DIS'];

export async function renderStockList() {
    const container = document.getElementById('list-section');
    const data = await fetchStatsData();
    const stats = data[0];
    let currentSymbol = '';
    container.innerHTML = '';

    stocks.forEach(symbol => {
        const stock = stats[symbol];
        console.log("stock in out list", stock)
        if (!stock) return;

        const item = document.createElement('div');
        item.className = 'stock-item';
        item.innerHTML = `
            <button class="stock-item-data">${symbol}</button>
            <div class="stock-item-data">$${stock.bookValue}</div>
            <div class="stock-item-data" style="color: ${stock.profit > 0 ? 'chartreuse' : 'red'};">${(stock.profit).toFixed(2)}%</div>
        `;

        item.onclick = async () => {
            const stats = await fetchStatsData();
            const stock = stats[0][symbol];
            currentSymbol = symbol;
            console.log("symbol", symbol)
            renderChart(symbol, '1mo');
            renderDetails(symbol, stock);
        };


        container.appendChild(item);


    });
    document.querySelectorAll('#chart-controls button').forEach(button => {
        button.addEventListener('click', () => {
            const range = button.dataset.range;
            renderChart(currentSymbol, range);
        });
    });
}
