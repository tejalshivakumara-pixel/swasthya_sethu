import React, { useEffect, useRef } from 'react';
import { Pill, Clock, Plus, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface MedicineVisualizerCardProps {
  totalMedicines: number;
  completedDoses: number;
  nextDoseTime?: string;
  isOverdue?: boolean;
  overdueMessage?: string;
  onAddClick?: () => void;
}

export default function SchemaCard({
  totalMedicines = 4,
  completedDoses = 2,
  nextDoseTime = "10:30 AM",
  isOverdue = false,
  overdueMessage,
  onAddClick
}: MedicineVisualizerCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    let animationFrameId: number;

    const waveData = Array.from({ length: 8 }).map(() => ({
      value: Math.random() * 0.5 + 0.1,
      targetValue: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.02 + 0.01
    }));

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = canvas.parentElement?.clientHeight || 200;
    }

    function updateWaveData() {
      waveData.forEach(data => {
        if (Math.random() < 0.01) data.targetValue = Math.random() * 0.7 + 0.1;
        const diff = data.targetValue - data.value;
        data.value += diff * data.speed;
      });
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      waveData.forEach((data, i) => {
        const freq = data.value * 7;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const nx = (x / canvas.width) * 2 - 1;
          const px = nx + i * 0.04 + freq * 0.03;
          const py = Math.sin(px * 10 + time) * Math.cos(px * 2) * freq * 0.1 * ((i + 1) / 8);
          const y = (py + 1) * canvas.height / 2;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const intensity = Math.min(1, freq * 0.3);

        // Yellow (amber) when dose is pending/overdue; Vibrant Emerald Green when dose is taken!
        const r = isOverdue ? 245 : 16;
        const g = isOverdue ? 158 : 185 + intensity * 60;
        const b = isOverdue ? 11 : 129;

        ctx.lineWidth = 1 + i * 0.3;
        ctx.strokeStyle = `rgba(${r},${g},${b},0.65)`;
        ctx.shadowColor = `rgba(${r},${g},${b},0.6)`;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
    }

    function animate() {
      time += 0.02;
      updateWaveData();
      draw();
      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOverdue]);

  const progressPercent = totalMedicines > 0 ? Math.round((completedDoses / totalMedicines) * 100) : 0;

  return (
    <div className={`relative card-border overflow-hidden rounded-3xl flex flex-col shadow-2xl animate-float max-w-full transition-all duration-500 ${
      isOverdue ? 'border-amber-400/50' : 'border-emerald-500/40'
    }`}>
      {/* Top Wave Canvas Area */}
      <div className="p-4 flex justify-center relative">
        <div className="w-full h-44 rounded-2xl gradient-border inner-glow overflow-hidden relative">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          
          {/* Grid lines overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div
              className="w-full h-full animate-pulse"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />
          </div>

          {/* Floating Pill Status Banner overlay */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 glass rounded-full text-xs font-extrabold border shadow-md transition-colors duration-500 ${
                isOverdue ? 'text-amber-300 border-amber-400/50 bg-amber-950/40' : 'text-emerald-300 border-emerald-400/40 bg-emerald-950/40'
              }`}>
                {isOverdue ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
                {isOverdue ? 'Dose Reminder Alert (Pending)' : 'Dose Completed (On Track)'}
              </span>

              <span className="text-white/80 text-[10px] font-extrabold glass px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full animate-ping ${isOverdue ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                Live Monitoring
              </span>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">Today's Progress</span>
                <span className="text-2xl font-black text-white">{progressPercent}% Completed</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">
                  {isOverdue ? 'Pending Dose Required' : 'Next Scheduled Dose'}
                </span>
                <span className={`text-sm font-extrabold flex items-center justify-end gap-1 transition-colors duration-500 ${
                  isOverdue ? 'text-amber-400 animate-pulse' : 'text-emerald-300'
                }`}>
                  <Clock className="w-3.5 h-3.5" /> {nextDoseTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`w-full h-px bg-gradient-to-r from-transparent ${
        isOverdue ? 'via-amber-400/60' : 'via-emerald-400/60'
      } to-transparent transition-all duration-500`} />

      {/* Bottom Information & Action Area */}
      <div className="p-5 space-y-3 bg-[#0d1527]/90">
        {isOverdue && overdueMessage ? (
          <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl text-xs font-extrabold text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 animate-bounce" />
            <span>{overdueMessage}</span>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl text-xs font-extrabold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Dose confirmed! AI Medication tracker updated to Green.</span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isOverdue
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center pt-1">
          <button
            onClick={onAddClick}
            className="text-emerald-400 hover:text-emerald-300 transition-all flex items-center gap-1 text-xs font-bold glass px-3.5 py-2 rounded-xl border border-emerald-400/30 hover:border-emerald-400/60"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Medication
          </button>
          <span className="text-slate-400 text-xs flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Automated Sync
          </span>
        </div>
      </div>
    </div>
  );
}
