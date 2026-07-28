import React, { useState, useEffect } from 'react';
import { emergencyAPI } from '../services/api';
import { EmergencyContact } from '../types';
import { AlertTriangle, PhoneCall, HeartPulse, Flame, Droplets, ShieldAlert, Sparkles, Navigation, Volume2, Share2, Info, Activity, CheckCircle2, ChevronRight, ChevronLeft, RefreshCw, Leaf } from 'lucide-react';

interface HomeRemedy {
  id: string;
  title: string;
  category: string;
  icon: string;
  indication: string;
  ingredients: string[];
  steps: string[];
  scientificRationale: string;
  warning: string;
}

interface FirstAidGuide {
  id: string;
  title: string;
  category: string;
  icon: string;
  steps: string[];
  caution: string;
}

const EMERGENCY_HELPLINES: (EmergencyContact & { hospitalCity?: string })[] = [
  { name: "Ambulance & Trauma Services", number: "108", type: "24/7 National Ambulance", icon: "🚑" },
  { name: "National Emergency Response", number: "112", type: "Police, Fire & Medical", icon: "🚨" },
  { name: "Tele-MANAS Mental Health", number: "14416", type: "24/7 Psychological Crisis Support", icon: "🧠" },
  { name: "Poison Control & Snakebite", number: "1800-11-6117", type: "Toxicology Emergency", icon: "🐍" },
  { name: "Senior Citizen Helpline", number: "14567", type: "Elder Care & Medical Support", icon: "👵" },
  { name: "Women Emergency Helpline", number: "1091", type: "Safety & Urgent Assistance", icon: "👩" },
  { name: "NIMHANS Neuro Emergency", number: "080-26995000", type: "Bengaluru, KA", icon: "🏥" },
  { name: "Jayadeva Heart ER", number: "080-22977400", type: "Bengaluru / Mysuru, KA", icon: "🫀" },
  { name: "KIMS ER Hospital", number: "0836-2370057", type: "Hubballi-Dharwad, KA", icon: "🏥" },
  { name: "Dist. Govt Hospital ER", number: "08372-233400", type: "Gadag, KA", icon: "🏥" }
];

