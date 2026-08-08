import { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UploadSection from "./components/UploadSection";
import HistoryLog from "./components/HistoryLog";
import Features from "./components/Features";
import Footer from "./components/Footer";
import AnalyticsSection from './components/AnalyticsSection';
import { getHistory } from './utils/historyService';

function App() {
  const [history, setHistory] = useState([]);

  const updateHistoryState = () => {
    setHistory(getHistory());
  };

  useEffect(() => {
    updateHistoryState();
    window.addEventListener("historyUpdated", updateHistoryState);
    return () => window.removeEventListener("historyUpdated", updateHistoryState);
  }, []);

  const handleAnalysisComplete = (newResult) => {
    console.log("Analysis Completed in App:", newResult);
    updateHistoryState();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Navbar />
      <Hero />
      <UploadSection onAnalysisComplete={handleAnalysisComplete} />
      <AnalyticsSection history={history} />
      <HistoryLog />
      <Features />
      <Footer />
    </div>
  );
}

export default App;