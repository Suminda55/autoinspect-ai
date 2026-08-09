import React from "react";
import HeroActions from "./HeroActions";
import HeroScanner from "./HeroScanner";

export default function Hero() {
  return (
    <section
      id="home"
      className="px-8 py-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
    >
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
          AI-Powered <span className="text-blue-500">Vehicle Damage</span>{" "}
          Detection & Repair Estimator
        </h1>
        <p className="text-slate-400 text-lg mb-8">
          Upload vehicle images to detect damages instantly and get accurate,
          AI-generated repair cost estimates in seconds.
        </p>

        <HeroActions />
      </div>

      <HeroScanner />
    </section>
  );
}