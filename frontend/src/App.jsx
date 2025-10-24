import React, { useState } from 'react';
import GenerateQuizTab from './tabs/GenerateQuizTab';
import HistoryTab from './tabs/HistoryTab';

function App() {
  const [activeTab, setActiveTab] = useState('generate');

  return (
    <div className="app-bg">
      <div className="app-container">
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#26a69a', marginBottom: '0.5rem', letterSpacing: '1px' }}>
            AI Wiki Quiz Generator
          </h1>
          <p style={{ color: '#ececec', fontSize: '1.15rem' }}>
            Transform Wikipedia articles into engaging educational quizzes
          </p>
        </header>

        <div style={{ marginBottom: '2rem', width: '100%' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #37474f', justifyContent: 'center' }}>
            <button
              onClick={() => setActiveTab('generate')}
              style={{
                padding: '0.75rem 2rem',
                fontWeight: 600,
                color: activeTab === 'generate' ? '#26a69a' : '#b2dfdb',
                borderBottom: activeTab === 'generate' ? '3px solid #26a69a' : 'none',
                background: 'none',
                outline: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
            >
              Generate Quiz
            </button>
            <button
              onClick={() => setActiveTab('history')}
              style={{
                padding: '0.75rem 2rem',
                fontWeight: 600,
                color: activeTab === 'history' ? '#26a69a' : '#b2dfdb',
                borderBottom: activeTab === 'history' ? '3px solid #26a69a' : 'none',
                background: 'none',
                outline: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
            >
              Quiz History
            </button>
          </div>
        </div>

        <main style={{ width: '100%' }}>
          {activeTab === 'generate' ? <GenerateQuizTab /> : <HistoryTab />}
        </main>
      </div>
    </div>
  );
}

export default App;
