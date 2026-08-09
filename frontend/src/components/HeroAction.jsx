import React from "react";

export default function HeroActions() {
  const handleUploadClick = () => {
    const uploadSection = document.getElementById("upload-section");
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleViewDemo = () => {
    const uploadSection = document.getElementById("upload-section");
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLearnMore = () => {
    alert(
      "AutoInspect AI uses Computer Vision & Deep Learning to detect vehicle body damages (scratches, dents, structural issues) and instantly estimate repair costs!"
    );
  };

  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={handleUploadClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
      >
        Upload Image
      </button>

      <button
        onClick={handleViewDemo}
        className="border border-slate-700 hover:bg-slate-800 text-slate-300 px-6 py-3 rounded-xl font-medium transition-all"
      >
        View Demo
      </button>

      <button
        onClick={handleLearnMore}
        className="border border-slate-700 hover:border-slate-500 text-slate-300 px-6 py-3 rounded-xl font-medium transition-all"
      >
        Learn More
      </button>
    </div>
  );
}