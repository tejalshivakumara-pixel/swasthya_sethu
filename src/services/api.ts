import axios from 'axios';

// Connects to Render backend URL in production, or localhost during development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  signup: (full_name: string, email: string, password: string, phone: string, dob?: string) =>
    api.post('/auth/signup', { full_name, email, password, phone, dob }),
};

export const symptomAPI = {
  analyze: (data: {
    user_id?: number;
    age: number;
    gender: string;
    symptoms: string;
    duration: string;
    severity: string;
    history?: string;
    medications?: string;
    allergies?: string;
  }) => api.post('/symptom-checker/analyze', data),
};

export const appointmentAPI = {
  getDoctors: () => api.get('/appointments/doctors'),
  bookAppointment: (data: {
    doctor_id: number;
    doctor_name: string;
    patient_name: string;
    phone: string;
    date: string;
    time: string;
  }) => api.post('/appointments/book', data),
};

export const medicineAPI = {
  getMedicines: () => api.get('/medicines'),
  addMedicine: (data: { name: string; dosage: string; time: string; frequency: string }) =>
    api.post('/medicines/add', data),
};

export const recordsAPI = {
  getRecords: () => api.get('/records'),
};

export const emergencyAPI = {
  getContacts: () => api.get('/emergency/contacts'),
};
