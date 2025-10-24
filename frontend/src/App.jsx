import React, { useState } from 'react';
import GenerateQuizTab from './tabs/GenerateQuizTab';
import HistoryTab from './tabs/HistoryTab';

function App() {
  const [activeTab, setActiveTab] = useState('generate');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            AI Wiki Quiz Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Transform Wikipedia articles into engaging educational quizzes
          </p>
        </header>

        <div className="mb-6">
          <div className="flex border-b border-gray-300">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'generate'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Generate Quiz
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Quiz History
            </button>
          </div>
        </div>

        <main>
          {activeTab === 'generate' ? <GenerateQuizTab /> : <HistoryTab />}
        </main>
      </div>
    </div>
  );
}

export default App;