const HOME_REMEDIES: HomeRemedy[] = [
  {
    id: "rem-1",
    title: "Jeera & Cold Milk Acidity Relief",
    category: "Acidity & Digestion",
    icon: "🥛",
    indication: "Acid reflux, heart burn, upper stomach burning, & gastritis.",
    ingredients: ["1 tsp Cumin (Jeera) Seeds", "1 Glass Cold Milk or Buttermilk (Takra)", "Pinch of Rock Salt (Saindhava Lavana)"],
    steps: [
      "Boil 1 tsp Cumin seeds in 200ml water for 5 minutes and sip warm, OR",
      "Sip half a glass of chilled plain milk slowly to neutralize stomach acid instantly.",
      "Chew 4-5 fresh Tulsi (Holy Basil) leaves or 1 tsp Saunf (Fennel) seeds post-meals."
    ],
    scientificRationale: "Cold milk provides calcium that neutralizes excess gastric HCl acid. Cumin & Fennel stimulate digestive enzymes (amylase) and reduce gas inflation.",
    warning: "Seek immediate hospital care if stomach pain is accompanied by black tarry stools or vomiting blood."
  },
  {
    id: "rem-2",
    title: "Ayurvedic Herbal Kadha for Cough & Cold",
    category: "Cough & Cold",
    icon: "☕",
    indication: "Sore throat, nasal congestion, runny nose, & dry/wet cough.",
    ingredients: ["Crushed Ginger (Adrak)", "5-6 Tulsi Leaves", "3 Black Peppercorns (Kali Mirch)", "Raw Honey or Jaggery", "Pinch of Turmeric"],
    steps: [
      "Boil crushed ginger, Tulsi leaves, and crushed black pepper in 2 cups of water until reduced to half.",
      "Strain into a cup, add 1 tsp raw honey once warm (do not boil honey).",
      "Sip 2-3 times daily for soothing throat relief and clearing bronchial mucus."
    ],
    scientificRationale: "Gingerol and Piperine exhibit potent antimicrobial and anti-inflammatory properties, relaxing airway smooth muscles and reducing histamine response.",
    warning: "Do not give honey to infants under 1 year of age due to botulism risk."
  },
  {
    id: "rem-3",
    title: "Cool Water & Aloe Vera Burn First-Aid",
    category: "Minor Burns & Scalds",
    icon: "🔥",
    indication: "First-degree minor household burns, hot oil scalds, or steam burns.",
    ingredients: ["Cool Running Water (15-20 mins)", "Pure Aloe Vera Gel", "Honey (Medical Grade)"],
    steps: [
      "Immediately hold the burned skin area under cool running tap water for 15-20 minutes. DO NOT use ice or ice water.",
      "Gently pat dry with a clean sterile cloth. Do not rub.",
      "Apply a generous layer of pure Aloe Vera gel or raw honey to soothe skin and accelerate healing."
    ],
    scientificRationale: "Cool water dissipates trapped thermal energy from tissue layers, halting deep burn progression. Aloe Vera contains Acemannan which speeds up epithelial cell regrowth.",
    warning: "NEVER apply toothpaste, butter, or ice directly on burns. For second or third-degree blistered burns, seek urgent ER care."
  },
  {
    id: "rem-4",
    title: "First-Aid Protocol for Snakebite & Stings",
    category: "Snakebite & Insect Stings",
    icon: "🐍",
    indication: "Snakebite, scorpion sting, bee sting, or poisonous insect bite.",
    ingredients: ["Clean Soap & Water", "Immobilization Splint", "Cold Compress (For bee stings only)"],
    steps: [
      "Keep the victim calm and strictly still. Do not let them walk or run, as movement accelerates venom absorption.",
      "Immobilize the affected limb below heart level using a rigid board or stick as a splint.",
      "Wash skin gently with clean water. Transport immediately to the nearest hospital with Anti-Snake Venom (ASV)."
    ],
    scientificRationale: "Venom travels primarily through the lymphatic system. Muscle contraction accelerates venom movement to the bloodstream; complete immobility buys critical emergency time.",
    warning: "CRITICAL: DO NOT cut the wound, DO NOT suck venom out with mouth, DO NOT apply tight tourniquets. Call 108 immediately!"
  },
  {
    id: "rem-5",
    title: "Tepid Water Sponging for High Fever",
    category: "High Fever Cooling",
    icon: "🤒",
    indication: "Body temperature above 101°F (38.3°C) in children or adults.",
    ingredients: ["Tepid / Room Temperature Water", "Soft Clean Washcloths", "ORS or Coconut Water"],
    steps: [
      "Dip washcloth in room-temperature (tepid) water and wring out excess water.",
      "Gently sponge the forehead, armpits, neck, and groin areas for 15-20 minutes.",
      "Encourage frequent sips of ORS (Oral Rehydration Solution) or fresh tender coconut water to prevent dehydration."
    ],
    scientificRationale: "Evaporative cooling through tepid sponging gently draws thermal heat from subcutaneous vascular beds without triggering shivering vasoconstriction.",
    warning: "Do not use cold ice water or alcohol rubs as they cause shivering which raises core body temperature higher."
  },
  {
    id: "rem-6",
    title: "Turmeric & Salt Warm Compress for Sprains",
    category: "Joint Sprains & Muscle Pain",
    icon: "🦴",
    indication: "Ankle sprains, muscle soreness, blunt joint trauma, or swelling.",
    ingredients: ["1 tsp Turmeric Powder (Haldi)", "1 tsp Mustard Oil / Coconut Oil", "Ice Pack (First 48 hours)", "Warm Salt Compress (After 48h)"],
    steps: [
      "Follow R.I.C.E protocol for first 48 hours: Rest, Ice (15 mins), Compression bandage, Elevation.",
      "After 48 hours, warm 1 tsp turmeric powder in warm mustard oil to form a paste and gently apply over joint.",
      "Wrap loosely with a crepe bandage overnight to reduce localized inflammation."
    ],
    scientificRationale: "Curcumin in turmeric inhibits COX-2 enzymes and NF-kB inflammatory pathways, reducing localized tissue edema and joint stiffness.",
    warning: "If joint cannot bear weight or looks visibly deformed, obtain an X-Ray immediately to rule out bone fracture."
  }
];

