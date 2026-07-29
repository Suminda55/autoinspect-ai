import { useState } from "react";

export default function ImageUploader({ onAnalyze, isLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      console.log("File Selected Successfully:", file.name);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleAnalyzeClick = () => {
    console.log("Selected File status:", selectedFile);
    if (!selectedFile) {
      alert("කරුණාකර Image එකක් Select කරන්න!");
      return;
    }

    if (onAnalyze) {
      // Parent එකේ handleAnalyze function එකට File එක pass කරනවා
      onAnalyze(selectedFile);
    } else {
      console.error("onAnalyze prop is missing in ImageUploader!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl p-6 bg-slate-900/50">
      {!previewUrl ? (
        <label className="cursor-pointer flex flex-col items-center">
          <span className="text-sm text-slate-400 mb-2">Upload Vehicle Image for AI Inspection</span>
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          <div className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium">Browse File</div>
        </label>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <img src={previewUrl} alt="Car Preview" className="max-h-64 rounded-xl object-contain border border-slate-700" />
          
          <div className="flex gap-3">
            <button
              onClick={handleRemove}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl text-xs font-semibold"
            >
              Remove Image
            </button>
            <button
              onClick={handleAnalyzeClick}
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm rounded-xl hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? "Analyzing Vehicle..." : "Analyze Damage 🚀"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}