import { useEffect, useRef, useState } from 'react';
import * as Chart from 'chart.js';

const EPSSComparisonChart = () => {
  const chartRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // EPSS comparison data
  const data = [
    { risk: 'IMMINENT (≥80%)', epss3: 3916, epss4: 2578, change: -1338, percentChange: -34.17 },
    { risk: 'ELEVATED (≥50%)', epss3: 2526, epss4: 4206, change: 1680, percentChange: 66.51 },
    { risk: 'NOTABLE (≥30%)', epss3: 1899, epss4: 3870, change: 1971, percentChange: 103.79 },
    { risk: 'NEGLIGIBLE (>0%)', epss3: 261944, epss4: 259671, change: -2273, percentChange: -0.87 },
  ];

  // Include all categories
  const chartData = data;

  // Update dark mode state when component mounts and when it changes
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;

    // Initial check for dark mode
    const checkDarkMode = () => {
      const isDark =
        document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };

    // Check immediately
    checkDarkMode();

    // Set up listener for changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => checkDarkMode();
    mediaQuery.addEventListener('change', handleChange);

    // Set up a mutation observer to detect class changes on html element (for manual toggles)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      observer.disconnect();
    };
  }, []);

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize the chart
    const ctx = chartRef.current.getContext('2d');

    // Register the required components
    Chart.Chart.register(
      Chart.CategoryScale,
      Chart.LinearScale,
      Chart.BarController,
      Chart.BarElement,
      Chart.Title,
      Chart.Tooltip,
      Chart.Legend,
      Chart.LogarithmicScale
    );

    // Set text color based on dark mode
    const textColor = isDarkMode ? '#ffffff' : '#000000';

    // Common font options
    const fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

    // Create chart instance
    const chart = new Chart.Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.map((item) => item.risk),
        datasets: [
          {
            label: 'EPSS v3',
            data: chartData.map((item) => item.epss3),
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'EPSS v4',
            data: chartData.map((item) => item.epss4),
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
            right: 20,
            bottom: 10,
            left: 10,
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'EPSS Version Comparison',
            font: {
              size: 24,
              family: fontFamily,
              weight: 'normal',
            },
            color: textColor,
            padding: {
              top: 10,
              bottom: 30,
            },
          },
          legend: {
            position: 'top',
            labels: {
              color: textColor,
              font: {
                family: fontFamily,
                size: 14,
                weight: 'normal',
              },
              padding: 20,
            },
          },
          tooltip: {
            titleFont: {
              family: fontFamily,
              size: 16,
            },
            bodyFont: {
              family: fontFamily,
              size: 14,
            },
            padding: 12,
            callbacks: {
              label: function (context) {
                const value = context.dataset.data[context.dataIndex];
                return `${context.dataset.label}: ${value.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          y: {
            type: 'logarithmic',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of CVEs',
              color: textColor,
              font: {
                family: fontFamily,
                size: 14,
                weight: 'normal',
              },
              padding: {
                bottom: 10,
                top: 10,
              },
            },
            ticks: {
              color: textColor,
              font: {
                family: fontFamily,
                size: 12,
              },
              padding: 8,
            },
            grid: {
              color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Exploit Risk',
              color: textColor,
              font: {
                family: fontFamily,
                size: 14,
                weight: 'normal',
              },
              padding: {
                top: 10,
                bottom: 0,
              },
            },
            ticks: {
              color: textColor,
              font: {
                family: fontFamily,
                size: 12,
              },
              padding: 8,
            },
            grid: {
              color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
    });

    // Update chart when dark mode changes
    return () => {
      chart.destroy();
    };
  }, [isDarkMode]); // Re-create chart when dark mode changes

  return (
    <div className="w-full max-w-4xl mx-auto pt-6 px-6">
      {/* Chart container */}
      <div className="h-64 mb-8">
        <canvas ref={chartRef}></canvas>
      </div>

      {/* Clean Table with minimal styling */}
      <div className="overflow-x-auto mt-8">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-3 text-left">Exploit Risk</th>
              <th className="p-3 text-right">EPSS v3</th>
              <th className="p-3 text-right">EPSS v4</th>
              <th className="p-3 text-right">Change</th>
              <th className="p-3 text-right">% Change</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="p-3">{row.risk}</td>
                <td className="p-3 text-right">{row.epss3.toLocaleString()}</td>
                <td className="p-3 text-right">{row.epss4.toLocaleString()}</td>
                <td
                  className={`p-3 text-right ${row.change < 0 ? 'text-green-600' : row.change > 0 ? 'text-red-600' : ''}`}
                >
                  {row.change > 0 ? '+' : ''}
                  {row.change.toLocaleString()}
                </td>
                <td
                  className={`p-3 text-right ${row.percentChange < 0 ? 'text-green-600' : row.percentChange > 0 ? 'text-red-600' : ''}`}
                >
                  {row.percentChange > 0 ? '+' : ''}
                  {row.percentChange.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EPSSComparisonChart;
