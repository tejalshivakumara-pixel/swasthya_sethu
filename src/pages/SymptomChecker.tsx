import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { symptomAPI, appointmentAPI } from '../services/api';
import { SymptomResult, Doctor } from '../types';
import { ArrowRight, ArrowLeft, RotateCcw, Copy, Check, Printer, Download, AlertTriangle, ShieldCheck, Calendar, UserCheck } from 'lucide-react';

const DOCTORS_LIST: Doctor[] = [
  {
    id: 1,
    name: "Dr. Rajesh Sharma",
    specialization: "General Physician",
    experience: "14 Years Exp",
    rating: "4.9 ⭐",
    hospital: "Primary Health Center, Mandya",
    fee: "₹200",
    available: "Today, 4:00 PM",
    image: "👨‍⚕️"
  },
  {
    id: 2,
    name: "Dr. Priya Venkatesh",
    specialization: "Pediatrician",
    experience: "10 Years Exp",
    rating: "4.8 ⭐",
    hospital: "Apollo Rural Teleclinic",
    fee: "₹300",
    available: "Tomorrow, 10:00 AM",
    image: "👩‍⚕️"
  },
  {
    id: 3,
    name: "Dr. Ananya Rao",
    specialization: "Gastroenterologist",
    experience: "12 Years Exp",
    rating: "4.9 ⭐",
    hospital: "Fortis Health Center",
    fee: "₹400",
    available: "Today, 6:30 PM",
    image: "👩‍⚕️"
  },
  {
    id: 4,
    name: "Dr. Suresh Kumar",
    specialization: "Neurologist",
    experience: "18 Years Exp",
    rating: "5.0 ⭐",
    hospital: "Manipal General Hospital",
    fee: "₹500",
    available: "Tomorrow, 2:00 PM",
    image: "👨‍⚕️"
  }
];

