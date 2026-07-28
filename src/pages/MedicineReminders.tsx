import React, { useState, useEffect } from 'react';
import { medicineAPI } from '../services/api';
import { Medicine } from '../types';
import SchemaCard from '../components/ui/schema-card-with-animated-wave-visualizer';
import { Pill, Plus, Check, Trash2, Clock, Calendar, ShieldCheck, Bell, CheckCircle2, Sun, Moon } from 'lucide-react';

// Helper to parse time string like "11:00 AM" or "08:30 PM" into minutes from midnight
const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return -1;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return -1;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

// Helper to calculate exact reminder time (15 mins before scheduled time)
const getReminderTimeStr = (scheduledTimeStr: string): string => {
  const mins = parseTimeToMinutes(scheduledTimeStr);
  if (mins === -1) return scheduledTimeStr;
  const remMins = (mins - 15 + 1440) % 1440;
  const h = Math.floor(remMins / 60);
  const m = remMins % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = m < 10 ? `0${m}` : `${m}`;
  return `${displayH}:${displayM} ${ampm}`;
};

export const MedicineReminders: React.FC = () => {
  // START WITH NO DEFAULT SAMPLE MEDICINES (Starts Empty)
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Twice daily');

  // Dynamic Multiple Timings State
  const [time1, setTime1] = useState('11:00 AM');
  const [time2, setTime2] = useState('08:30 PM');
  const [time3, setTime3] = useState('02:00 PM');

  const [nowDate, setNowDate] = useState(new Date());

  // Real-time clock update
  useEffect(() => {
    const updateClock = () => setNowDate(new Date());
    updateClock();
    const interval = setInterval(updateClock, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch medicines from localStorage (populated dynamically by 1-Click Add from Prescription Scanner)
  useEffect(() => {
    try {
      const storedStr = localStorage.getItem('swasthya_med_reminders');
      if (storedStr) {
        const parsed = JSON.parse(storedStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMedicines(parsed);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    medicineAPI.getMedicines().then((res) => {
      if (res.data && res.data.medicines && res.data.medicines.length > 0) {
        setMedicines(res.data.medicines);
      }
    }).catch(() => {
      // Keep empty by default
    });
  }, []);

  const handleToggle = (id: number) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m))
    );
  };

  const handleDelete = (id: number) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  // Add Medication supporting Multiple Timings based on frequency
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const medName = name.trim();
    const medDosage = dosage.trim() || '1 tablet';

    let newMeds: Medicine[] = [];

    if (frequency === 'Twice daily') {
      newMeds = [
        {
          id: Date.now(),
          name: `${medName} (Morning Dose)`,
          dosage: medDosage,
          time: time1 || '11:00 AM',
          frequency: 'Twice daily',
          taken: false,
          icon: '☀️'
        },
        {
          id: Date.now() + 1,
          name: `${medName} (Evening Dose)`,
          dosage: medDosage,
          time: time2 || '08:30 PM',
          frequency: 'Twice daily',
          taken: false,
          icon: '🌙'
        }
      ];
    } else if (frequency === 'Thrice daily') {
      newMeds = [
        {
          id: Date.now(),
          name: `${medName} (Morning)`,
          dosage: medDosage,
          time: time1 || '08:00 AM',
          frequency: 'Thrice daily',
          taken: false,
          icon: '🌅'
        },
        {
          id: Date.now() + 1,
          name: `${medName} (Afternoon)`,
          dosage: medDosage,
          time: time3 || '02:00 PM',
          frequency: 'Thrice daily',
          taken: false,
          icon: '☀️'
        },
        {
          id: Date.now() + 2,
          name: `${medName} (Night)`,
          dosage: medDosage,
          time: time2 || '08:30 PM',
          frequency: 'Thrice daily',
          taken: false,
          icon: '🌙'
        }
      ];
    } else {
      newMeds = [
        {
          id: Date.now(),
          name: medName,
          dosage: medDosage,
          time: time1 || '11:00 AM',
          frequency: frequency,
          taken: false,
          icon: '💊'
        }
      ];
    }

    setMedicines((prev) => [...newMeds, ...prev]);
    setName('');
    setDosage('');
  };

  const currentMinutes = nowDate.getHours() * 60 + nowDate.getMinutes();
  const currentTimeStr = nowDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  const completedCount = medicines.filter((m) => m.taken).length;
  const pendingMeds = medicines.filter((m) => !m.taken);

  // Find next pending dose
  const nextPendingMed = pendingMeds[0];

  // Calculate reminder time (15 minutes before scheduled dose time)
  const reminderTime = nextPendingMed ? getReminderTimeStr(nextPendingMed.time) : '';

  // Trigger yellow alert when current time has reached or passed the 15-min reminder time
  const isReminderDue = nextPendingMed
    ? currentMinutes >= (parseTimeToMinutes(nextPendingMed.time) - 15)
    : false;

  const nextDoseText = nextPendingMed
    ? `${reminderTime} (${nextPendingMed.name})`
    : medicines.length > 0 ? 'All Doses Completed 🎉' : 'No Medicines Set';

  const overdueMessage = nextPendingMed && isReminderDue
    ? `Take ${nextPendingMed.name} (${nextPendingMed.dosage}) - Scheduled at ${nextPendingMed.time}`
    : undefined;

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span className="text-3xl">💊</span> Medicine Reminders & Schedule
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Current clock: <strong className="text-cyan-400 font-bold">{currentTimeStr}</strong>. Track your daily prescribed doses cleanly.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#111927] border border-slate-800 px-4 py-2 rounded-2xl text-xs font-extrabold text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{completedCount} of {medicines.length} Doses Taken</span>
        </div>
      </div>

      {/* CLEAN REMINDER BANNER */}
      {isReminderDue && nextPendingMed ? (
        <div className="bg-gradient-to-r from-amber-950/90 via-yellow-950/70 to-slate-900 border-2 border-amber-400/60 rounded-3xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4 transition-all duration-500">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/50 flex items-center justify-center font-black text-2xl shrink-0">
              <Bell className="w-6 h-6 text-amber-400 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Next Reminder At: {reminderTime}
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-1">
                {nextPendingMed.name} ({nextPendingMed.dosage})
              </h3>
              <p className="text-xs text-amber-200 mt-0.5">
                Scheduled dose time: <strong>{nextPendingMed.time}</strong>. Please mark as taken when consumed.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleToggle(nextPendingMed.id)}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 shrink-0 flex items-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" /> Mark Dose Taken
          </button>
        </div>
      ) : medicines.length > 0 ? (
        <div className="bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-slate-900 border-2 border-emerald-400/50 rounded-3xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4 transition-all duration-500">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-black text-2xl shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  All Scheduled Doses Up To Date ✅
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-1">
                Great job! All active reminders completed.
              </h3>
              <p className="text-xs text-emerald-200 mt-0.5">
                {nextPendingMed
                  ? `Next Reminder At: ${getReminderTimeStr(nextPendingMed.time)} for ${nextPendingMed.name}`
                  : 'All doses for today have been taken!'}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* TOP ROW: SchemaCard Animated Wave Visualizer + Add Reminder Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: SchemaCard Animated Wave Visualizer (7 cols) */}
        <div className="md:col-span-7">
          <SchemaCard
            totalMedicines={medicines.length}
            completedDoses={completedCount}
            nextDoseTime={nextDoseText}
            isOverdue={isReminderDue}
            overdueMessage={overdueMessage}
            onAddClick={() => {
              const el = document.getElementById('med-name-input');
              if (el) el.focus();
            }}
          />
        </div>

        {/* Right Column: Glassmorphic Add Reminder Form (5 cols) */}
        <div className="md:col-span-5 bg-[#111927] border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" /> Add New Medication
            </h2>
            <span className="text-[10px] font-extrabold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              Schedule Sync
            </span>
          </div>

          <form onSubmit={handleAdd} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Medicine Name</label>
              <input
                id="med-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tazloc Trio, Paracetamol 650mg"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Dosage</label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 1 tablet after food"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Once daily">Once daily (1 Dose)</option>
                <option value="Twice daily">Twice daily (2 Different Timings)</option>
                <option value="Thrice daily">Thrice daily (3 Different Timings)</option>
                <option value="As needed (SOS)">As needed (SOS)</option>
              </select>
            </div>

            {/* DYNAMIC TIMING INPUTS BASED ON FREQUENCY */}
            {frequency === 'Twice daily' ? (
              <div className="space-y-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <label className="block text-[11px] font-extrabold text-cyan-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Set 2 Scheduled Timings:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-0.5 flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-400" /> Morning Time
                    </label>
                    <input
                      type="text"
                      value={time1}
                      onChange={(e) => setTime1(e.target.value)}
                      placeholder="11:00 AM"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-0.5 flex items-center gap-1">
                      <Moon className="w-3 h-3 text-indigo-400" /> Evening / Night Time
                    </label>
                    <input
                      type="text"
                      value={time2}
                      onChange={(e) => setTime2(e.target.value)}
                      placeholder="08:30 PM"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>
            ) : frequency === 'Thrice daily' ? (
              <div className="space-y-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <label className="block text-[11px] font-extrabold text-cyan-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Set 3 Scheduled Timings:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Morning</label>
                    <input
                      type="text"
                      value={time1}
                      onChange={(e) => setTime1(e.target.value)}
                      placeholder="08:00 AM"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Afternoon</label>
                    <input
                      type="text"
                      value={time3}
                      onChange={(e) => setTime3(e.target.value)}
                      placeholder="02:00 PM"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-0.5">Night</label>
                    <input
                      type="text"
                      value={time2}
                      onChange={(e) => setTime2(e.target.value)}
                      placeholder="08:30 PM"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Scheduled Time</label>
                <input
                  type="text"
                  value={time1}
                  onChange={(e) => setTime1(e.target.value)}
                  placeholder="e.g. 11:00 AM"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
            >
              Save Medication Schedule
            </button>
          </form>
        </div>
      </div>

      {/* BOTTOM SECTION: Today's Medication Schedule Cards Grid */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" /> Today's Medication Schedule ({medicines.length})
          </h2>
          {medicines.length > 0 && (
            <span className="text-xs font-bold text-slate-400">
              Click "Mark Taken" when you consume your dose
            </span>
          )}
        </div>

        {medicines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicines.map((med) => {
              const isThisMedDue = med.id === nextPendingMed?.id && !med.taken && isReminderDue;
              return (
                <div
                  key={med.id}
                  className={`bg-[#111927] border rounded-3xl p-5 shadow-xl flex items-center justify-between gap-4 transition-all duration-300 ${
                    med.taken
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : isThisMedDue
                      ? 'border-amber-400/70 bg-amber-950/30 shadow-amber-500/10 ring-2 ring-amber-400/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Medicine Icon Box */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${
                        med.taken
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : isThisMedDue
                          ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      {med.icon || '💊'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-extrabold text-sm ${
                            med.taken ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {med.name}
                        </h3>
                        {med.taken ? (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Dose Taken ✅
                          </span>
                        ) : isThisMedDue && (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Reminder Active ⏰
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{med.dosage}</p>
                      <p className="text-[11px] font-semibold text-cyan-400 mt-1 flex items-center gap-2">
                        <span>⏰ Scheduled: <strong>{med.time}</strong></span>
                        <span>• Reminder At: <strong>{getReminderTimeStr(med.time)}</strong></span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggle(med.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        med.taken
                          ? 'bg-slate-800 text-slate-400 hover:text-white'
                          : isThisMedDue
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      {med.taken ? 'Undo' : 'Mark Taken'}
                    </button>

                    <button
                      onClick={() => handleDelete(med.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete medication"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#111927] border border-slate-800 rounded-3xl p-8 text-center space-y-3">
            <Pill className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-extrabold text-white">No Medications Scheduled Yet</h3>
            <p className="text-xs text-slate-400">Add your first medicine above to set your custom medication schedule & reminders!</p>
          </div>
        )}
      </div>
    </div>
  );
};
