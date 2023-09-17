import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './PriceAnalysis.css'

const PriceAnalysis = () => {
  const [data, setData] = useState([]);
  const [newPrice, setNewPrice] = useState('');
  const [timeFilter, setTimeFilter] = useState('10m');
  const [isPopupOpen, setPopupOpen] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Price',
              data: [],
              borderColor: 'blue',
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });

      chartRef.current.chartInstance = chart;
    }
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current.chartInstance;

      // Sort the data by timestamp in ascending order
      const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);

      // Filter data based on the time filter
      const currentTime = new Date();
      const filteredData = sortedData.filter(item => {
        const itemTime = new Date(item.timestamp);
        const timeDiff = currentTime - itemTime;

        switch (timeFilter) {
          case '10m':
            return timeDiff <= 600000; // 10 minutes in milliseconds
          case '1h':
            return timeDiff <= 3600000; // 1 hour in milliseconds
          default:
            return true; // Show all data if filter not recognized
        }
      });

      // Extract labels and prices from filtered data
      const labels = filteredData.map(item => item.timestamp.toLocaleTimeString());
      const prices = filteredData.map(item => item.price);

      // Update the chart data
      chart.data.labels = labels;
      chart.data.datasets[0].data = prices;

      // Update the chart with the new data
      chart.update();
    }
  }, [data, timeFilter]);

  const handleAddPrice = () => {
    if (isNaN(newPrice) || newPrice === '') {
      alert('Please enter a valid price.');
      return;
    }

    // Add newPrice to the data array with a timestamp
    const newData = [...data, { price: parseFloat(newPrice), timestamp: new Date() }];
    setData(newData);
    setNewPrice('');
    setPopupOpen(false);
  };

  return (
    <div>
      <h1>Commodity Price Analysis</h1>
      <div>
        <button onClick={() => setPopupOpen(true)}>Add New Price</button>
      </div>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add New Price</h2>
            <input
              type="number"
              placeholder="Enter a new price"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />
            <button onClick={handleAddPrice}>Add Price</button>
            <button onClick={() => setPopupOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      <div>
        <label>Time Filter:</label>
        <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
          <option value="10m">10 Minutes</option>
          <option value="1h">1 Hour</option>
        </select>
      </div>
      <div>
        <canvas ref={chartRef} width={400} height={400}></canvas>
      </div>
    </div>
  );
};

export default PriceAnalysis;