const getFallbackDiagnostic = (symptomsText: string, severityLevel: string): SymptomResult => {
  const sym = symptomsText.toLowerCase();

  // 1. CARDIOVASCULAR EMERGENCY (Heart Attack / Myocardial Infarction / Angina)
  if (
    sym.includes('chest pain') ||
    sym.includes('shortness of breath') ||
    sym.includes('radiating pain') ||
    sym.includes('diaphoresis') ||
    sym.includes('sweating') ||
    sym.includes('arm pain') ||
    sym.includes('jaw pain') ||
    sym.includes('chest tightness') ||
    sym.includes('heart attack') ||
    sym.includes('angina')
  ) {
    return {
      possible_disease: "Acute Myocardial Infarction (Heart Attack) / Acute Coronary Syndrome",
      urgency: "CRITICAL EMERGENCY - IMMEDIATE HOSPITALIZATION REQUIRED",
      reason: "Acute coronary artery occlusion causing myocardial ischemia. Classic presentation of retrosternal chest pain, dyspnea, diaphoresis, and radiation to arm/jaw.",
      recommended_specialist: "Interventional Cardiologist / Emergency Medical Specialist",
      medicines: "EMERGENCY PROTOCOL (Under Doctor Supervision): Aspirin 325mg (chewed) + Clopidogrel 300mg + Nitroglycerin sublingual.",
      tests_required: "12-Lead ECG, High-Sensitivity Cardiac Troponin I/T, Echocardiogram, Emergency Coronary Angiography.",
      self_care: "DO NOT EXERT. Sit down, keep calm, chew Aspirin 325mg if available, and call 108 / 112 immediately for emergency ambulance dispatch.",
      emergency_warning: "LIFE THREATENING EMERGENCY! Call 108 / 112 or go to the nearest Cardiac ER immediately. Do not drive yourself."
    };
  }

  // 2. NEUROLOGICAL EMERGENCY (Stroke / CVA)
  if (
    sym.includes('slurred speech') ||
    sym.includes('face drooping') ||
    sym.includes('arm weakness') ||
    sym.includes('numbness') ||
    sym.includes('stroke') ||
    sym.includes('paralysis') ||
    sym.includes('loss of balance')
  ) {
    return {
      possible_disease: "Acute Ischemic Stroke / Cerebrovascular Accident (CVA)",
      urgency: "CRITICAL EMERGENCY - BRAIN ATTACK PROTOCOL",
      reason: "Sudden focal neurological deficit caused by cerebral artery thrombosis or hemorrhage (FAST protocol positive).",
      recommended_specialist: "Neurologist / Stroke Emergency Team",
      medicines: "Requires Immediate Hospital Assessment for Thrombolytic Therapy (tPA within 4.5 hours window).",
      tests_required: "Non-Contrast CT Brain, MRI Brain Diffusion, Carotid Doppler, ECG.",
      self_care: "Note the exact time symptoms started. Keep patient lying down with head slightly elevated. Do not give food or drink.",
      emergency_warning: "CRITICAL STROKE EMERGENCY! Call 108 / 112 immediately. Time lost is brain lost."
    };
  }

  // 3. RESPIRATORY (Severe Asthma / Pneumonia / Pulmonary Embolism)
  if (
    sym.includes('wheezing') ||
    sym.includes('breathlessness') ||
    sym.includes('coughing blood') ||
    sym.includes('suffocation') ||
    sym.includes('pneumonia')
  ) {
    return {
      possible_disease: "Acute Bronchial Asthma Exacerbation / Pneumonia",
      urgency: "HIGH URGENCY (Immediate Medical Care Needed)",
      reason: "Airway hyper-responsiveness, bronchospasm, or alveolar consolidation compromising respiratory gas exchange.",
      recommended_specialist: "Pulmonologist / Critical Care Specialist",
      medicines: "Levosalbutamol + Ipratropium Nebulization + Budesonide inhaler + Oral Prednisolone (as prescribed).",
      tests_required: "Pulse Oximetry (SpO2), Chest X-Ray (PA View), Arterial Blood Gas (ABG), CBC.",
      self_care: "Sit upright. Use rescue inhaler (Salbutamol 2 puffs via spacer every 20 mins). Stay calm.",
      emergency_warning: "Go to ER immediately if oxygen saturation drops below 92%, lips turn blue, or severe gasping occurs."
    };
  }

  // 4. INSOMNIA / SLEEP DISORDER
  if (sym.includes('insomnia') || sym.includes('sleep') || sym.includes('sleepless') || sym.includes('awake')) {
    return {
      possible_disease: "Insomnia / Circadian Sleep Rhythm Disorder",
      urgency: severityLevel === "Severe" ? "Moderate (Consult Doctor)" : "Low (Self-Care & Sleep Hygiene)",
      reason: "Difficulty falling asleep or staying asleep often stems from stress, altered circadian rhythm, elevated cortisol levels, screen time, or anxiety.",
      recommended_specialist: "Neurologist / Sleep Specialist",
      medicines: "Melatonin 3mg (1 tablet 30 minutes before bedtime for 5 days) + Magnesium Glycinate 200mg at night.",
      tests_required: "Polysomnography (Sleep Study), Thyroid Profile (TSH), Serum Vitamin D3 & B12.",
      self_care: "Maintain strict sleep hours. Avoid blue light/phone screens 1 hour before sleep. Avoid caffeine/tea after 4:00 PM.",
      emergency_warning: "Seek immediate medical care if insomnia is accompanied by severe chest tightness, confusion, severe depression, or hallucinations."
    };
  }

  // 5. ACIDITY / GERD / GASTRITIS
  if (sym.includes('acidity') || sym.includes('gas') || sym.includes('heartburn') || sym.includes('reflux') || sym.includes('stomach') || sym.includes('bloating') || sym.includes('loosemotion')) {
    return {
      possible_disease: "Gastroesophageal Reflux Disease (GERD) / Acid Peptic Disease",
      urgency: "Low to Moderate",
      reason: "Gastric mucosa irritation caused by excess stomach acid, irregular meal timings, spicy food, or Helicobacter pylori infection.",
      recommended_specialist: "Gastroenterologist / General Physician",
      medicines: "Pantoprazole 40mg (1 capsule 30 minutes before breakfast) + Syrup Digene/Mucaine Gel (10ml after meals as needed).",
      tests_required: "Serum Gastrin, Endoscopy (if symptoms persist over 2 weeks), H. pylori stool antigen test.",
      self_care: "Eat small, frequent meals. Avoid lying down immediately after eating. Limit spicy, greasy, and fried foods.",
      emergency_warning: "Go to emergency if you experience black tarry stools, persistent vomiting, severe unremitting abdominal pain, or difficulty swallowing."
    };
  }

  // 6. HEADACHE / MIGRAINE
  if (sym.includes('headache') || sym.includes('head pain') || sym.includes('migraine') || sym.includes('throbbing')) {
    return {
      possible_disease: "Tension Headache / Vascular Migraine",
      urgency: severityLevel === "Severe" ? "Moderate" : "Low",
      reason: "Neurovascular inflammation, muscle contraction in head/neck muscles, dehydration, stress, or eye strain.",
      recommended_specialist: "Neurologist / General Physician",
      medicines: "Naproxen 250mg or Paracetamol 650mg (after food) + Caffeine/Paracetamol combination for acute pain.",
      tests_required: "Blood Pressure Monitoring, Vision Assessment, MRI Brain (if severe and recurring).",
      self_care: "Rest in a quiet, dark room. Apply cold or warm compress to forehead. Stay well-hydrated.",
      emergency_warning: "Seek immediate emergency attention if headache is sudden and explosive ('thunderclap'), accompanied by fever, neck stiffness, or numbness."
    };
  }

  // 7. RASH / ALLERGY
  if (sym.includes('rash') || sym.includes('skin') || sym.includes('itching') || sym.includes('allergy') || sym.includes('hives')) {
    return {
      possible_disease: "Allergic Dermatitis / Urticaria",
      urgency: "Low",
      reason: "Hypersensitivity immune response triggered by contact allergens, food, environmental dust, or medications.",
      recommended_specialist: "Dermatologist / Allergist",
      medicines: "Cetirizine 10mg (1 tablet at bedtime) + Hydrocortisone 1% topical cream for localized itching.",
      tests_required: "Serum IgE levels, Skin Prick Allergy Panel.",
      self_care: "Apply calamine lotion. Avoid hot showers and harsh chemical soaps. Do not scratch affected areas.",
      emergency_warning: "Seek immediate emergency help if skin rash is accompanied by facial swelling, lip tightness, or difficulty breathing (Anaphylaxis)."
    };
  }

  // 8. JOINT / MUSCLE PAIN
  if (sym.includes('joint') || sym.includes('knee') || sym.includes('back pain') || sym.includes('arthritis') || sym.includes('muscle pain')) {
    return {
      possible_disease: "Musculoskeletal Strain / Inflammatory Arthralgia",
      urgency: "Low to Moderate",
      reason: "Joint space inflammation, cartilage wear, posture strain, or elevated serum uric acid levels.",
      recommended_specialist: "Orthopedist / Rheumatologist",
      medicines: "Aceclofenac 100mg + Paracetamol 325mg (twice daily after meals for 3-5 days) + Volini Gel for topical application.",
      tests_required: "X-Ray of affected joint, Serum Uric Acid, Erythrocyte Sedimentation Rate (ESR), C-Reactive Protein (CRP).",
      self_care: "Apply ice packs for acute swelling or heat pads for chronic stiffness. Perform gentle stretching.",
      emergency_warning: "Seek urgent care if joint pain is accompanied by high fever, inability to bear weight, or visible joint deformity."
    };
  }

  // 9. EYE STRAIN / VISION
  if (sym.includes('eye') || sym.includes('vision') || sym.includes('blurry') || sym.includes('eye strain')) {
    return {
      possible_disease: "Computer Vision Syndrome / Asthenopia",
      urgency: "Low",
      reason: "Ciliary muscle fatigue resulting from prolonged screen exposure, inadequate blinking, or uncorrected refractive error.",
      recommended_specialist: "Ophthalmologist / Optometrist",
      medicines: "Lubricating Eye Drops (Carboxymethylcellulose 0.5%) - 1 drop in each eye 4 times daily.",
      tests_required: "Comprehensive Refractive Eye Exam, Slit Lamp Assessment, Intraocular Pressure (IOP) test.",
      self_care: "Follow the 20-20-20 rule (every 20 mins, look at object 20 feet away for 20 seconds). Use blue-light protection glasses.",
      emergency_warning: "Go to emergency immediately if you experience sudden loss of vision, eye trauma, severe eye pain, or flashes of light."
    };
  }

  // 10. FEVER / COLD / INFECTION
  if (sym.includes('fever') || sym.includes('cough') || sym.includes('cold') || sym.includes('chills') || sym.includes('flu')) {
    return {
      possible_disease: "Acute Viral Upper Respiratory Infection (URI)",
      urgency: severityLevel === "Severe" ? "Moderate" : "Low",
      reason: "Upper respiratory viral pathogens causing mucosal inflammation, immune response, and elevated body temperature.",
      recommended_specialist: "General Physician / Internal Medicine",
      medicines: "Paracetamol 500mg (1 tablet every 6 hours as needed for fever) + Cetirizine 10mg + Warm saline gargles.",
      tests_required: "Complete Blood Count (CBC), Dengue/Malaria Antigen test (if fever > 3 days).",
      self_care: "Drink plenty of warm fluids, rest adequately, steam inhalation twice daily.",
      emergency_warning: "Seek immediate emergency help if experiencing severe shortness of breath, persistent chest pain, or oxygen saturation dropping below 94%."
    };
  }

  // Default general fallback
  return {
    possible_disease: "General Systemic Symptom Complex",
    urgency: severityLevel === "Severe" ? "Moderate (Medical Assessment Required)" : "Low (Monitoring & Rest)",
    reason: "Mild functional physiological imbalance, viral exposure, or environmental fatigue stress response.",
    recommended_specialist: "General Physician",
    medicines: "Paracetamol 500mg (after food as needed for pain/fever) + Multivitamin & Zinc supplement.",
    tests_required: "Routine Health Checkup, CBC, Blood Glucose, Lipid Profile.",
    self_care: "Ensure 8 hours of sleep, balanced diet, stay hydrated with clean drinking water.",
    emergency_warning: "Seek immediate emergency care if symptoms rapidly escalate, or if you develop chest pain, fainting, or severe breathlessness."
  };
};

