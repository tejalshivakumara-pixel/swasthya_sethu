import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { appointmentAPI } from '../services/api';
import { Doctor, BookedAppointment, AppNotification } from '../types';
import { Search, MapPin, Star, CheckCircle, ChevronDown, Bell, ChevronLeft, ChevronRight, Calendar, XCircle, AlertCircle, Sparkles, Check, Navigation, Loader2 } from 'lucide-react';

const TIME_SLOTS = [
  { time: "09:00 AM", available: true },
  { time: "10:00 AM", available: true },
  { time: "11:30 AM", available: false, reason: "Booked by another patient" },
  { time: "02:00 PM", available: true },
  { time: "04:30 PM", available: false, reason: "Doctor in Surgery" },
  { time: "06:00 PM", available: true },
];

const KARNATAKA_CITIES = [
  "All Karnataka",
  "Bengaluru, KA",
  "Gadag, KA",
  "Mandya, KA",
  "Mysuru, KA",
  "Hubballi-Dharwad, KA",
  "Belagavi, KA",
  "Mangaluru, KA",
  "Davangere, KA",
  "Ballari, KA",
  "Shivamogga, KA",
  "Tumakuru, KA",
  "Kalaburagi, KA",
  "Udupi, KA"
];

const AILMENTS_SUGGESTIONS = [
  { icon: "🫀", label: "Chest Pain / Angina / Heart Attack", query: "chest pain", category: "Cardiology" },
  { icon: "🧠", label: "Migraine / Severe Headache / Dizziness", query: "migraine", category: "Neurology" },
  { icon: "🧪", label: "Acidity / GERD / Stomach Ache", query: "acidity", category: "Gastroenterology" },
  { icon: "🧴", label: "Skin Rash / Allergy / Itching / Eczema", query: "skin rash", category: "Dermatology" },
  { icon: "🦴", label: "Joint Pain / Knee Pain / Back Pain", query: "joint pain", category: "Orthopedics" },
  { icon: "🌡️", label: "Fever / Cold / Flu / Infection", query: "fever", category: "General Physician" },
  { icon: "👶", label: "Child Fever / Pediatric Care", query: "child fever", category: "Pediatrics" },
  { icon: "🌙", label: "Insomnia / Sleeplessness", query: "insomnia", category: "Neurology" },
];

