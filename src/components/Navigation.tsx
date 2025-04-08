import React from 'react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div id="nav-tabs" className="nav-tabs">
      <div 
        id="tab-home" 
        className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => onTabChange('home')}
      >
        Home
      </div>
      <div 
        id="tab-quiz" 
        className={`nav-tab ${activeTab === 'quiz' ? 'active' : ''}`}
        onClick={() => onTabChange('quiz')}
      >
        Current Quiz
      </div>
      <div 
        id="tab-stats" 
        className={`nav-tab ${activeTab === 'stats' ? 'active' : ''}`}
        onClick={() => onTabChange('stats')}
      >
        Results & Stats
      </div>
    </div>
  );
};

export default Navigation; 