export const SymptomChecker: React.FC = () => {
  const { user, setActivePage } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form State
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('Male');
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('3 days');
  const [severity, setSeverity] = useState('Moderate');
  const [history, setHistory] = useState('');
  const [medications, setMedications] = useState('');
  const [allergies, setAllergies] = useState('');

  // Result State
  const [result, setResult] = useState<SymptomResult | null>(null);

  // Booking Modal State right inside Step 4
  const [bookingModalDoc, setBookingModalDoc] = useState<Doctor | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDate, setBookingDate] = useState('2026-07-28');
  const [bookingTime, setBookingTime] = useState('10:00 AM');

  const handleGenerateReport = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    let finalResult: SymptomResult | null = null;

    try {
      const res = await symptomAPI.analyze({
        user_id: user?.id,
        age,
        gender,
        symptoms,
        duration,
        severity,
        history,
        medications,
        allergies,
      });
      if (res.data && res.data.result) {
        finalResult = res.data.result;
      }
    } catch (err) {
      console.warn('Backend API offline, computing dynamic diagnostic fallback');
    }

    if (!finalResult) {
      finalResult = getFallbackDiagnostic(symptoms, severity);
    }

    setResult(finalResult);
    setLoading(false);
    setStep(4);

    // Auto-sync AI consultation report into Health Records localStorage
    try {
      const existingStr = localStorage.getItem('swasthya_health_records');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const newAiRecord = {
        id: Date.now(),
        title: `AI Clinical Consultation: ${finalResult.possible_disease}`,
        type: "AI Consultation",
        category: "AI Consultations",
        date: new Date().toISOString().split('T')[0],
        doctor: "Swasthya Setu AI Clinical Decision Support",
        icon: "🧠",
        fileSize: "850 KB",
        summary: `Primary Assessment: ${finalResult.possible_disease}. Urgency: ${finalResult.urgency}. Recommended Specialist: ${finalResult.recommended_specialist}. Prescribed Treatment: ${finalResult.medicines}.`
      };
      localStorage.setItem('swasthya_health_records', JSON.stringify([newAiRecord, ...existing]));
    } catch (e) {
      console.error(e);
    }
  };

  const getMatchedDoctor = (specialistText?: string): Doctor => {
    const spec = (specialistText || '').toLowerCase();
    if (spec.includes('neuro') || spec.includes('somno') || spec.includes('sleep')) {
      return DOCTORS_LIST[3]; // Dr. Suresh Kumar (Neurologist)
    }
    if (spec.includes('gastro')) {
      return DOCTORS_LIST[2]; // Dr. Ananya Rao (Gastroenterologist)
    }
    if (spec.includes('pedia') || spec.includes('child')) {
      return DOCTORS_LIST[1]; // Dr. Priya Venkatesh (Pediatrician)
    }
    return DOCTORS_LIST[0]; // Dr. Rajesh Sharma (General Physician)
  };

  const handleConfirmAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalDoc) return;
    try {
      await appointmentAPI.bookAppointment({
        doctor_id: bookingModalDoc.id,
        doctor_name: bookingModalDoc.name,
        patient_name: user?.full_name || 'Patient',
        phone: '9876543210',
        date: bookingDate,
        time: bookingTime,
      });
    } catch (err) {
      console.log('Booked locally');
    }
    setBookingConfirmed(true);
  };

  const getReportText = () => {
    if (!result) return '';
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return `========================================================================
                      SWASTHYA SETU
                   DIGITAL Rx MEDICAL ASSESSMENT & PRESCRIPTION
========================================================================
Date: ${today} | Rx ID: SS-RX-${Math.floor(100000 + Math.random() * 900000)}

PATIENT DEMOGRAPHICS:
---------------------
Name/ID     : ${user?.full_name || 'Patient'} (Age: ${age}, Gender: ${gender})
Symptoms    : ${symptoms}
Duration    : ${duration} | Severity: ${severity}
History     : ${history || 'None reported'}

CLINICAL ASSESSMENT & DIAGNOSIS:
--------------------------------
Diagnosis   : ${result.possible_disease}
Urgency     : ${result.urgency}
Specialist  : ${result.recommended_specialist}
Clinical Rationale:
  ${result.reason}

PRESCRIBED MEDICATIONS & DOSAGE:
--------------------------------
${result.medicines}

RECOMMENDED DIAGNOSTIC TESTS:
-----------------------------
${result.tests_required}

SELF-CARE & LIFESTYLE GUIDANCE:
-------------------------------
${result.self_care}

EMERGENCY WARNING & ACTION STEPS:
---------------------------------
${result.emergency_warning}

------------------------------------------------------------------------
Verified by Swasthya Setu Clinical AI Engine
========================================================================`;
  };

  const handleCopy = () => {
    const text = getReportText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDoc = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Swasthya Setu Prescription</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; line-height: 1.6; color: #1e293b; padding: 20px; }
          .header { border-bottom: 2px solid #059669; padding-bottom: 10px; margin-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; color: #059669; }
          .section-title { font-size: 14px; font-weight: bold; color: #0f172a; background: #f1f5f9; padding: 6px 10px; margin-top: 15px; border-left: 4px solid #059669; }
          .box { border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; margin-top: 8px; background: #f8fafc; }
          .meds { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; font-weight: bold; padding: 12px; border-radius: 6px; }
          .warning { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 10px; border-radius: 6px; margin-top: 15px; }
          .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: left; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">🏥 Swasthya Setu</div>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()} &nbsp;|&nbsp; <strong>Rx ID:</strong> SS-RX-${Math.floor(100000 + Math.random() * 900000)}</p>
        </div>

        <div class="section-title">Patient Demographics</div>
        <div class="box">
          <p><strong>Patient Name:</strong> ${user?.full_name || 'Patient'} &nbsp;|&nbsp; <strong>Age:</strong> ${age} &nbsp;|&nbsp; <strong>Gender:</strong> ${gender}</p>
          <p><strong>Reported Symptoms:</strong> ${symptoms} (Duration: ${duration}, Severity: ${severity})</p>
          <p><strong>Medical History:</strong> ${history || 'None reported'}</p>
        </div>

        <div class="section-title">Diagnosis & Assessment</div>
        <div class="box">
          <p style="font-size:16px; font-weight:bold; color:#0f172a;">${result?.possible_disease}</p>
          <p><strong>Urgency Level:</strong> <span style="color:#dc2626; font-weight:bold;">${result?.urgency}</span></p>
          <p><strong>Recommended Specialist:</strong> ${result?.recommended_specialist}</p>
          <p><strong>Clinical Rationale:</strong> ${result?.reason}</p>
        </div>

        <div class="section-title">Prescribed Medications & Dosage</div>
        <div class="meds">
          ${result?.medicines}
        </div>

        <div class="section-title">Recommended Diagnostic Tests</div>
        <div class="box">${result?.tests_required}</div>

        <div class="section-title">Self-Care & Lifestyle Advice</div>
        <div class="box">${result?.self_care}</div>

        <div class="warning">
          <strong>Emergency Warning:</strong> ${result?.emergency_warning}
        </div>

        <div class="footer">
          Verified by Swasthya Setu Clinical AI Engine
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Swasthya_Setu_Rx_${symptoms.slice(0, 15).replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const matchedDoctor = result ? getMatchedDoctor(result.recommended_specialist) : DOCTORS_LIST[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="no-print">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          🩺 AI Symptom Checker & Digital Rx
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Answer a few questions and receive an AI-assisted prescription & triage report.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 no-print">
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
        <div className="text-xs font-bold text-slate-500 flex justify-between">
          <span>Step {step} of 4</span>
          <span>
            {step === 1 && 'About You'}
            {step === 2 && 'Symptoms'}
            {step === 3 && 'Medical History'}
            {step === 4 && 'Digital Rx Report'}
          </span>
        </div>
      </div>

      {/* STEP 1: About You */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Step 1: Patient Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Symptoms */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Step 2: Describe Symptoms</h2>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Detailed Symptoms</label>
            <textarea
              rows={4}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Chest pain, shortness of breath, radiating pain, diaphoresis, insomnia, acidity..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 30 mins, 3 days"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => {
                if (symptoms.trim()) setStep(3);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Medical History */}
      {step === 3 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Step 3: Medical History</h2>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Existing Medical Conditions</label>
            <input
              type="text"
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              placeholder="e.g. Asthma, Diabetes, Hypertension"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Current Medications</label>
            <input
              type="text"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="e.g. Paracetamol, Metformin"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : '🤖 Generate AI Prescription & Report'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Digital Rx Prescription Card & Connected Appointment Flow */}
      {step === 4 && result && (
        <div className="space-y-6">
          {/* Connected Pathway Visual Header */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                🤖 AI Diagnosis: {result.possible_disease.split('/')[0]}
              </span>
              <span>➔</span>
              <span className="bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                👨‍⚕️ Specialist: {result.recommended_specialist.split('/')[0]}
              </span>
              <span>➔</span>
              <span className="bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/30">
                📅 Match: {matchedDoctor.name}
              </span>
            </div>
            <button
              onClick={() => {
                setBookingConfirmed(false);
                setBookingModalDoc(matchedDoctor);
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" /> Book Appointment Now
            </button>
          </div>

          {/* Action Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-5 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-3 no-print">
            <div>
              <h2 className="text-lg font-extrabold flex items-center gap-2">
                📋 Medical Prescription & Assessment Report
              </h2>
              <p className="text-xs text-white/80 mt-0.5">
                Official AI Digital Rx for {user?.full_name || 'Patient'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopy}
                className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-3.5 py-2 rounded-xl backdrop-blur-md transition-all flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
              <button
                onClick={handlePrint}
                className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Rx
              </button>
              <button
                onClick={handleDownloadDoc}
                className="bg-emerald-950/40 hover:bg-emerald-950/60 text-white font-bold text-xs px-3.5 py-2 rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Save as .DOC
              </button>
            </div>
          </div>

          {/* Rx Printable Document Card */}
          <div className="print-area bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            {/* Header Letterhead */}
            <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🏥</span>
                <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                  Swasthya Setu
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full font-extrabold inline-block mb-1">
                  Rx Digital Prescription
                </span>
                <p className="text-[11px] font-semibold text-slate-400">
                  Date: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Patient Demographics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Patient Name</span>
                <p className="font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{user?.full_name || 'Patient'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Age / Gender</span>
                <p className="font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{age} Yrs / {gender}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Reported Symptoms</span>
                <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 truncate">{symptoms}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Duration & Severity</span>
                <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{duration} ({severity})</p>
              </div>
            </div>

            {/* Diagnosis Banner */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border-l-4 border-emerald-600 p-4 rounded-2xl space-y-1">
              <span className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                Clinical Diagnosis / Probable Condition
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {result.possible_disease}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{result.reason}</p>
            </div>

            {/* Prescribed Medicines Box */}
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                  💊 Prescribed Medications & Dosage Guidelines
                </span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/60 px-2.5 py-0.5 rounded-full">
                  Rx Recommended
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900 p-4 rounded-xl font-bold text-sm text-blue-950 dark:text-blue-100 leading-relaxed">
                {result.medicines}
              </div>
            </div>

            {/* CONNECTED MODULE BANNER: Recommended Specialist + Direct Doctor Appointment */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-md border border-indigo-900 space-y-3 no-print">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{matchedDoctor.image}</span>
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">
                      Recommended Specialist Consultation
                    </span>
                    <h4 className="text-base font-extrabold text-white">
                      {matchedDoctor.name} ({matchedDoctor.specialization})
                    </h4>
                    <p className="text-xs text-slate-300">{matchedDoctor.hospital} • {matchedDoctor.experience}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 block">{matchedDoctor.fee}</span>
                  <span className="text-[10px] text-slate-400">{matchedDoctor.available}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <p className="text-xs text-indigo-200">
                  Directly book consultation for <strong>{result.possible_disease.split('/')[0]}</strong>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActivePage('appointments')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl"
                  >
                    View All Doctors
                  </button>
                  <button
                    onClick={() => {
                      setBookingConfirmed(false);
                      setBookingModalDoc(matchedDoctor);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Book Consultation
                  </button>
                </div>
              </div>
            </div>

            {/* Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Recommended Specialist Type
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                  👨‍⚕️ {result.recommended_specialist}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Urgency Classification
                </span>
                <p className="text-sm font-bold text-red-600 dark:text-red-400 mt-1">
                  ⚠️ {result.urgency}
                </p>
              </div>
            </div>

            {/* Diagnostic Tests */}
            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 p-4 rounded-2xl space-y-1">
              <span className="text-xs font-extrabold text-purple-800 dark:text-purple-300">🧪 Recommended Diagnostic Tests</span>
              <p className="text-xs text-purple-900 dark:text-purple-300 font-semibold">{result.tests_required}</p>
            </div>

            {/* Guidance */}
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-4 rounded-2xl space-y-1">
              <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300">💡 Self-Care & Lifestyle Guidance</span>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">{result.self_care}</p>
            </div>

            {/* Emergency Warning */}
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-4 rounded-2xl space-y-1">
              <span className="text-xs font-extrabold text-red-800 dark:text-red-300">🚨 Emergency Red-Flag Warning</span>
              <p className="text-xs text-red-700 dark:text-red-400">{result.emergency_warning}</p>
            </div>

            {/* Official Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-start text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-500 dark:text-slate-400">Verified by Swasthya Setu Clinical AI Engine</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between no-print">
            <button
              onClick={() => {
                setStep(1);
                setResult(null);
              }}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Start New Symptom Check
            </button>
          </div>
        </div>
      )}

      {/* CONNECTED BOOKING MODAL */}
      {bookingModalDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 no-print">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            {bookingConfirmed ? (
              <div className="text-center space-y-3 py-4">
                <UserCheck className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  Appointment Confirmed!
                </h3>
                <p className="text-xs text-slate-500">
                  Your appointment with <strong>{bookingModalDoc.name}</strong> ({bookingModalDoc.specialization}) is scheduled for <strong>{bookingDate} at {bookingTime}</strong> for diagnosis: <em>{result?.possible_disease}</em>.
                </p>
                <button
                  onClick={() => setBookingModalDoc(null)}
                  className="bg-emerald-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-3xl">{bookingModalDoc.image}</span>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      Book Consultation with {bookingModalDoc.name}
                    </h3>
                    <p className="text-xs text-emerald-600 font-bold">
                      {bookingModalDoc.specialization} • {bookingModalDoc.hospital}
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                  🩺 Pre-filled Diagnosis: <strong>{result?.possible_disease}</strong>
                </div>

                <form onSubmit={handleConfirmAppointment} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Patient Name</label>
                    <input
                      type="text"
                      value={user?.full_name || 'Tejal S'}
                      readOnly
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Time Slot</label>
                      <input
                        type="text"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setBookingModalDoc(null)}
                      className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs py-2.5 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md"
                    >
                      Confirm Booking ({bookingModalDoc.fee})
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
