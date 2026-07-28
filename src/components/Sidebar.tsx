import React from 'react';
import { useApp } from '../context/AppContext';
import { ThemeMode, LanguageCode } from '../types';
import {
  LayoutDashboard,
  Stethoscope,
  Calendar,
  Pill,
  FileText,
  ScanLine,
  AlertTriangle,
  LogIn,
  UserPlus,
  LogOut,
  Settings,
  Plus
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { theme, setTheme, language, setLanguage, user, setUser, activePage, setActivePage, t } = useApp();

  const navItems = !user ? [
    { id: 'login', labelKey: 'nav_login', icon: LogIn },
    { id: 'signup', labelKey: 'nav_signup', icon: UserPlus },
    { id: 'home', labelKey: 'nav_home', icon: LayoutDashboard },
    { id: 'symptom_checker', labelKey: 'nav_symptom', icon: Stethoscope },
    { id: 'appointments', labelKey: 'nav_appointment', icon: Calendar },
    { id: 'reminders', labelKey: 'nav_medicine', icon: Pill },
    { id: 'records', labelKey: 'nav_records', icon: FileText },
    { id: 'scanner', labelKey: 'nav_prescription', icon: ScanLine },
    { id: 'emergency', labelKey: 'nav_emergency', icon: AlertTriangle },
  ] : [
    { id: 'home', labelKey: 'nav_home', icon: LayoutDashboard },
    { id: 'symptom_checker', labelKey: 'nav_symptom', icon: Stethoscope },
    { id: 'appointments', labelKey: 'nav_appointment', icon: Calendar },
    { id: 'reminders', labelKey: 'nav_medicine', icon: Pill },
    { id: 'records', labelKey: 'nav_records', icon: FileText },
    { id: 'scanner', labelKey: 'nav_prescription', icon: ScanLine },
    { id: 'emergency', labelKey: 'nav_emergency', icon: AlertTriangle },
  ];

  const handleNavClick = (itemId: string) => {
    if (!user && itemId !== 'login' && itemId !== 'signup' && itemId !== 'emergency') {
      setActivePage('login');
    } else {
      setActivePage(itemId);
    }
  };

  return (
    <aside className="w-64 shrink-0 bg-[#0c1322] text-slate-300 border-r border-slate-800/80 p-5 flex flex-col justify-between h-screen sticky top-0 font-sans shadow-2xl">
      <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1">
        {/* Brand Header: Cyan Medical Plus Logo */}
        <div className="flex items-center gap-3 px-2 py-1 cursor-pointer" onClick={() => setActivePage(user ? 'home' : 'login')}>
          <div className="w-9 h-9 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-cyan-500/30">
            <Plus className="w-6 h-6 stroke-[3.5]" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
              Swasthya<span className="text-cyan-400 font-extrabold">Setu</span>
            </h1>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          <div className="px-3 mb-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
            {t('navigation')}
          </div>
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-xs transition-all duration-200 select-none group ${
                    isActive
                      ? 'bg-slate-800/90 text-cyan-400 shadow-lg shadow-cyan-500/10 border border-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {/* Left glowing indicator bar for active item */}
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full shadow-sm shadow-cyan-400" />
                  )}
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span className="truncate">{t(item.labelKey)}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Controls & User Profile */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-4">
        {/* Settings & Theme */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
              <Settings className="w-3.5 h-3.5 text-slate-400" /> {t('settings')}
            </span>
          </div>

          {/* Theme Radio */}
          <div className="grid grid-cols-2 gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {(['Light', 'Dark'] as ThemeMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setTheme(mode)}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  theme === mode
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer appearance-none"
            >
              <option value="English">🌐 English</option>
              <option value="हिंदी">🌐 हिंदी (Hindi)</option>
              <option value="ಕನ್ನಡ">🌐 ಕನ್ನಡ (Kannada)</option>
              <option value="தமிழ்">🌐 தமிழ் (Tamil)</option>
              <option value="తెలుగు">🌐 తెలుగు (Telugu)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* User Card & Logout */}
        {user ? (
          <div className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-2xl flex items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-black text-xs shrink-0">
                {user.full_name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-extrabold text-white truncate">{user.full_name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setUser(null);
                setActivePage('login');
              }}
              className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors shrink-0"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-2xl text-center space-y-2">
            <p className="text-xs font-extrabold text-white">Guest Access</p>
            <button
              onClick={() => setActivePage('login')}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs py-2 rounded-xl transition-all shadow-md"
            >
              Log In / Sign Up
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
