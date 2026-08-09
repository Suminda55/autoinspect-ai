import React from "react";

export default function HeroScanner() {
  return (
    <div className="relative w-full h-80 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-2xl group">
      <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity">
        <img
          src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop"
          alt="Car Scanning Preview"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-pulse"></div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:16px_16px]"></div>

      <div className="z-10 bg-slate-950/80 px-5 py-3 rounded-xl border border-cyan-500/30 backdrop-blur-md shadow-xl flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
        </span>
        <p className="text-cyan-400 font-mono text-sm tracking-widest font-semibold">
          AI VISION SCANNER ACTIVE
        </p>
      </div>

      <div className="absolute bottom-4 left-4 z-10 text-xs font-mono text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
        STATUS: READY FOR ANALYSIS
      </div>
    </div>
  );
}