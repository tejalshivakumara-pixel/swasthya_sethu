import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, AlertTriangle, Copy, Check, Sparkles, ArrowRight, ArrowLeft, RefreshCw, User, Activity, FileText } from 'lucide-react';

export type SymptomFormData = {
  age: string;
  gender: string;
  symptoms: string;
  duration: string;
  severity: string;
  medicalHistory: string;
  medications: string;
};

export function SymptomChecker() {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [formData, setFormData] = useState<SymptomFormData>({
    age: '28',
    gender: 'Male',
    symptoms: 'Fever, mild headache, and sore throat',
    duration: '2 days',
    severity: 'Moderate',
    medicalHistory: 'None',
    medications: 'None',
  });

  const [assessmentResult, setAssessmentResult] = useState<any>(null);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      runAiAssessment();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const runAiAssessment = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAssessmentResult({
        condition: 'Acute Upper Respiratory Tract Infection (Viral Cold)',
        urgency: 'Low to Moderate',
        triageLevel: 'Routine Care / Self-Care',
        summary: 'Your symptoms (fever, headache, sore throat) strongly indicate a common viral upper respiratory infection.',
        recommendations: [
          'Stay well hydrated with warm water, herbal teas, or clear broths.',
          'Get at least 8 hours of restful sleep daily.',
          'Gargle with warm salt water 3 times a day for sore throat relief.',
          'Monitor temperature; consult a doctor if fever rises above 102°F or persists > 3 days.'
        ],
        suggestedSpecialist: 'General Physician / Primary Care Provider',
        emergencyWarning: 'Seek immediate emergency help if you experience shortness of breath, chest pain, or high fever with severe stiff neck.'
      });
      setIsAnalyzing(false);
      setStep(4);
    }, 1200);
  };

  const copyReportToClipboard = () => {
    if (!assessmentResult) return;
    const reportText = `🏥 Swasthya Setu - AI Symptom Assessment Report
─────────────────────────────────────────────
Patient Info: Age ${formData.age}, ${formData.gender}
Symptoms Reported: ${formData.symptoms} (Duration: ${formData.duration}, Severity: ${formData.severity})

Possible Condition: ${assessmentResult.condition}
Urgency Level: ${assessmentResult.urgency}
Triage Category: ${assessmentResult.triageLevel}

Key Recommendations:
${assessmentResult.recommendations.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}

Suggested Specialist: ${assessmentResult.suggestedSpecialist}
Emergency Warning: ${assessmentResult.emergencyWarning}
─────────────────────────────────────────────
Generated via Swasthya Setu Health Portal`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-card rounded-2xl border border-border p-6 md:p-8 shadow-xl font-sans text-foreground select-text">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">AI Symptom Checker</h2>
            <p className="text-xs text-muted-foreground">Instant Preliminary Medical Triage & Insights</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          Step {step} of 4
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted h-2 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-emerald-600 h-full transition-all duration-300 ease-out" 
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      {/* STEP 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" /> Step 1: Patient Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Age</label>
              <input 
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Gender</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Symptoms */}
      {step === 2 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" /> Step 2: Describe Symptoms
          </h3>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">What symptoms are you experiencing?</label>
            <textarea 
              rows={3}
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Fever, sore throat, cough..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Duration</label>
              <input 
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Severity</label>
              <select 
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: History */}
      {step === 3 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" /> Step 3: Medical History & Medications
          </h3>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Existing Conditions (Diabetes, Asthma, Hypertension)</label>
            <input 
              type="text"
              value={formData.medicalHistory}
              onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Current Medications</label>
            <input 
              type="text"
              value={formData.medications}
              onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      )}

      {/* STEP 4: AI Assessment Report */}
      {step === 4 && assessmentResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div>
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Assessment Result</span>
              <h4 className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{assessmentResult.condition}</h4>
            </div>
            
            {/* Copy Button */}
            <button 
              onClick={copyReportToClipboard}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Assessment Report'}
            </button>
          </div>

          <div className="p-4 bg-muted/50 rounded-xl border border-border space-y-3">
            <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Summary Insights</h5>
            <p className="text-sm text-foreground leading-relaxed">{assessmentResult.summary}</p>
          </div>

          <div className="p-4 bg-muted/50 rounded-xl border border-border space-y-3">
            <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Key Recommendations</h5>
            <ul className="space-y-2">
              {assessmentResult.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-700 dark:text-red-300">
              <strong className="block mb-0.5">Emergency Guidance:</strong>
              {assessmentResult.emergencyWarning}
            </div>
          </div>
        </div>
      )}

      {/* Buttons Navigation Footer */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
        {step > 1 && step < 4 && (
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        {step < 3 && (
          <button 
            onClick={handleNext}
            className="ml-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
          >
            Next Step <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {step === 3 && (
          <button 
            onClick={handleNext}
            disabled={isAnalyzing}
            className="ml-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isAnalyzing ? 'Analyzing Symptoms...' : 'Generate AI Assessment'}
          </button>
        )}

        {step === 4 && (
          <button 
            onClick={() => setStep(1)}
            className="ml-auto px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Start New Symptom Check
          </button>
        )}
      </div>

    </div>
  );
}

export default SymptomChecker;
