import { renderStockList } from './modules/list.js';
import { renderChart } from './modules/chart.js';
import { renderDetails } from './modules/details.js';

window.onload = () => {
  renderStockList();
  renderChart('AAPL', '1mo');
  renderDetails('AAPL');
  document.querySelectorAll('#chart-controls button').forEach(button => {
    button.addEventListener('click', () => {
      const range = button.dataset.range;
      renderChart('AAPL', range);
    });
  });
};
