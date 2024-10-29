import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Failed to get prediction from server.');
      
      const data = await response.json();
      console.log('Server response:', data);
      setResult(data);
    } catch (error) {
      setError('Error: Unable to process the request. Please try again later.');
      console.error('Error:', error);
    }
  };

  const chartData = {
    labels: ['Not Stressed', 'Stressed'],
    datasets: [
      {
        label: 'Confidence Level',
        data: result ? [result.confidence.not_stressed, result.confidence.stressed] : [0, 0],
        backgroundColor: ['#BCCBAE', 'rgba(255,99,132,1)'],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { labels: { color: '#ffffff' } },
    },
    scales: {
      x: { ticks: { color: 'rgb(0, 0, 0)' } },
      y: {
        ticks: { color: 'rgb(0, 0, 0)' },
        beginAtZero: true,
        title: { display: true, text: 'Confidence Level', color: '#000000' },
      },
    },
  };

  return (
    <div className="container mx-auto p-4 h-[1000px]">
      <h1 className="text-white/90 font-noto text-6xl font-bold text-center mb-12">Stress Detection Analyzer</h1>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a sentence..."
          rows={5}
          className="border p-2 w-full mb-2 h-64 rounded-xl bg-white/10 opacity-100 text-xl focus:outline-none placeholder-black/50"
        />
        <div className="flex items-center justify-center">
          <button type="submit" className="text-white text-20 bg-white/10 border w-48 h-12 rounded-md hover:border-2 hover:shadow-lg">Submit</button>
        </div>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <div>
          <h2 className="text-white text-2xl font-semibold text-center mb-2">
            Prediction: {result.prediction}
          </h2>
          
          <div className="flex justify-center h-[300px]">
            <Bar className="mb-4 h-72 w-[600px]" data={chartData} options={chartOptions} />
          </div>

          <div className="flex justify-center">
            <h3 className="text-lg font-medium">Confidence:</h3>
            <p className="pl-4">Not Stressed: {result.confidence.not_stressed.toFixed(2)} |</p>
            <p>Stressed: {result.confidence.stressed.toFixed(2)}</p>
          </div>

          <div className="flex justify-center">
            <h3 className="text-lg font-medium">Explanation:</h3>
          </div>
          
          <div className="flex justify-center">
            <p className="text-white">
              {Array.isArray(result.explanation) && result.explanation.length > 0
                ? result.explanation.map((feature: any) => `The word '${feature[0]}' contributed ${feature[1].toFixed(2)} to the prediction.`).join(' ')
                : 'No explanation available.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
