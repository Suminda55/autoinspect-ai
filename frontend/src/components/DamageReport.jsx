import React, { useState, useRef } from 'react';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import EmailModal from './EmailModal';

export default function DamageReport({ result }) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const reportRef = useRef();

  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#1e293b",
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector("[data-pdf-container]");
          if (clonedElement) {
            clonedElement.style.backgroundColor = "#1e293b";
            clonedElement.style.color = "#f8fafc";
          }
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`Damage_Report_${result.filename || "inspection"}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("PDF generation failed: " + error.message);
    }
  };

  const getSeverityColor = (sev) => {
    if (sev === "High") return "#ef4444";
    if (sev === "Medium") return "#f59e0b";
    return "#10b981";
  };

  const progressWidth = result.severity_percent ? `${result.severity_percent}%` : 
                        result.severity === "High" ? "85%" : 
                        result.severity === "Medium" ? "50%" : "25%";

  return (
    <div className="mt-8">
      <div
        ref={reportRef}
        data-pdf-container="true"
        style={{
          backgroundColor: "#1e293b",
          borderColor: "rgba(59, 130, 246, 0.3)",
          color: "#cbd5e1",
        }}
        className="p-6 border rounded-2xl text-left shadow-xl animate-fade-in"
      >
        <div
          style={{ borderColor: "#334155" }}
          className="flex justify-between items-center mb-4 border-b pb-3"
        >
          <h3 style={{ color: "#4ade80" }} className="text-xl font-bold flex items-center gap-2">
            ✅ AI Damage Inspection Report
          </h3>
          <span
            style={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#94a3b8" }}
            className="text-xs px-3 py-1 rounded-full border"
          >
            AutoInspect AI
          </span>
        </div>

        <div className="space-y-4">
          <p>
            <strong style={{ color: "#ffffff" }}>File Name:</strong> {result.filename}
          </p>

          {result.annotated_image && (
            <div className="my-4">
              <p className="text-xs text-slate-400 mb-2 font-semibold flex items-center gap-1">
                🔍 AI Detected Damage Zone:
              </p>
              <img
                src={result.annotated_image}
                alt="AI Damage Detection Bounding Box"
                className="w-full max-h-80 object-contain rounded-xl border border-red-500/40 shadow-lg"
              />
            </div>
          )}

          <p>
            <strong style={{ color: "#ffffff" }}>Detected Damage:</strong>{" "}
            <span style={{ color: "#fbbf24" }} className="font-semibold">
              {result.detected_damage}
            </span>
          </p>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <strong style={{ color: "#ffffff" }}>Damage Severity:</strong>
              <span style={{ color: getSeverityColor(result.severity) }} className="font-bold">
                {result.severity} ({progressWidth})
              </span>
            </div>
            <div style={{ backgroundColor: "#334155" }} className="w-full h-3 rounded-full overflow-hidden">
              <div
                style={{
                  width: progressWidth,
                  backgroundColor: getSeverityColor(result.severity),
                }}
                className="h-full rounded-full transition-all duration-1000"
              ></div>
            </div>
          </div>

          <p>
            <strong style={{ color: "#ffffff" }}>Estimated Repair Cost:</strong>{" "}
            <span style={{ color: "#4ade80" }} className="font-bold text-lg">
              {result.estimated_cost}
            </span>
          </p>

          {result.analysis_notes && (
            <p
              style={{ color: "#94a3b8", borderColor: "#334155" }}
              className="text-xs mt-2 border-t pt-2 font-mono"
            >
              ℹ️ {result.analysis_notes}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mt-6">
        <button 
          onClick={handleDownloadPDF}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          📄 Download Official PDF Report
        </button>

        <button
          onClick={() => setIsEmailModalOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          📩 Send via Email
        </button>
      </div>

      <EmailModal 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)} 
        reportData={result}
      />
    </div>
  );
}