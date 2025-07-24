import { useState } from 'react';
import './App.css';
import AnalysisPage from './components/AnalysisPage';
import HistoryPage from './components/HistoryPage';

function App() {
  const [activeTab, setActiveTab] = useState('live');

  return (
    <div className="app">
      <nav className="tabs">
        <button
          className={activeTab === 'live' ? 'active' : ''}
          onClick={() => setActiveTab('live')}
        >
          Live Resume Analysis
        </button>
        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          Historical Viewer
        </button>
      </nav>

      <main>
        {activeTab === 'live' && <AnalysisPage />}
        {activeTab === 'history' && <HistoryPage />}
      </main>
    </div>
  );
}

export default App;
