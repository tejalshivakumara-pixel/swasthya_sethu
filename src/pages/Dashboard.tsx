import React from 'react';
import { useApp } from '../context/AppContext';
import { Stethoscope, Calendar, AlertTriangle, Pill, FileText, ScanLine, ArrowRight, Sparkles } from 'lucide-react';
import { CardCarousel, HealthTipItem } from '../components/ui/card-carousel';

const HEALTH_TIPS_DATA: HealthTipItem[] = [
  { id: "tip-1", icon: "💧", category: "Hydration", title: "Stay Hydrated", text: "Drink 2–3 litres of clean water daily to boost energy, kidney function & digestion.", color: "from-cyan-600 to-blue-700" },
  { id: "tip-2", icon: "🥗", category: "Nutrition", title: "Eat Healthy Foods", text: "Include fresh fruits, green leafy vegetables, lentils and proteins in daily family meals.", color: "from-emerald-600 to-teal-700" },
  { id: "tip-3", icon: "🏃", category: "Fitness", title: "Stay Active Daily", text: "Walk or exercise for 30 minutes every day to maintain cardiac health & joint mobility.", color: "from-amber-600 to-orange-700" },
  { id: "tip-4", icon: "😴", category: "Sleep Care", title: "Quality Rest", text: "Aim for 7–8 hours of restful sleep every night to restore immunity & lower stress.", color: "from-indigo-600 to-purple-700" },
  { id: "tip-5", icon: "🧘", category: "Mental Health", title: "Manage Stress", text: "Practice deep breathing or meditation for 10 minutes to calm mind & reduce anxiety.", color: "from-teal-600 to-emerald-800" }
];

export const Dashboard: React.FC = () => {
  const { setActivePage } = useApp();

  // All 6 Platform Feature Services (Aligned in a balanced 3x2 Grid)
  const allFeatures = [
    {
      id: 'symptom_checker',
      icon: Stethoscope,
      emoji: '🤖',
      title: 'AI Symptom Checker',
      desc: 'Describe symptoms in your local language (Kannada, Hindi, English) for instant preliminary health assessment.',
      badge: '24/7 AI Engine',
      color: 'from-cyan-500/20 to-blue-500/10 hover:border-cyan-500/50',
      accentColor: 'text-cyan-400'
    },
    {
      id: 'appointments',
      icon: Calendar,
      emoji: '📅',
      title: 'Doctor Appointments',
      desc: 'Book in-person or telemedicine consultations with verified doctors across Karnataka.',
      badge: 'Karnataka Registry',
      color: 'from-emerald-500/20 to-teal-500/10 hover:border-emerald-500/50',
      accentColor: 'text-emerald-400'
    },
    {
      id: 'reminders',
      icon: Pill,
      emoji: '💊',
      title: 'Medicine Reminders',
      desc: 'Set smart daily dosage alarms with yellow-to-green dose completion tracking.',
      badge: 'Smart Alarms',
      color: 'from-amber-500/20 to-orange-500/10 hover:border-amber-500/50',
      accentColor: 'text-amber-400'
    },
    {
      id: 'records',
      icon: FileText,
      emoji: '🗂️',
      title: 'Health Records Vault',
      desc: 'Store & access scanned prescriptions, AI assessments, & lab reports dynamically.',
      badge: 'Encrypted Vault',
      color: 'from-indigo-500/20 to-purple-500/10 hover:border-indigo-500/50',
      accentColor: 'text-indigo-400'
    },
    {
      id: 'scanner',
      icon: ScanLine,
      emoji: '📷',
      title: 'Prescription Scanner',
      desc: 'Real-time text unzipping & medical OCR to extract exact drugs, Jan Aushadhi prices, & pharmacy stock.',
      badge: 'Real-Time OCR',
      color: 'from-teal-500/20 to-cyan-500/10 hover:border-teal-500/50',
      accentColor: 'text-teal-400'
    },
    {
      id: 'emergency',
      icon: AlertTriangle,
      emoji: '🚑',
      title: 'Emergency Help',
      desc: 'One-tap 108 ambulance beacon, 24/7 Karnataka hospital contacts, AYUSH remedies & CPR guides.',
      badge: '24/7 Emergency',
      color: 'from-red-500/20 to-rose-500/10 hover:border-red-500/50',
      accentColor: 'text-red-400'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-slate-100 font-sans">
      
      {/* TOP GLASSMORPHIC HERO BANNER */}
      <div className="bg-[#111927] border border-cyan-500/30 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-black text-2xl shadow-lg shadow-cyan-500/20 shrink-0">
              🏥
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Swasthya<span className="text-cyan-400">Setu</span> Portal
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActivePage('symptom_checker')}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-2xl transition-all shadow-lg shadow-cyan-500/20 hover:scale-105 flex items-center gap-2"
            >
              Start AI Consultation <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Feature Badges */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 relative z-10 pt-2 border-t border-slate-800/80">
          {[
            { label: '✨ Accessible' },
            { label: '🤖 AI-Powered' },
            { label: '⚡ Fast Triage' }
          ].map((tag, idx) => (
            <span
              key={idx}
              className="bg-slate-900/90 border border-slate-800 text-slate-200 hover:text-cyan-300 hover:border-cyan-500/50 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>

      {/* DAILY HEALTH TIPS 3D COVERFLOW CAROUSEL */}
      <CardCarousel tips={HEALTH_TIPS_DATA} autoplayDelay={3500} showPagination={true} showNavigation={true} />

      {/* PLATFORM FEATURES GRID (ALL 6 SERVICES IN A 3x2 GRID) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" /> Platform Services ({allFeatures.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Select any core service to get started</p>
          </div>
          <div className="flex-1 max-w-xs h-0.5 bg-gradient-to-r from-cyan-500/40 to-transparent rounded-full hidden sm:block ml-4" />
        </div>

        {/* 3x2 Balanced Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {allFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => setActivePage(feat.id)}
                className={`bg-[#111927] border border-slate-800 rounded-3xl p-5 shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1 hover:shadow-2xl bg-gradient-to-br ${feat.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner">
                      {feat.emoji}
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 ${feat.accentColor}`}>
                      {feat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-base font-black text-white group-hover:${feat.accentColor} transition-colors flex items-center gap-1.5`}>
                      {feat.title} <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-normal">
                      {feat.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-slate-200">
                  <span>Open Service</span>
                  <Icon className={`w-4 h-4 ${feat.accentColor}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 font-medium">
        💙 Swasthya Setu Platform
      </footer>

    </div>
  );
};