const EXPANDED_FIRST_AID_GUIDES: FirstAidGuide[] = [
  {
    id: "fa-1",
    title: "Cardiopulmonary Resuscitation (CPR) - Adult",
    category: "Cardiac Arrest",
    icon: "🫀",
    steps: [
      "Check Responsiveness: Tap shoulders firmly and shout 'Are you okay?'.",
      "Call 108 / 112 immediately and retrieve an Automated External Defibrillator (AED).",
      "Chest Compressions: Place heel of hand on center of chest. Compress hard and fast at 100-120 beats/min (2 inches deep).",
      "Give 30 chest compressions followed by 2 rescue breaths. Continue until ambulance paramedics arrive."
    ],
    caution: "If untrained in rescue breathing, perform continuous Hands-Only CPR compressions without interruption."
  },
  {
    id: "fa-2",
    title: "Heimlich Maneuver for Adult Choking",
    category: "Airway Obstruction",
    icon: "🗣️",
    steps: [
      "Stand behind the choking person and wrap your arms around their waist.",
      "Make a fist with one hand and place it thumb-side in just above the person's navel.",
      "Grasp fist with your other hand and give quick, inward and upward abdominal thrusts.",
      "Repeat thrusts continuously until the blocking object is forcibly dislodged."
    ],
    caution: "For infants under 1 year, perform 5 firm back blows followed by 5 chest thrusts instead of abdominal thrusts."
  },
  {
    id: "fa-3",
    title: "Severe Bleeding & Hemorrhage Control",
    category: "Trauma & Wounds",
    icon: "🩸",
    steps: [
      "Apply Firm Direct Pressure: Press a sterile cloth or clean towel directly on the bleeding wound.",
      "Elevate Wound: Raise the injured limb above the level of the heart if no bone fracture is suspected.",
      "Apply Pressure Bandage: Wrap bandage firmly over dressing. Do not remove soaked gauze; add more layers on top.",
      "Apply Tourniquet: For life-threatening arterial limb bleeding, apply tourniquet 2-3 inches above wound."
    ],
    caution: "Do not peek under or remove the initial cloth layer once blood clots begin forming."
  },
  {
    id: "fa-4",
    title: "Heart Attack Emergency Response",
    category: "Cardiovascular Emergency",
    icon: "💔",
    steps: [
      "Sit Patient Down: Have the patient sit down immediately in a semi-upright position resting against a wall.",
      "Chew Aspirin: Give 1 tablet of Aspirin 325mg to chew slowly (unless allergic or advised otherwise).",
      "Sublingual Nitroglycerin: If prescribed, place 1 Nitroglycerin tablet under the patient's tongue.",
      "Call 108 Ambulance: Loosen tight clothing around neck and stay calm while waiting for ER response."
    ],
    caution: "Do not give Aspirin if patient is actively bleeding, has aspirin allergy, or stroke symptoms."
  },
  {
    id: "fa-5",
    title: "Stroke Identification & F.A.S.T Protocol",
    category: "Neurological Emergency",
    icon: "🧠",
    steps: [
      "F - Face Drooping: Ask the person to smile. Does one side of the face droop?",
      "A - Arm Weakness: Ask the person to raise both arms. Does one arm drift downward?",
      "S - Speech Difficulty: Ask the person to repeat a simple sentence. Is speech slurred or strange?",
      "T - Time to Call 108: If you observe any of these signs, call emergency services immediately!"
    ],
    caution: "Note the exact time symptoms started. Stroke clot-dissolving treatment must be given within 3-4.5 hours."
  },
  {
    id: "fa-6",
    title: "Seizure & Epilepsy Safety Protocol",
    category: "Neurological Emergency",
    icon: "⚡",
    steps: [
      "Protect Head: Cushion the person's head with a folded jacket or soft pillow.",
      "Clear Surrounding Area: Move sharp objects, furniture, or hard items away to prevent injury.",
      "Turn on Side: Gently turn the person onto their side (Recovery Position) to keep airway clear.",
      "Time the Seizure: Stay with the person until seizure stops. Call 108 if seizure lasts > 5 minutes."
    ],
    caution: "NEVER put anything inside the person's mouth or attempt to hold down their tongue during a seizure."
  },
  {
    id: "fa-7",
    title: "Anaphylaxis & Severe Allergy Protocol",
    category: "Allergic Emergency",
    icon: "🐝",
    steps: [
      "Recognize Symptoms: Sudden hives, swelling of lips/tongue, wheezing, or difficulty breathing.",
      "Administer Epinephrine (EpiPen): Press auto-injector firmly into outer thigh for 3-5 seconds.",
      "Position Patient: Lay patient flat on back with legs elevated (or seated if breathing is difficult).",
      "Call 108: A second dose of epinephrine may be required if symptoms do not improve within 5-15 mins."
    ],
    caution: "Always seek emergency ER care even if symptoms improve after using an EpiPen."
  },
  {
    id: "fa-8",
    title: "Drowning Resuscitation & Water Evacuation",
    category: "Submersion Emergency",
    icon: "🏊",
    steps: [
      "Safe Evacuation: Remove person from water safely without putting yourself in danger.",
      "Check Airway & Breathing: Lay on firm surface. If not breathing, start CPR immediately.",
      "Rescue Breaths First: Give 5 initial rescue breaths before starting 30 chest compressions.",
      "Keep Warm: Remove wet clothing and cover with dry blankets to prevent hypothermia."
    ],
    caution: "Do not attempt Heimlich maneuver to drain water from lungs; focus on immediate CPR compressions."
  }
];

