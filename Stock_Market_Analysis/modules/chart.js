import { fetchStockData } from './api.js';

let chartInstance = null;

export async function renderChart(symbol, duration) {
  const response = await fetchStockData();
  const stockData = response?.[0]?.[symbol]?.[duration];
  console.log("stockData", stockData);
  let mouseY = 0;

  document.addEventListener('mousemove', (event) => {
    mouseY = event.clientY;
  });

  if (!stockData || !stockData.value || !stockData.timeStamp) {
    console.error(`Data not found for ${symbol} (${duration})`);
    return;
  }

  const values = stockData.value;
  const timeStamps = stockData.timeStamp.map(ts => {
    const date = new Date(ts * 1000);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });

  //Reuse existing canvas, DO NOT dynamically create or re-inject it
  const ctx = document.getElementById('stock-chart')?.getContext('2d');

  if (!ctx) {
    console.error('Canvas with id="stock-chart" not found in the DOM!');
    return;
  }

  //Destroy previous chart instance before rendering a new one
  if (chartInstance) {
    chartInstance.destroy();
  }

  const peakLowPlugin = {
  id: 'peakLowPlugin',
  afterDraw: (chart) => {
    const { ctx, chartArea: { left, top} } = chart;
    const dataset = chart.data.datasets[0].data;

    if (!dataset || dataset.length === 0) return;

    const maxVal = Math.max(...dataset);
    const minVal = Math.min(...dataset);

    ctx.save();
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';

    ctx.fillText(`📈 Peak: $${maxVal.toFixed(2)}`, left, top + 20);
    ctx.fillText(`📉 Low: $${minVal.toFixed(2)}`, left, top + 40);

    ctx.restore();
  }
};


  const verticalLinePlugin = {
    id: 'verticalLinePlugin',
    afterDraw: (chart) => {
      if (chart.tooltip._active && chart.tooltip._active.length) {
        const ctx = chart.ctx;
        const activePoint = chart.tooltip._active[0];
        const x = activePoint.element.x;
        const topY = chart.scales.y.top;
        const bottomY = chart.scales.y.bottom - 30;

        // Draw vertical line
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.stroke();
        ctx.restore();

        // Draw date text below
        const date = chart.data.labels[activePoint.index];

        ctx.fillStyle = 'white';
        ctx.font = '12px sans-serif';
        // ctx.textAlign = 'center';
        ctx.zIndex = 10;
        ctx.fillText(date, x, bottomY + 50);
      }
    }
  };
  Chart.register(verticalLinePlugin);

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeStamps,
      datasets: [{
        label: `${symbol} (${duration})`,
        data: values,
        borderColor: 'chartreuse',
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointBackgroundColor: 'chartreuse',
        pointHoverBackgroundColor: 'chartreuse',
      }]
    },
    options: {
      interaction: {
        mode: 'index',
        intersect: false,
      },
      layout: {
        padding: {
          top: 10,
          right: 54,
          bottom: 30
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          position: 'top',
          labels: {
            color: '#333',
            font: { size: 14 }
          }
        },
        tooltip: {
          enabled: false,
          external: function (context) {
            const chart = context.chart;
            const tooltipModel = context.tooltip;

            let tooltipEl = document.getElementById('chartjs-custom-tooltip');
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-custom-tooltip';
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.color = '#fff';
              tooltipEl.style.padding = '8px 12px';
              tooltipEl.style.borderRadius = '4px';
              tooltipEl.style.pointerEvents = 'none';
              tooltipEl.style.fontSize = '12px';
              tooltipEl.style.zIndex = '999';
              document.body.appendChild(tooltipEl);
            }

            if (tooltipModel.opacity === 0 || !chart.tooltip._active?.length) {
              tooltipEl.style.opacity = 0;
              return;
            }

            const activePoint = chart.tooltip._active[0];
            const rect = chart.canvas.getBoundingClientRect();
            const scaleX = rect.width / chart.canvas.width;
            const x = activePoint.element.x * scaleX;

            // Get the hovered data point
            const dataPoint = tooltipModel.dataPoints?.[0];
            if (dataPoint) {
              const value = dataPoint.raw;
              tooltipEl.innerHTML = `
                <strong>${symbol} : </strong>$${value.toFixed(2)}`;
            }

            tooltipEl.style.left = `${rect.left + x + 20}px`;
            tooltipEl.style.top = `${mouseY - 40}px`;
            tooltipEl.style.opacity = 1;
          }
        }
        ,
        title: {
          display: false,
          text: `${symbol} Stock Price (${duration})`,
          font: { size: 18 }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            display: false
          },
          border: {
            display: false 
          }
        },
        y: {
          grid: {
            display: false
          },
          ticks: {
            display: false
          },
          border: {
            display: false
          }
        }
      }


    },
    plugins: [verticalLinePlugin, peakLowPlugin]
  });
}