const DATABASE_DOCTORS: (Doctor & { ailments?: string[]; city?: string })[] = [
  // BENGALURU DOCTORS
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialization: "Cardiologist",
    experience: "15+ Years Exp",
    rating: "4.9",
    hospital: "Manipal Hospital, Bengaluru",
    city: "Bengaluru, KA",
    fee: "₹500",
    available: "Available Today",
    image: "👩‍⚕️",
    photoUrl: "/doctor_female2.jpg",
    patientsCount: "4.2K+ Patients",
    isOnline: true,
    ailments: ["chest pain", "shortness of breath", "heart attack", "angina", "hypertension", "palpitations"]
  },
  {
    id: 2,
    name: "Dr. Asha Menon",
    specialization: "Neurologist",
    experience: "17+ Years Exp",
    rating: "4.9",
    hospital: "NIMHANS, Bengaluru",
    city: "Bengaluru, KA",
    fee: "₹550",
    available: "Available Tomorrow",
    image: "👩‍⚕️",
    photoUrl: "/doctor_female2.jpg",
    patientsCount: "4.5K+ Patients",
    isOnline: true,
    ailments: ["migraine", "headache", "insomnia", "sleeplessness", "stroke"]
  },
  {
    id: 3,
    name: "Dr. Vishal Mehta",
    specialization: "Cardiologist",
    experience: "19+ Years Exp",
    rating: "5.0",
    hospital: "Apollo Hospital, Bannerghatta, Bengaluru",
    city: "Bengaluru, KA",
    fee: "₹700",
    available: "Available Tomorrow",
    image: "👨‍⚕️",
    photoUrl: "/doctor_male1.jpg",
    patientsCount: "6.0K+ Patients",
    isOnline: true,
    ailments: ["chest pain", "heart attack", "coronary disease", "angina"]
  },
  {
    id: 4,
    name: "Dr. Subhash Patil",
    specialization: "Gastroenterologist",
    experience: "14+ Years Exp",
    rating: "4.8",
    hospital: "Fortis Hospital, Bannerghatta, Bengaluru",
    city: "Bengaluru, KA",
    fee: "₹450",
    available: "Available Today",
    image: "👨‍⚕️",
    photoUrl: "/doctor_male1.jpg",
    patientsCount: "3.9K+ Patients",
    isOnline: true,
    ailments: ["acidity", "gas", "heartburn", "stomach ache", "loose motion", "gerd", "bloating"]
  },

  // GADAG DOCTORS
  {
    id: 5,
    name: "Dr. Anita Rao",
    specialization: "General Physician",
    experience: "12+ Years Exp",
    rating: "4.8",
    hospital: "District Government Hospital, Gadag",
    city: "Gadag, KA",
    fee: "₹200",
    available: "Available Today",
    image: "👩‍⚕️",
    photoUrl: "/featured_doctor.jpg",
    patientsCount: "3.8K+ Patients",
    isOnline: true,
    ailments: ["fever", "cold", "flu", "cough", "infection", "headache", "body pain"]
  },
  {
    id: 6,
    name: "Dr. Rahul Singh",
    specialization: "Neurologist",
    experience: "14+ Years Exp",
    rating: "4.8",
    hospital: "KLE Hospital, Gadag",
    city: "Gadag, KA",
    fee: "₹500",
    available: "Available Today",
    image: "👨‍⚕️",
    photoUrl: "/doctor_male1.jpg",
    patientsCount: "3.6K+ Patients",
    isOnline: true,
    ailments: ["migraine", "headache", "head pain", "dizziness", "nerve pain"]
  },
  {
    id: 7,
    name: "Dr. Deepa Nair",
    specialization: "Dermatologist",
    experience: "11+ Years Exp",
    rating: "4.8",
    hospital: "KLE Hospital, Gadag",
    city: "Gadag, KA",
    fee: "₹350",
    available: "Available Tomorrow",
    image: "👩‍⚕️",
    photoUrl: "/doctor_female2.jpg",
    patientsCount: "2.4K+ Patients",
    isOnline: true,
    ailments: ["skin rash", "itching", "allergy", "skin infection", "hives", "acne"]
  },

  // MANDYA DOCTORS
  {
    id: 8,
    name: "Dr. Ananya Rao",
    specialization: "Gastroenterologist",
    experience: "12+ Years Exp",
    rating: "4.9",
    hospital: "Fortis Hospital, Mandya",
    city: "Mandya, KA",
    fee: "₹400",
    available: "Available Today",
    image: "👩‍⚕️",
    photoUrl: "/doctor_female2.jpg",
    patientsCount: "3.3K+ Patients",
    isOnline: true,
    ailments: ["acidity", "gas", "heartburn", "stomach ache", "loose motion", "gerd", "bloating"]
  },
  {
    id: 9,
    name: "Dr. Emily Carter",
    specialization: "Primary Care Physician",
    experience: "10+ Years Exp",
    rating: "4.9",
    hospital: "Primary Care Clinic, Mandya",
    city: "Mandya, KA",
    fee: "₹300",
    available: "Available Today",
    image: "👩‍⚕️",
    photoUrl: "/featured_doctor.jpg",
    patientsCount: "3.5K+ Patients",
    isOnline: true,
    ailments: ["fever", "cold", "flu", "checkup", "headache"]
  },

  // BELAGAVI DOCTORS
  {
    id: 10,
    name: "Dr. Sanjay Gupta",
    specialization: "Cardiologist",
    experience: "18+ Years Exp",
    rating: "5.0",
    hospital: "KLE Dr. Prabhakar Kore Hospital, Belagavi",
    city: "Belagavi, KA",
    fee: "₹650",
    available: "Available Today",
    image: "👨‍⚕️",
    photoUrl: "/doctor_male1.jpg",
    patientsCount: "5.5K+ Patients",
    isOnline: true,
    ailments: ["chest pain", "heart attack", "cardiac arrhythmia", "chest tightness", "angina"]
  },

  // HUBBALLI DOCTORS
  {
    id: 11,
    name: "Dr. Arjun Reddy",
    specialization: "Neurologist",
    experience: "16+ Years Exp",
    rating: "5.0",
    hospital: "Manipal General Hospital, Hubballi",
    city: "Hubballi-Dharwad, KA",
    fee: "₹600",
    available: "Available Tomorrow",
    image: "👨‍⚕️",
    photoUrl: "/doctor_male1.jpg",
    patientsCount: "4.9K+ Patients",
    isOnline: true,
    ailments: ["migraine", "headache", "insomnia", "stroke", "slurred speech", "numbness"]
  },

  // MYSURU DOCTORS
  {
    id: 12,
    name: "Dr. Vinay Kulkarni",
    specialization: "Cardiologist",
    experience: "16+ Years Exp",
    rating: "4.9",
    hospital: "Sri Jayadeva Institute, Mysuru",
    city: "Mysuru, KA",
    fee: "₹500",
    available: "Available Today",
    image: "👨‍⚕️",
    photoUrl: "/doctor_male1.jpg",
    patientsCount: "5.1K+ Patients",
    isOnline: true,
    ailments: ["chest pain", "shortness of breath", "high blood pressure", "heart attack"]
  },

  // MANGALURU DOCTORS
  {
    id: 13,
    name: "Dr. Rohit Bhat",
    specialization: "Dermatologist",
    experience: "13+ Years Exp",
    rating: "4.9",
    hospital: "Srinivasa Medical Centre, Mangaluru",
    city: "Mangaluru, KA",
    fee: "₹400",
    available: "Available Today",
    image: "👨‍⚕️",
    photoUrl: "/doctor_male1.jpg",
    patientsCount: "2.7K+ Patients",
    isOnline: true,
    ailments: ["skin rash", "itching", "allergy", "acne", "eczema", "hives", "dermatitis"]
  }
];

