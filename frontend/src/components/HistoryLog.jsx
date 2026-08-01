import { useState, useEffect } from "react";
import { getHistory, clearHistory } from "../utils/historyService";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function HistoryLog() {
  const [history, setHistory] = useState([]);

  const loadHistory = () => {
    setHistory(getHistory());
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener("historyUpdated", loadHistory);
    return () => window.removeEventListener("historyUpdated", loadHistory);
  }, []);

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all inspection history?")) {
      clearHistory();
    }
  };

  const handleDownloadItemPDF = async (item) => {
    try {
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.width = "600px";
      tempContainer.style.backgroundColor = "#1e293b";
      tempContainer.style.color = "#cbd5e1";
      tempContainer.style.padding = "24px";
      tempContainer.style.borderRadius = "16px";
      tempContainer.style.fontFamily = "sans-serif";

      tempContainer.innerHTML = `
        <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="color: #4ade80; margin: 0; font-size: 18px;">✅ AI Damage Inspection Report</h3>
          <span style="font-size: 10px; color: #94a3b8; background: #0f172a; padding: 4px 8px; border-radius: 12px; border: 1px solid #334155;">AutoInspect AI</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px; font-size: 14px;">
          <p><strong style="color: #ffffff;">Date:</strong> ${item.date}</p>
          <p><strong style="color: #ffffff;">File Name:</strong> ${item.filename}</p>
          ${item.resolution ? `<p><strong style="color: #ffffff;">Resolution:</strong> <span style="color: #22d3ee;">${item.resolution}</span> (${item.image_format})</p>` : ""}
          <p><strong style="color: #ffffff;">Detected Damage:</strong> <span style="color: #fbbf24;">${item.detected_damage}</span></p>
          <p><strong style="color: #ffffff;">Damage Severity:</strong> <span style="color: #fbbf24;">${item.severity}</span></p>
          <p><strong style="color: #ffffff;">Estimated Repair Cost:</strong> <span style="color: #4ade80; font-weight: bold;">${item.estimated_cost}</span></p>
          ${item.analysis_notes ? `<p style="color: #94a3b8; font-size: 11px; border-top: 1px solid #334155; padding-top: 8px;">ℹ️ ${item.analysis_notes}</p>` : ""}
        </div>
      `;

      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        backgroundColor: "#1e293b",
      });

      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`Damage_Report_${item.filename || "history"}.pdf`);
    } catch (error) {
      console.error("PDF Download error:", error);
      alert("Failed to download PDF from history.");
    }
  };

  if (history.length === 0) {
    return (
      <section className="px-8 py-8 max-w-4xl mx-auto text-center">
        <h3 className="text-2xl font-bold text-white mb-4">📜 Inspection History Log</h3>
        <p className="text-slate-400">No past inspections found. Upload an image to start logging!</p>
      </section>
    );
  }

  return (
    <section className="px-8 py-12 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          📜 Recent Inspection Log ({history.length})
        </h3>
        <button
          onClick={handleClear}
          className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg transition"
        >
          Clear History
        </button>
      </div>

      <div className="grid gap-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md hover:border-slate-600 transition"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400">{item.date}</span>
                <span className="text-xs bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                  {item.filename}
                </span>
              </div>
              <h4 className="font-semibold text-amber-400">{item.detected_damage}</h4>
              <p className="text-xs text-slate-400">
                Severity: <span className="text-white font-bold">{item.severity}</span> | Cost:{" "}
                <span className="text-green-400 font-bold">{item.estimated_cost}</span>
              </p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="w-24 bg-slate-700 h-2 rounded-full overflow-hidden hidden sm:block">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-red-500 h-full"
                  style={{ width: item.severity }}
                ></div>
              </div>

              <button
                onClick={() => handleDownloadItemPDF(item)}
                className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-xs px-3 py-2 rounded-lg font-semibold transition flex items-center gap-1 shrink-0"
              >
                📄 PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}