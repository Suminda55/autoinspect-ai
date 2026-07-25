export default function Features() {
  const featuresList = [
    { emoji: "🤖", title: "AI Detection", desc: "Detect dents, scratches, and cracks instantly using computer vision." },
    { emoji: "💰", title: "Cost Estimate", desc: "Get accurate repair quotes automatically based on damage severity." },
    { emoji: "📜", title: "History Log", desc: "Save, view, and download detailed PDF inspection reports anytime." },
    { emoji: "⚡", title: "Fast Analysis", desc: "Real-time processing powered by deep learning YOLOv8 models." }
  ];

  return (
    <section id="features" className="px-8 py-16 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-white mb-12">
        Our Key <span className="text-blue-500">Features</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuresList.map((item, index) => (
          <div key={index} className="bg-slate-800 border border-slate-700/60 p-6 rounded-2xl hover:border-blue-500/50 transition">
            <div className="text-4xl mb-4">{item.emoji}</div>
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-slate-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}