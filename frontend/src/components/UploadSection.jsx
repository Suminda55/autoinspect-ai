import { useState } from "react";
import DamageReport from "./DamageReport";

export default function UploadSection() {
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImage(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Failed to connect to Backend Server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-8 py-12 max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-white mb-6">
        Upload Vehicle Image for <span className="text-blue-500">AI Inspection</span>
      </h2>

      {/* Upload Box */}
      <div className="border-2 border-dashed border-slate-700 bg-slate-800/50 p-8 rounded-2xl flex flex-col items-center justify-center min-h-[250px]">
        {image ? (
          <div className="flex flex-col items-center space-y-4">
            <img src={image} alt="Uploaded Car" className="max-h-64 rounded-xl shadow-lg border border-slate-600" />
            <button
              onClick={() => {
                setImage(null);
                setSelectedFile(null);
                setAnalysisResult(null);
              }}
              className="text-red-400 hover:text-red-300 text-sm font-semibold underline"
            >
              Remove Image
            </button>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center">
            <div className="text-5xl mb-3">📸</div>
            <p className="text-slate-300 font-semibold mb-1">Click to upload or drag & drop</p>
            <p className="text-slate-500 text-xs">PNG, JPG, or JPEG (Max 10MB)</p>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        )}
      </div>

      {/* Action Button */}
      {image && !analysisResult && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition shadow-lg"
        >
          {loading ? "Connecting to Backend AI... 🤖" : "Analyze Damage 🚀"}
        </button>
      )}

      {/* Clean Component Rendering */}
      {analysisResult && <DamageReport result={analysisResult} />}
    </section>
  );
}