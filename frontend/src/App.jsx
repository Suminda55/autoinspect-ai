import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UploadSection from "./components/UploadSection";
import HistoryLog from "./components/HistoryLog";
import Features from "./components/Features";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Navbar />
      <Hero />
      <UploadSection />
      <HistoryLog />
      <Features />
      <Footer />
    </div>
  );
}

export default App;