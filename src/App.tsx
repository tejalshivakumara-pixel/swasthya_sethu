import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { SymptomChecker } from './pages/SymptomChecker';
import { DoctorAppointments } from './pages/DoctorAppointments';
import { MedicineReminders } from './pages/MedicineReminders';
import { HealthRecords } from './pages/HealthRecords';
import { PrescriptionScanner } from './pages/PrescriptionScanner';
import { EmergencyHelp } from './pages/EmergencyHelp';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

export const MainLayout: React.FC = () => {
  const { activePage, user } = useApp();

  // Full-Screen Authentication Layout without Sidebar for Login & Sign Up screens
  if (!user || activePage === 'login' || activePage === 'signup') {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center p-4 md:p-8 font-sans">
        {activePage === 'signup' ? <Signup /> : <Login />}
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Dashboard />;
      case 'symptom_checker':
        return <SymptomChecker />;
      case 'appointments':
        return <DoctorAppointments />;
      case 'reminders':
        return <MedicineReminders />;
      case 'records':
        return <HealthRecords />;
      case 'scanner':
        return <PrescriptionScanner />;
      case 'emergency':
        return <EmergencyHelp />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        {renderPage()}
      </main>
    </div>
  );
};
