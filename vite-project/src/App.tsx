import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';  // Import Bar chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);  // Add error handling

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);  // Reset error state before making the request
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction from server.');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError('Error: Unable to process the request. Please try again later.');
      console.error('Error:', error);
    }
  };

  const chartData = {
    labels: ['Not Stressed', 'Stressed'], // These are the labels
    datasets: [
      {
        label: 'Confidence Level', // Dataset label
        data: result
          ? [result.confidence.not_stressed, result.confidence.stressed]
          : [0, 0], // Default to [0, 0] if result is not available
        backgroundColor: ['#BCCBAE', 'rgba(255,99,132,1)'], // Background colors for the bars
      },
    ]
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'rgb(255, 99, 132)' // Color of the legend labels
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(0, 0, 0)' // Color of x-axis labels
        }
      },
      y: {
        ticks: {
          color: 'rgb(0, 0, 0)' // Color of y-axis labels
        },
        beginAtZero: true, // Ensure the y-axis starts at zero
        title: {
          display: true,
          text: 'Confidence Level',
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-4 h-[1000px]">
      <h1 className="text-teal-500 text-6xl font-bold center text-center mb-12">
        Stress Detection Analyzer
      </h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a sentence..."
          rows={5}
          className="border p-2 w-full mb-2 h-64 rounded-xl opacity-55"
        />
        <div className='flex center items-center justify-center'>
          <button type="submit" className="text-white text-[20px] bg-teal-500 w-48 h-12 rounded-md hover:border-2 hover:shadow-lg">
            Submit
          </button>
        </div>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <div>
          <h2 className="flex center items-center justify-center text-white text-2xl font-semibold mb-2">
            Prediction: {result.prediction}
          </h2>

          <div className="flex center items-center justify-center h-[300px]">
            {/* Use the Bar component from react-chartjs-2 */}
            <Bar className='mb-4 h-72 w-[600px]' data={chartData} options={chartOptions} />
          </div>

          <div className='flex center items-center justify-center'>
            <h3 className="text-lg font-medium">Confidence:</h3>
            <p className='pl-4'>Not Stressed: {result.confidence.not_stressed.toFixed(2)}</p>
          </div>

          <div className='flex center items-center justify-center'>
            <p>Stressed: {result.confidence.stressed.toFixed(2)}</p>
          </div>

          <div className='flex center items-center justify-center'>
            <h3 className="text-lg font-medium">Explanation:</h3>
          </div>

          <div className='flex center items-center justify-center'>
            <ul className="list-disc">
              {result.explanation.map((feature: any, index: number) => (
                <li key={index}>
                  {feature[0]}: {feature[1].toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
