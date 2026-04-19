import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './pages/HomePage';
import ResultPage from './pages/ResultPage';
import RegionsPage from './pages/RegionsPage';
import ExplorePage from './pages/ExplorePage';

export default function App() {
  const [language, setLanguage] = useState('ar');

  return (
    <Router>
      <div className={language === 'ar' ? 'rtl' : 'ltr'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Routes>
          <Route path="/" element={<HomePage lang={language} setLang={setLanguage} />} />
          <Route path="/result" element={<ResultPage lang={language} setLang={setLanguage} />} />
          <Route path="/regions" element={<RegionsPage lang={language} setLang={setLanguage} />} />
          <Route path="/explore" element={<ExplorePage lang={language} setLang={setLanguage} />} />
        </Routes>
      </div>
    </Router>
  );
}
