import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const EmailModal = ({ isOpen, onClose, reportData }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  if (!isOpen) return null;

  const handleSendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    const templateParams = {
      to_email: email,
      damage_type: reportData?.detected_damage || 'Vehicle Damage',
      severity: `${reportData?.severity_percent ?? reportData?.severity ?? 0}%`,
      estimated_cost: reportData?.estimated_cost || 'N/A',
      analysis_notes: reportData?.notes || 'Inspection completed successfully.',
    };

    emailjs
      .send(
        'service_qzgxnda',
        'template_jdih3vq',
        templateParams,
        'G62mnpHvrfigJqF7l'
      )
      .then(
        () => {
          setLoading(false);
          setStatus('success');
          setTimeout(() => {
            setStatus(null);
            onClose();
          }, 2000);
        },
        (error) => {
          console.error('Email send error:', error);
          setLoading(false);
          setStatus('error');
        }
      );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl relative">
        <h3 className="text-xl font-bold text-white mb-2">📩 Send Report to Email</h3>
        <p className="text-slate-400 text-sm mb-4">
          Enter the recipient's email address to send the summary report.
        </p>

        <form onSubmit={handleSendEmail} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {status === 'success' && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
              ✅ Report sent successfully!
            </div>
          )}

          {status === 'error' && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              ❌ Failed to send email. Check API Keys.
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailModal;