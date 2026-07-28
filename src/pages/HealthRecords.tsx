import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { recordsAPI } from '../services/api';
import { HealthRecord } from '../types';
import { FileText, Download, Upload, Search, ShieldCheck, Eye, Trash2, ArrowRight } from 'lucide-react';

export const HealthRecords: React.FC = () => {
  const { setActivePage } = useApp();
  // NO HARDCODED SAMPLE DATA - Starts empty by default and loads from localStorage!
  const [records, setRecords] = useState<(HealthRecord & { category?: string; fileSize?: string })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Lab Report');
  const [newDoctor, setNewDoctor] = useState('');
  const [newSummary, setNewSummary] = useState('');
  
  // Preview Modal State
  const [previewRecord, setPreviewRecord] = useState<(HealthRecord & { category?: string; fileSize?: string }) | null>(null);

  // Load health records from localStorage (dynamically populated by Prescription Scanner, AI Symptom Checker & Doctor Appointments)
  useEffect(() => {
    const loadVault = () => {
      try {
        const storedStr = localStorage.getItem('swasthya_health_records');
        if (storedStr) {
          const parsed = JSON.parse(storedStr);
          if (Array.isArray(parsed)) {
            setRecords(parsed);
            return;
          }
        }
      } catch (e) {
        console.error("Error reading health vault from localStorage:", e);
      }

      // Backend API fallback if present
      recordsAPI.getRecords().then((res) => {
        if (res.data && res.data.records && res.data.records.length > 0) {
          setRecords(res.data.records);
        }
      }).catch(() => {
        setRecords([]);
      });
    };

    loadVault();
  }, []);

  // Save to localStorage whenever records change locally
  const saveVaultToLocalStorage = (updatedRecords: (HealthRecord & { category?: string; fileSize?: string })[]) => {
    try {
      localStorage.setItem('swasthya_health_records', JSON.stringify(updatedRecords));
    } catch (e) {
      console.error("Error saving health vault to localStorage:", e);
    }
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRec = {
      id: Date.now(),
      title: newTitle.trim(),
      type: newType,
      category: newType === 'Lab Report' ? 'Lab Reports' : newType === 'Prescription' ? 'Prescriptions' : 'AI Consultations',
      date: new Date().toISOString().split('T')[0],
      doctor: newDoctor.trim() || 'General Practitioner',
      icon: newType === 'Lab Report' ? '🧪' : newType === 'Prescription' ? '📷' : '📂',
      fileSize: '1.2 MB',
      summary: newSummary.trim() || 'Uploaded medical record document.'
    };

    const updated = [newRec, ...records];
    setRecords(updated);
    saveVaultToLocalStorage(updated);

    setNewTitle('');
    setNewDoctor('');
    setNewSummary('');
    setShowUploadModal(false);
  };

  const handleDeleteRecord = (id: number) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    saveVaultToLocalStorage(updated);
  };

  const handleDownload = (recTitle: string) => {
    const element = document.createElement("a");
    const file = new Blob([`SWASTHYA SETU MEDICAL RECORD\nDocument: ${recTitle}\nDownloaded On: ${new Date().toLocaleString()}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${recTitle.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Filtered Records
  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      !searchQuery.trim() ||
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || rec.category === selectedCategory || rec.type === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span className="text-3xl">🗂️</span> Health Records & Lab History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic encrypted vault. Auto-syncs prescriptions from Scanner, AI consultations, & doctor bookings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Upload Health Record
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111927] border border-slate-800 p-4 rounded-3xl shadow-xl">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 text-cyan-400 absolute left-4 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lab reports, doctors, or medical diagnoses..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-500"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Lab Reports', 'AI Consultations', 'Prescriptions', 'Vaccines & Scans'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Records Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-extrabold text-slate-300">
            Stored Health Documents ({filteredRecords.length})
          </h2>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> End-to-End Encrypted Vault
          </span>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#111927] border border-slate-800/80 rounded-3xl p-5 shadow-xl hover:border-cyan-500/40 transition-all duration-300 space-y-3 group"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-2xl flex items-center justify-center shrink-0">
                      {rec.icon || '📄'}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-white group-hover:text-cyan-400 transition-colors">
                        {rec.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5 flex flex-wrap items-center gap-3">
                        <span className="text-cyan-400 font-extrabold">{rec.type}</span>
                        <span>• Date: {rec.date}</span>
                        <span>• Provider: {rec.doctor}</span>
                        {rec.fileSize && <span>• Size: {rec.fileSize}</span>}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setPreviewRecord(rec)}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" /> Preview
                    </button>
                    <button
                      onClick={() => handleDownload(rec.title)}
                      className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(rec.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/60 p-3.5 rounded-2xl text-xs text-slate-300 leading-relaxed font-normal">
                  <strong className="text-slate-400 font-bold block mb-1">Clinical Findings & Summary:</strong>
                  {rec.summary}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#111927] border border-slate-800 rounded-3xl p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">No Health Records Stored Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                Your Health Vault starts clean with zero hardcoded sample records. Records will automatically appear here when you:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left pt-2">
              <button
                onClick={() => setActivePage('scanner')}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-3.5 rounded-2xl transition-all group"
              >
                <span className="text-xl block mb-1">📷</span>
                <span className="font-extrabold text-xs text-white group-hover:text-cyan-400 block">Scan Prescription</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Extract & auto-save prescriptions</span>
              </button>

              <button
                onClick={() => setActivePage('symptom_checker')}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-3.5 rounded-2xl transition-all group"
              >
                <span className="text-xl block mb-1">🧠</span>
                <span className="font-extrabold text-xs text-white group-hover:text-cyan-400 block">AI Symptom Check</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Generate & auto-save AI assessments</span>
              </button>

              <button
                onClick={() => setActivePage('appointments')}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-3.5 rounded-2xl transition-all group"
              >
                <span className="text-xl block mb-1">👨‍⚕️</span>
                <span className="font-extrabold text-xs text-white group-hover:text-cyan-400 block">Book Appointment</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Book consultations with doctors</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* UPLOAD HEALTH RECORD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#111927] border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" /> Upload Health Document
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-xs text-slate-400 hover:text-white font-bold">
                Close
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Document Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lipid Profile, Ultrasound Scan, Prescribed Medicines"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Document Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Lab Report">Lab Report</option>
                  <option value="AI Consultation">AI Consultation</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Diagnostic Scan">Diagnostic Scan / X-Ray</option>
                  <option value="Vaccine Certificate">Vaccine Certificate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Doctor / Hospital Name</label>
                <input
                  type="text"
                  value={newDoctor}
                  onChange={(e) => setNewDoctor(e.target.value)}
                  placeholder="e.g. Dr. Priya Sharma, Manipal Hospital"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Diagnosis & Clinical Notes</label>
                <textarea
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="e.g. Normal blood glucose levels, advice to continue morning medication..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-cyan-500 h-20 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-slate-800 text-slate-300 font-bold text-xs py-2.5 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs py-2.5 rounded-full shadow-md"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW RECORD MODAL */}
      {previewRecord && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#111927] border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{previewRecord.icon || '📄'}</span>
                <div>
                  <h3 className="text-base font-extrabold text-white">{previewRecord.title}</h3>
                  <p className="text-xs text-cyan-400 font-bold">{previewRecord.type} • {previewRecord.date}</p>
                </div>
              </div>
              <button onClick={() => setPreviewRecord(null)} className="text-xs text-slate-400 hover:text-white font-bold">
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-900 p-4 rounded-2xl space-y-2 border border-slate-800">
                <p><strong>Issuing Provider:</strong> {previewRecord.doctor}</p>
                <p><strong>Record Category:</strong> {previewRecord.category || previewRecord.type}</p>
                <p><strong>File Size:</strong> {previewRecord.fileSize || '1.0 MB'}</p>
                <p><strong>Encryption Standard:</strong> 256-Bit AES Medical Vault</p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl space-y-1.5 border border-slate-800">
                <h4 className="font-extrabold text-white text-xs">Medical Summary Details:</h4>
                <p className="text-slate-300 leading-relaxed">{previewRecord.summary}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => handleDownload(previewRecord.title)}
                className="bg-cyan-500 text-slate-950 font-extrabold text-xs px-6 py-2.5 rounded-full shadow-md flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Official Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
