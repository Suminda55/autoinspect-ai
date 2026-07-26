import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function DamageReport({ result }) {
  const reportRef = useRef();

  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    try {
      // html2canvas parse කරද්දී oklch crash වීම වැළැක්වීමට options
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#1e293b",
        onclone: (clonedDoc) => {
          // cloned element එකේ oklch styles තිබුණොත් ewa clean කිරීමට safe fallback
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

  return (
    <div className="mt-8">
      {/* PDF Capture Box with Standard Hex/RGB Styles */}
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

          {result.resolution && (
            <p>
              <strong style={{ color: "#ffffff" }}>Resolution:</strong>{" "}
              <span style={{ color: "#22d3ee" }} className="font-mono">{result.resolution}</span> ({result.image_format})
            </p>
          )}

          <p>
            <strong style={{ color: "#ffffff" }}>Detected Damage:</strong>{" "}
            <span style={{ color: "#fbbf24" }} className="font-semibold">{result.detected_damage}</span>
          </p>

          {/* Visual Severity Progress Gauge */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <strong style={{ color: "#ffffff" }}>Damage Severity:</strong>
              <span style={{ color: "#fbbf24" }} className="font-bold">{result.severity}</span>
            </div>
            <div style={{ backgroundColor: "#334155" }} className="w-full h-3 rounded-full overflow-hidden">
              <div
                style={{
                  width: result.severity,
                  background: "linear-gradient(to right, #eab308, #ef4444)",
                }}
                className="h-full rounded-full transition-all duration-1000"
              ></div>
            </div>
          </div>

          <p>
            <strong style={{ color: "#ffffff" }}>Estimated Repair Cost:</strong>{" "}
            <span style={{ color: "#4ade80" }} className="font-bold text-lg">{result.estimated_cost}</span>
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

      {/* Download Button */}
      <button
        onClick={handleDownloadPDF}
        style={{ backgroundColor: "#059669" }}
        className="mt-4 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-lg flex items-center gap-2 mx-auto active:scale-95"
      >
        📄 Download Official PDF Report
      </button>
    </div>
  );
}