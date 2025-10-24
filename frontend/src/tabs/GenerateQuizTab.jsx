import React, { useState } from 'react';
import { generateQuiz } from '../services/api';
import QuizDisplay from '../components/QuizDisplay';

const GenerateQuizTab = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a Wikipedia URL');
      return;
    }

    if (!url.includes('wikipedia.org')) {
      setError('Please enter a valid Wikipedia URL');
      return;
    }

    setLoading(true);
    setError(null);
    setQuizData(null);

    try {
      const response = await generateQuiz(url);
      setQuizData(response.quiz_data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Generate a New Quiz</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Wikipedia URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://en.wikipedia.org/wiki/..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-md hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Generating Quiz...' : 'Generate Quiz'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Analyzing article and generating quiz...</p>
            <p className="text-gray-500 text-sm mt-2">This may take 10-30 seconds</p>
          </div>
        </div>
      )}

      {quizData && !loading && (
        <QuizDisplay quizData={quizData} />
      )}
    </div>
  );
};

export default GenerateQuizTab;