export const EmergencyHelp: React.FC = () => {
  const [contacts, setContacts] = useState<(EmergencyContact & { hospitalCity?: string })[]>(EMERGENCY_HELPLINES);
  const [selectedRemedyCategory, setSelectedRemedyCategory] = useState('All');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sosActive, setSosActive] = useState(false);
  const [sosStatusText, setSosStatusText] = useState('');
  const [activeTab, setActiveTab] = useState<'helplines' | 'remedies' | 'firstaid'>('helplines');

  // Automatic Fade Animation State (No Manual Slideshow Buttons)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeState, setFadeState] = useState(true);

  useEffect(() => {
    emergencyAPI.getContacts().then((res) => {
      if (res.data && res.data.contacts && res.data.contacts.length > 0) {
        setContacts(res.data.contacts);
      }
    }).catch(() => {
      setContacts(EMERGENCY_HELPLINES);
    });
  }, []);

  // Fully Automatic Fade Transition Timer (Every 5 seconds)
  useEffect(() => {
    if (activeTab !== 'firstaid') return;

    const interval = setInterval(() => {
      setFadeState(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % EXPANDED_FIRST_AID_GUIDES.length);
        setFadeState(true);
      }, 350);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab]);

  // Trigger Emergency SOS Siren Sound & Fetch GPS Coords
  const handleTriggerSOS = () => {
    setSosActive(true);
    setSosStatusText('🚨 SOS BEACON ACTIVATED! Fetching GPS Coordinates...');

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 2);
    } catch (e) {
      console.log(e);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setSosStatusText(`GPS Fixed: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}. Emergency Alert Ready!`);
        },
        () => {
          setSosStatusText('GPS Unavailable. Calling Emergency 108...');
        }
      );
    }
  };

  // Generate WhatsApp SOS Alert Link
  const handleShareSOSLink = () => {
    const locStr = userLocation
      ? `https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`
      : `Location: Karnataka, India`;

    const text = encodeURIComponent(
      `🚨 EMERGENCY SOS MEDICAL ALERT!\nI need urgent medical help.\nMy Live Location: ${locStr}\nPlease dispatch 108 Ambulance immediately!`
    );

    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const filteredRemedies = HOME_REMEDIES.filter(
    (rem) => selectedRemedyCategory === 'All' || rem.category === selectedRemedyCategory
  );

  const activeGuide = EXPANDED_FIRST_AID_GUIDES[currentSlide];

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* TOP EMERGENCY SOS BEACON BANNER */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white rounded-3xl p-6 md:p-8 shadow-2xl space-y-5 border border-red-400/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner shrink-0">
              🚨
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
                Emergency Medical Portal
              </h1>
              <p className="text-xs text-white/90 font-medium mt-0.5">
                Karnataka hospital helplines, AYUSH home remedies & automatic animated emergency guides.
              </p>
            </div>
          </div>

          <button
            onClick={handleTriggerSOS}
            className="bg-slate-950/90 hover:bg-black text-amber-300 border border-amber-400/50 font-black text-xs px-6 py-3.5 rounded-2xl transition-all shadow-xl flex items-center gap-2.5 animate-pulse hover:scale-105"
          >
            <ShieldAlert className="w-5 h-5 text-amber-400" /> Trigger SOS Alarm
          </button>
        </div>

        {/* SOS STATUS BAR */}
        {sosActive && (
          <div className="bg-slate-950/90 border border-amber-400/40 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400 animate-spin" />
              <span className="font-bold text-amber-300">{sosStatusText}</span>
            </div>
            <button
              onClick={handleShareSOSLink}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md"
            >
              <Share2 className="w-3.5 h-3.5" /> Share SOS via WhatsApp
            </button>
          </div>
        )}
      </div>

      {/* PORTAL SECTION TABS */}
      <div className="flex flex-wrap items-center gap-2 bg-[#111927] border border-slate-800 p-2 rounded-2xl shadow-xl">
        <button
          onClick={() => setActiveTab('helplines')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'helplines'
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <PhoneCall className="w-4 h-4" /> Emergency Helplines
        </button>

        <button
          onClick={() => setActiveTab('remedies')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'remedies'
              ? 'bg-emerald-500 text-slate-950 shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Leaf className="w-4 h-4" /> AYUSH Home Remedies
        </button>

        <button
          onClick={() => setActiveTab('firstaid')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'firstaid'
              ? 'bg-cyan-500 text-slate-950 shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <HeartPulse className="w-4 h-4" /> First-Aid & CPR Protocols
        </button>
      </div>

      {/* TAB 1: EMERGENCY HELPLINES & HOSPITALS */}
      {activeTab === 'helplines' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-extrabold text-slate-300">
              Verified Emergency Helplines & Karnataka Hospitals ({contacts.length})
            </h2>
            <span className="text-xs text-slate-400 font-medium">1-Tap Dialing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contacts.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#111927] border border-slate-800 hover:border-red-500/40 rounded-2xl p-5 shadow-xl flex items-center justify-between gap-3 group transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-2xl flex items-center justify-center shrink-0">
                    {item.icon || '🚑'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white group-hover:text-red-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{item.type}</p>
                  </div>
                </div>

                <a
                  href={`tel:${item.number}`}
                  className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 font-black text-xs px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 shadow-md"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> {item.number}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AYUSH HOME REMEDIES GUIDE */}
      {activeTab === 'remedies' && (
        <div className="space-y-5">
          {/* Category Pill Filters */}
          <div className="flex flex-wrap items-center gap-2 bg-[#111927] border border-slate-800 p-3 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 mr-1">Remedy Category:</span>
            {['All', 'Acidity & Digestion', 'Cough & Cold', 'Minor Burns & Scalds', 'Snakebite & Insect Stings', 'High Fever Cooling', 'Joint Sprains & Muscle Pain'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedRemedyCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  selectedRemedyCategory === cat
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Remedy Cards */}
          <div className="grid grid-cols-1 gap-5">
            {filteredRemedies.map((rem) => (
              <div
                key={rem.id}
                className="bg-[#111927] border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 shadow-xl space-y-4 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{rem.icon}</span>
                    <div>
                      <h3 className="text-base font-extrabold text-white">{rem.title}</h3>
                      <p className="text-xs text-emerald-400 font-bold">{rem.category} • Ayurvedic & Traditional First-Aid</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
                    Indication: {rem.indication}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ingredients */}
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <h4 className="font-extrabold text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Required Ingredients:
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {rem.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Scientific Rationale */}
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                    <h4 className="font-extrabold text-xs text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" /> Scientific Mechanism:
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {rem.scientificRationale}
                    </p>
                  </div>
                </div>

                {/* Preparation Steps */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Step-by-Step Preparation & Application:</h4>
                  <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                    {rem.steps.map((step, idx) => (
                      <li key={idx} className="font-normal">{step}</li>
                    ))}
                  </ol>
                </div>

                {/* Warning Alert */}
                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl text-xs text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Medical Precaution:</strong> {rem.warning}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FULLY AUTOMATIC FADE-ANIMATED SLIDE SHOW */}
      {activeTab === 'firstaid' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111927] border border-slate-800 p-4 rounded-2xl shadow-xl">
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-cyan-400" /> Life-Saving Emergency First-Aid Protocols ({EXPANDED_FIRST_AID_GUIDES.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Automatically cycling emergency guides with smooth fade animations</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-xs font-bold text-cyan-400">Auto-Transition Active</span>
            </div>
          </div>

          {/* FADE ANIMATED SLIDE CONTAINER */}
          <div className="relative min-h-[420px]">
            <div
              className={`transition-all duration-700 ease-in-out ${
                fadeState ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-[0.99]'
              }`}
            >
              <div className="bg-[#111927] border-2 border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-3xl flex items-center justify-center shrink-0 shadow-inner">
                      {activeGuide.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">{activeGuide.title}</h3>
                      <p className="text-xs text-cyan-400 font-bold mt-0.5">
                        Category: {activeGuide.category} • Procedure #{currentSlide + 1} of {EXPANDED_FIRST_AID_GUIDES.length}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3.5 py-1.5 rounded-full">
                    AHA / Red Cross Verified Protocol
                  </span>
                </div>

                {/* EMERGENCY ACTION STEPS */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Step-by-Step Emergency Action Protocol:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeGuide.steps.map((st, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-start gap-3 hover:border-cyan-500/30 transition-all">
                        <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-cyan-500/30">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium">{st}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CRITICAL CAUTION BOX */}
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-xs text-red-300 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-red-400 font-black">Critical Emergency Caution:</strong> {activeGuide.caution}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DOT INDICATORS FOR AUTOMATIC SLIDESHOW */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {EXPANDED_FIRST_AID_GUIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setFadeState(false);
                  setTimeout(() => {
                    setCurrentSlide(idx);
                    setFadeState(true);
                  }, 250);
                }}
                className={`h-2.5 rounded-full transition-all ${
                  currentSlide === idx ? 'w-8 bg-cyan-400 shadow-md shadow-cyan-500/50' : 'w-2.5 bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Procedure #${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
