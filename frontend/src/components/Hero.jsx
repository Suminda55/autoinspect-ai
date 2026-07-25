export default function Hero() {
    const handleViewDemo = ()=>{alert("Demo video is coming soon!");};
  return (
    <section id="home" className="px-8 py-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
          AI-Powered <span className="text-blue-500">Vehicle Damage</span> Detection & Repair Estimator
        </h1>
        <p className="text-slate-400 text-lg mb-8">
          Upload vehicle images to detect damages instantly and get accurate, AI-generated repair cost estimates in seconds.
        </p>
        <div className="flex space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg transition">
            Upload Image
          </button>
          <button onClick={handleViewDemo} className="border border-slate-600 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-lg transition">View Demo</button>
          <button className="border border-slate-700 hover:border-slate-500 text-slate-300 px-6 py-3 rounded-xl font-bold text-lg transition">
            Learn More
          </button>
        </div>
      </div>
      
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="text-6xl mb-4">🚗</div>
        <p className="text-slate-400 font-medium">Car Image / AI Scanning Graphic</p>
      </div>
    </section>
  );
}