export const DoctorAppointments: React.FC = () => {
  const { user } = useApp();
  const [doctors, setDoctors] = useState<(Doctor & { ailments?: string[]; city?: string })[]>(DATABASE_DOCTORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Real-time Location State (Default Bengaluru for exact city match)
  const [selectedLocation, setSelectedLocation] = useState('Bengaluru, KA');
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  // Tab State: 'browse' or 'my_appointments'
  const [activeTab, setActiveTab] = useState<'browse' | 'my_appointments'>('browse');

  // Booked Appointments State
  const [bookedAppointments, setBookedAppointments] = useState<BookedAppointment[]>([
    {
      id: "SS-APPT-1082",
      doctorId: 1,
      doctorName: "Dr. Priya Sharma",
      specialization: "Cardiologist",
      hospital: "Manipal Hospital, Bengaluru",
      patientName: user?.full_name || "Tejal S",
      phone: "9876543210",
      date: "2026-07-28",
      time: "10:00 AM",
      fee: "₹500",
      status: "Confirmed",
      createdAt: "Today"
    }
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "NOTIF-1",
      title: "Appointment Confirmed ✅",
      message: "Your appointment with Dr. Priya Sharma for 2026-07-28 at 10:00 AM is confirmed.",
      timestamp: "10 mins ago",
      type: "booking",
      read: false
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Carousel Slide State
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Booking Modal State
  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null);
  const [patientName, setPatientName] = useState(user?.full_name || 'Tejal S');
  const [phone, setPhone] = useState('9876543210');
  const [date, setDate] = useState('2026-07-28');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM');
  const [slotError, setSlotError] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Fetch Doctors from Backend API
  useEffect(() => {
    appointmentAPI.getDoctors().then((res) => {
      if (res.data && res.data.doctors && res.data.doctors.length > 0) {
        setDoctors(res.data.doctors);
      }
    }).catch(() => {
      setDoctors(DATABASE_DOCTORS);
    });
  }, []);

  // Outside Click listeners
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowLocationMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Carousel Timer
  useEffect(() => {
    if (doctors.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % doctors.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [doctors.length]);

  // REAL-TIME GPS GEOLOCATION HANDLER
  const handleGetLiveLocation = () => {
    setGettingLocation(true);
    setLocationStatus('Accessing GPS...');

    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not supported by browser');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationStatus('Resolving location...');

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(res => res.json())
          .then(data => {
            const address = data.address || {};
            const detectedCity = address.city || address.town || address.village || address.county || address.state_district || 'Bengaluru';
            const formatted = `${detectedCity}, KA`;
            setSelectedLocation(formatted);
            setLocationStatus('');
            setGettingLocation(false);
            setShowLocationMenu(false);

            const locNotif: AppNotification = {
              id: `NOTIF-${Date.now()}`,
              title: "GPS Location Updated 📍",
              message: `Live position detected: ${formatted}`,
              timestamp: "Just now",
              type: "info",
              read: false
            };
            setNotifications(prev => [locNotif, ...prev]);
          })
          .catch(() => {
            setSelectedLocation("Bengaluru, KA");
            setGettingLocation(false);
            setShowLocationMenu(false);
          });
      },
      (error) => {
        console.warn("Geolocation permission error:", error.message);
        setLocationStatus("GPS Permission Denied. Default: Bengaluru, KA");
        setSelectedLocation("Bengaluru, KA");
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const nextSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex + 1) % doctors.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex - 1 + doctors.length) % doctors.length);
  };

  // Slot Selection
  const handleSelectSlot = (slotTime: string, isAvailable: boolean, reason?: string) => {
    setSelectedTimeSlot(slotTime);
    if (!isAvailable) {
      setSlotError(`⚠️ Slot ${slotTime} is NOT available (${reason || 'Booked'}). Please choose another slot.`);
    } else {
      setSlotError('');
    }
  };

  // Handle Confirm Booking
  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;

    const slotObj = TIME_SLOTS.find(s => s.time === selectedTimeSlot);
    if (slotObj && !slotObj.available) {
      setSlotError(`❌ Cannot book ${selectedTimeSlot}. Slot is already taken.`);
      return;
    }

    const newAppt: BookedAppointment = {
      id: `SS-APPT-${Math.floor(1000 + Math.random() * 9000)}`,
      doctorId: selectedDoc.id,
      doctorName: selectedDoc.name,
      specialization: selectedDoc.specialization,
      hospital: selectedDoc.hospital,
      patientName: patientName || user?.full_name || 'Patient',
      phone: phone || '9876543210',
      date: date,
      time: selectedTimeSlot,
      fee: selectedDoc.fee,
      status: 'Confirmed',
      createdAt: 'Just now'
    };

    setBookedAppointments(prev => [newAppt, ...prev]);

    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: "Booking Confirmed ✅",
      message: `Appointment booked with ${selectedDoc.name} (${selectedDoc.specialization}) on ${date} at ${selectedTimeSlot}.`,
      timestamp: "Just now",
      type: "booking",
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Auto-sync appointment booking into Health Records localStorage
    try {
      const existingStr = localStorage.getItem('swasthya_health_records');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const newApptRecord = {
        id: Date.now(),
        title: `Doctor Consultation Booking: ${selectedDoc.name}`,
        type: "Prescription",
        category: "Prescriptions",
        date: date,
        doctor: `${selectedDoc.name} (${selectedDoc.specialization} - ${selectedDoc.hospital})`,
        icon: "👨‍⚕️",
        fileSize: "950 KB",
        summary: `Confirmed Consultation Appointment for ${date} at ${selectedTimeSlot}. Patient: ${patientName || user?.full_name || 'Patient'}. Consultation Fee: ${selectedDoc.fee}.`
      };
      localStorage.setItem('swasthya_health_records', JSON.stringify([newApptRecord, ...existing]));
    } catch (e) {
      console.error(e);
    }

    setBookingConfirmed(true);
  };

  // Cancel Appointment
  const handleCancelAppointment = (apptId: string) => {
    const apptToCancel = bookedAppointments.find(a => a.id === apptId);
    setBookedAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status: 'Cancelled' } : a));

    if (apptToCancel) {
      const cancelNotif: AppNotification = {
        id: `NOTIF-${Date.now()}`,
        title: "Appointment Cancelled ❌",
        message: `Your appointment with ${apptToCancel.doctorName} for ${apptToCancel.date} has been cancelled.`,
        timestamp: "Just now",
        type: "cancellation",
        read: false
      };
      setNotifications(prev => [cancelNotif, ...prev]);
    }
  };

  // Filter Ailment Suggestions Dropdown
  const matchedAilments = AILMENTS_SUGGESTIONS.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return item.label.toLowerCase().includes(q) || item.query.includes(q) || item.category.toLowerCase().includes(q);
  });

  // STRICT FILTERING: Matches BOTH Selected City AND Search Query!
  const cityFilteredDoctors = doctors.filter(doc => {
    // 1. City Strict Match (unless 'All Karnataka' selected)
    if (selectedLocation !== 'All Karnataka') {
      const selectedCityClean = selectedLocation.split(',')[0].trim().toLowerCase();
      const docCityClean = (doc.city || doc.hospital || '').toLowerCase();
      if (!docCityClean.includes(selectedCityClean)) {
        return false;
      }
    }

    // 2. Search Query Match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = doc.name.toLowerCase().includes(q);
      const specMatch = doc.specialization.toLowerCase().includes(q);
      const hospMatch = doc.hospital.toLowerCase().includes(q);
      const ailmentMatch = doc.ailments ? doc.ailments.some(a => a.includes(q)) : false;
      return nameMatch || specMatch || hospMatch || ailmentMatch;
    }

    return true;
  });

  // If no doctors match the city strictly, fallback to all doctors for that ailment with notice
  const finalDoctorsList = cityFilteredDoctors.length > 0 ? cityFilteredDoctors : doctors.filter(doc => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return doc.name.toLowerCase().includes(q) || doc.specialization.toLowerCase().includes(q) || (doc.ailments && doc.ailments.some(a => a.includes(q)));
  });

  // Displays 3 cards by default; when searching, displays ALL matching doctor cards!
  const displayedDoctors = searchQuery.trim() ? finalDoctorsList : finalDoctorsList.slice(0, 3);

  const featuredDoc = finalDoctorsList[carouselIndex % finalDoctorsList.length] || DATABASE_DOCTORS[0];
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* Top Header & User Profile Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Find Your Specialist Doctor</h1>
          <p className="text-xs text-slate-400 mt-1">
            Showing doctors practicing in <strong className="text-cyan-400 font-bold">{selectedLocation}</strong>.
          </p>
        </div>

        {/* Top Right User Info & Bell */}
        <div className="flex items-center gap-3 relative">
          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
              }}
              className="w-10 h-10 rounded-2xl bg-[#111927] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white font-black text-[10px] rounded-full flex items-center justify-center border-2 border-[#0c1322]">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#111927] border border-slate-800 rounded-3xl p-4 shadow-2xl z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    🔔 Notifications ({notifications.length})
                  </h4>
                  <button onClick={() => setShowNotifications(false)} className="text-[10px] text-slate-400 hover:text-white font-bold">
                    Close
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-2xl border text-xs space-y-1 ${
                        n.type === 'booking'
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                          : n.type === 'cancellation'
                          ? 'bg-red-950/30 border-red-500/30 text-red-300'
                          : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300'
                      }`}
                    >
                      <div className="font-extrabold flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] opacity-70">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] opacity-90 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 bg-[#111927] border border-slate-800 px-3.5 py-1.5 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-black text-xs">
              {user?.full_name.charAt(0) || 'T'}
            </div>
            <span className="text-xs font-extrabold text-slate-200">{user?.full_name || 'Tejal S.'}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800/80 gap-6">
        <button
          onClick={() => setActiveTab('browse')}
          className={`pb-3 text-xs font-extrabold flex items-center gap-2 transition-all relative ${
            activeTab === 'browse' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" /> Browse Doctors ({finalDoctorsList.length})
        </button>
        <button
          onClick={() => setActiveTab('my_appointments')}
          className={`pb-3 text-xs font-extrabold flex items-center gap-2 transition-all relative ${
            activeTab === 'my_appointments' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" /> My Booked Appointments ({bookedAppointments.length})
          {bookedAppointments.some(a => a.status === 'Confirmed') && (
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
              Active
            </span>
          )}
        </button>
      </div>

      {activeTab === 'browse' && (
        <>
          {/* SEARCH BAR WITH REAL-TIME KARNATAKA LOCATION DROPDOWN */}
          <div className="flex flex-wrap items-center gap-3 relative">
            <div className="flex-1 min-w-[280px] relative" ref={dropdownRef}>
              <Search className="w-4 h-4 text-cyan-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                placeholder={`Search ailment in ${selectedLocation} (e.g. chest pain, headache, acidity, rash)...`}
                className="w-full bg-[#111927] border border-slate-800 rounded-2xl pl-11 pr-24 py-3 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-24 top-3 text-xs text-slate-400 hover:text-white font-bold"
                >
                  Clear
                </button>
              )}
              <button className="absolute right-2 top-1.5 bottom-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs px-4 rounded-xl shadow-md transition-all">
                Search
              </button>

              {/* LIVE SEARCH DROPDOWN */}
              {showDropdown && matchedAilments.length > 0 && (
                <div className="absolute left-0 right-0 top-14 bg-[#111927] border border-cyan-500/40 rounded-2xl p-2 shadow-2xl z-40 space-y-1 max-h-64 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" /> Ailments & Symptoms ({matchedAilments.length})
                  </div>
                  {matchedAilments.map((item) => (
                    <button
                      key={item.query}
                      onClick={() => {
                        setSearchQuery(item.query);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800/80 flex items-center justify-between text-xs transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{item.icon}</span>
                        <span className="font-bold text-white group-hover:text-cyan-400">{item.label}</span>
                      </div>
                      <span className="text-[10px] bg-slate-900 border border-slate-800 text-cyan-300 font-extrabold px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* REAL-TIME LOCATION SELECTOR DROPDOWN */}
            <div className="relative" ref={locationRef}>
              <button
                onClick={() => setShowLocationMenu(!showLocationMenu)}
                className="flex items-center gap-2 bg-[#111927] border border-cyan-500/40 hover:border-cyan-400 px-4 py-3 rounded-2xl text-xs font-bold text-cyan-300 transition-all shadow-md"
              >
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate max-w-[140px] font-extrabold">{selectedLocation}</span>
                <ChevronDown className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />
              </button>

              {/* KARNATAKA CITIES DROPDOWN MENU */}
              {showLocationMenu && (
                <div className="absolute right-0 top-14 w-64 bg-[#111927] border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 space-y-2">
                  <button
                    onClick={handleGetLiveLocation}
                    disabled={gettingLocation}
                    className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    {gettingLocation ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                        <span>Detecting GPS...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                        <span>📍 Use Current Location (GPS)</span>
                      </>
                    )}
                  </button>

                  {locationStatus && (
                    <div className="text-[10px] text-amber-400 font-bold text-center px-2">
                      {locationStatus}
                    </div>
                  )}

                  <div className="px-2 pt-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Select Karnataka City
                  </div>

                  <div className="space-y-0.5 max-h-52 overflow-y-auto">
                    {KARNATAKA_CITIES.map((cityName) => (
                      <button
                        key={cityName}
                        onClick={() => {
                          setSelectedLocation(cityName);
                          setShowLocationMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                          selectedLocation === cityName
                            ? 'bg-cyan-500 text-slate-950'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span>📍 {cityName}</span>
                        {selectedLocation === cityName && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ANIMATED SLIDING DOCTOR CAROUSEL BANNER */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#062c33] via-[#093a40] to-[#0d1c29] border border-cyan-500/30 p-6 md:p-8 shadow-2xl transition-all duration-700">
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/60 text-white hover:bg-cyan-500 hover:text-slate-950 flex items-center justify-center backdrop-blur-md transition-all z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/60 text-white hover:bg-cyan-500 hover:text-slate-950 flex items-center justify-center backdrop-blur-md transition-all z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500">
              <div className="space-y-3 max-w-xl z-10">
                <div className="flex items-center gap-3">
                  <span className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                    Featured Doctor ({featuredDoc.city || selectedLocation})
                  </span>
                  <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1">
                    {featuredDoc.rating} <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-white">{featuredDoc.name}</h2>
                <p className="text-xs font-bold text-cyan-400">{featuredDoc.specialization} • {featuredDoc.hospital}</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {featuredDoc.experience} • {featuredDoc.patientsCount || '3,000+ Patients'} • Consultation Fee: {featuredDoc.fee}
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setBookingConfirmed(false);
                      setSlotError('');
                      setSelectedDoc(featuredDoc);
                    }}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-full shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
                  >
                    Book Appointment with {featuredDoc.name.split(' ')[1]}
                  </button>
                </div>
              </div>

              <div className="relative shrink-0 z-10">
                <div className="w-44 h-44 rounded-3xl overflow-hidden border-2 border-cyan-400/40 shadow-2xl">
                  <img
                    src={featuredDoc.photoUrl || '/featured_doctor.jpg'}
                    alt={featuredDoc.name}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 pt-4 z-20 relative">
              {finalDoctorsList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === (carouselIndex % finalDoctorsList.length) ? 'bg-cyan-400 w-6' : 'bg-slate-700 w-2 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CITY SPECIFIC DOCTORS GRID */}
          <div>
            {cityFilteredDoctors.length === 0 && selectedLocation !== 'All Karnataka' && (
              <div className="mb-4 bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl text-xs font-bold text-amber-300 flex items-center justify-between">
                <span>📍 Showing top Karnataka specialists nearby for {selectedLocation}</span>
                <button onClick={() => setSelectedLocation('All Karnataka')} className="underline hover:text-white">
                  View All Karnataka
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {displayedDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-[#111927] border border-slate-800/80 rounded-3xl p-5 shadow-xl hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-700 shrink-0">
                        <img src={doc.photoUrl || '/doctor_male1.jpg'} alt={doc.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-white group-hover:text-cyan-400 transition-colors">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-cyan-400 font-bold">{doc.specialization}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[180px]">📍 {doc.hospital}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="flex items-center gap-1 font-bold text-slate-200">
                        <span>{doc.rating}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </div>
                      <div className="text-base font-black text-cyan-400">{doc.fee}</div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        ● {doc.available}
                      </span>
                      <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {doc.experience}
                      </span>
                      <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        📍 {doc.city || 'Karnataka'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-5">
                    <button
                      onClick={() => {
                        setBookingConfirmed(false);
                        setSlotError('');
                        setSelectedDoc(doc);
                      }}
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs py-2.5 rounded-full shadow-md transition-all hover:shadow-cyan-500/20"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* MY BOOKED APPOINTMENTS TAB */}
      {activeTab === 'my_appointments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">Your Booked Consultations</h3>
            <span className="text-xs text-slate-400">Total Bookings: {bookedAppointments.length}</span>
          </div>

          {bookedAppointments.length > 0 ? (
            <div className="space-y-3">
              {bookedAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className={`bg-[#111927] border rounded-3xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4 ${
                    appt.status === 'Confirmed' ? 'border-emerald-500/30' : 'border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-xl shrink-0">
                      👨‍⚕️
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-white">{appt.doctorName}</h4>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          appt.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-xs text-cyan-400 font-bold mt-0.5">{appt.specialization} • {appt.hospital}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                        <span>📅 Date: <strong>{appt.date}</strong></span>
                        <span>⏰ Time: <strong>{appt.time}</strong></span>
                        <span>💳 Fee: <strong>{appt.fee}</strong></span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {appt.status === 'Confirmed' && (
                      <button
                        onClick={() => handleCancelAppointment(appt.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#111927] border border-slate-800 rounded-3xl p-8 text-center space-y-3">
              <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
              <h4 className="text-base font-extrabold text-white">No Booked Appointments Yet</h4>
              <p className="text-xs text-slate-400">Browse doctors and book your first consultation!</p>
            </div>
          )}
        </div>
      )}

      {/* BOOKING MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#111927] border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            {bookingConfirmed ? (
              <div className="text-center space-y-3 py-6">
                <CheckCircle className="w-12 h-12 text-cyan-400 mx-auto" />
                <h3 className="text-lg font-extrabold text-white">Appointment Booked & Confirmed!</h3>
                <p className="text-xs text-slate-300">
                  Your appointment with <strong>{selectedDoc.name}</strong> ({selectedDoc.specialization}) is confirmed for <strong>{date} at {selectedTimeSlot}</strong>.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedDoc(null);
                      setBookingConfirmed(false);
                      setActiveTab('my_appointments');
                    }}
                    className="bg-cyan-500 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-full shadow-md"
                  >
                    View My Booked Appointments
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700">
                    <img src={selectedDoc.photoUrl || '/doctor_male1.jpg'} alt={selectedDoc.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">{selectedDoc.name}</h3>
                    <p className="text-xs text-cyan-400 font-bold">{selectedDoc.specialization} • {selectedDoc.hospital}</p>
                  </div>
                </div>

                <form onSubmit={handleBookSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Patient Name</label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Appointment Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Slot Selection Grid */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                      <span>Select Available Time Slot</span>
                      <span className="text-[10px] text-cyan-400 font-bold">Real-time Check</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((s) => (
                        <button
                          key={s.time}
                          type="button"
                          onClick={() => handleSelectSlot(s.time, s.available, s.reason)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold text-center border transition-all ${
                            selectedTimeSlot === s.time
                              ? s.available
                                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                                : 'bg-red-500/20 text-red-300 border-red-500'
                              : s.available
                              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                              : 'bg-slate-950/60 border-slate-800/40 text-slate-600 cursor-not-allowed line-through'
                          }`}
                        >
                          {s.time} {!s.available && '❌'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slot Validation Alert */}
                  {slotError ? (
                    <div className="bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl text-[11px] font-bold text-red-300 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{slotError}</span>
                    </div>
                  ) : (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-xl text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Slot {selectedTimeSlot} is available for instant confirmation.</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDoc(null)}
                      className="flex-1 bg-slate-800 text-slate-300 font-bold text-xs py-2.5 rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!!slotError}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs py-2.5 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Booking ({selectedDoc.fee})
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
