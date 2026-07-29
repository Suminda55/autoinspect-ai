import { useState } from "react";
import DamageReport from "./DamageReport";
import { saveToHistory } from "../utils/historyService";

export default function UploadSection({ onAnalysisComplete }) {
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
    if (!selectedFile) {
      alert("කරුණාකර Photo එකක් තෝරන්න!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      const safeFileName = selectedFile.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const renamedFile = new File([selectedFile], safeFileName, { type: selectedFile.type });

      formData.append("file", renamedFile);

      const response = await fetch("http://127.0.0.1:8000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Server status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Analysis Result:", data);

      setAnalysisResult(data);

      if (typeof saveToHistory === "function") {
        saveToHistory(data);
      }

      if (onAnalysisComplete) {
        onAnalysisComplete(data);
      }

    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Image processing failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-8 py-12 max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-white mb-6">
        Upload Vehicle Image for <span className="text-blue-500">AI Inspection</span>
      </h2>

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
              className="text-red-400 hover:text-red-300 text-sm font-semibold underline cursor-pointer"
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

      {image && !analysisResult && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition shadow-lg cursor-pointer"
        >
          {loading ? "Connecting to Backend AI... 🤖" : "Analyze Damage 🚀"}
        </button>
      )}

      {analysisResult && <DamageReport result={analysisResult} />}
    </section>
  );
}