export type ThemeMode = 'Light' | 'Dark';
export type LanguageCode = 'English' | 'हिंदी' | 'ಕನ್ನಡ' | 'தமிழ்' | 'తెలుగు';

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
}

export interface SymptomResult {
  possible_disease: string;
  urgency: string;
  reason: string;
  recommended_specialist: string;
  medicines: string;
  tests_required: string;
  self_care: string;
  emergency_warning: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: string;
  rating: string;
  hospital: string;
  fee: string;
  available: string;
  image: string;
  photoUrl?: string;
  patientsCount?: string;
  isOnline?: boolean;
}

export interface BookedAppointment {
  id: string;
  doctorId: number;
  doctorName: string;
  specialization: string;
  hospital: string;
  patientName: string;
  phone: string;
  date: string;
  time: string;
  fee: string;
  status: 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'booking' | 'cancellation' | 'info';
  read: boolean;
}

export interface Medicine {
  id: number;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  taken: boolean;
  icon: string;
}

export interface HealthRecord {
  id: number;
  title: string;
  date: string;
  doctor: string;
  type: string;
  summary: string;
  icon: string;
}

export interface EmergencyContact {
  name: string;
  number: string;
  type: string;
  icon: string;
}
