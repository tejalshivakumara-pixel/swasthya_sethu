from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

DOCTORS_DATABASE = [
    # CARDIOLOGY (Chest pain, Heart Attack, Angina, Hypertension)
    {
        "id": 1,
        "name": "Dr. Priya Sharma",
        "specialization": "Cardiologist",
        "experience": "15+ Years Exp",
        "rating": "4.9",
        "hospital": "Manipal Hospital, Bengaluru",
        "fee": "₹500",
        "available": "Available Today",
        "image": "👩‍⚕️",
        "photoUrl": "/doctor_female2.jpg",
        "patientsCount": "4.2K+ Patients",
        "description": "Senior cardiologist expert in hypertension, heart failure, and coronary artery disease.",
        "isOnline": True,
        "ailments": ["chest pain", "shortness of breath", "heart attack", "angina", "hypertension", "palpitations"]
    },
    {
        "id": 2,
        "name": "Dr. Sanjay Gupta",
        "specialization": "Cardiologist",
        "experience": "18+ Years Exp",
        "rating": "5.0",
        "hospital": "KLE Dr. Prabhakar Kore Hospital",
        "fee": "₹650",
        "available": "Available Today",
        "image": "👨‍⚕️",
        "photoUrl": "/doctor_male1.jpg",
        "patientsCount": "5.5K+ Patients",
        "description": "Interventional cardiologist with deep expertise in echocardiography and angioplasty.",
        "isOnline": True,
        "ailments": ["chest pain", "heart attack", "cardiac arrhythmia", "chest tightness", "angina"]
    },
    {
        "id": 3,
        "name": "Dr. Vinay Kulkarni",
        "specialization": "Cardiologist",
        "experience": "16+ Years Exp",
        "rating": "4.9",
        "hospital": "Sri Jayadeva Institute of Cardiovascular Sciences",
        "fee": "₹500",
        "available": "Available Today",
        "image": "👨‍⚕️",
        "photoUrl": "/doctor_male1.jpg",
        "patientsCount": "5.1K+ Patients",
        "description": "Chief cardiac specialist in valve disorders and preventative cardiology.",
        "isOnline": True,
        "ailments": ["chest pain", "shortness of breath", "high blood pressure", "heart attack"]
    },

    # NEUROLOGY (Migraine, Headache, Insomnia, Stroke, Dizziness)
    {
        "id": 4,
        "name": "Dr. Arjun Reddy",
        "specialization": "Neurologist",
        "experience": "16+ Years Exp",
        "rating": "5.0",
        "hospital": "Manipal General Hospital",
        "fee": "₹600",
        "available": "Available Tomorrow",
        "image": "👨‍⚕️",
        "photoUrl": "/doctor_male1.jpg",
        "patientsCount": "4.9K+ Patients",
        "description": "Renowned neurologist specializing in stroke prevention, epilepsy, and migraine treatment.",
        "isOnline": True,
        "ailments": ["migraine", "headache", "insomnia", "stroke", "slurred speech", "numbness"]
    },
    {
        "id": 5,
        "name": "Dr. Rahul Singh",
        "specialization": "Neurologist",
        "experience": "14+ Years Exp",
        "rating": "4.8",
        "hospital": "KLE Hospital, Gadag",
        "fee": "₹500",
        "available": "Available Today",
        "image": "👨‍⚕️",
        "photoUrl": "/doctor_male1.jpg",
        "patientsCount": "3.6K+ Patients",
        "description": "Expert in movement disorders, neuropathy, severe migraines, and headache management.",
        "isOnline": True,
        "ailments": ["migraine", "headache", "head pain", "dizziness", "nerve pain"]
    },
    {
        "id": 6,
        "name": "Dr. Asha Menon",
        "specialization": "Neurologist",
        "experience": "17+ Years Exp",
        "rating": "4.9",
        "hospital": "NIMHANS, Bengaluru",
        "fee": "₹550",
        "available": "Available Tomorrow",
        "image": "👩‍⚕️",
        "photoUrl": "/doctor_female2.jpg",
        "patientsCount": "4.5K+ Patients",
        "description": "Specialist in neuro-degenerative diseases, severe chronic insomnia, and cognitive health.",
        "isOnline": True,
        "ailments": ["migraine", "headache", "insomnia", "sleeplessness", "stroke"]
    },

    # GASTROENTEROLOGY (Acidity, GERD, Gas, Stomach Ache, Loose Motion)
    {
        "id": 7,
        "name": "Dr. Ananya Rao",
        "specialization": "Gastroenterologist",
        "experience": "12+ Years Exp",
        "rating": "4.9",
        "hospital": "Fortis Hospital, Bannerghatta",
        "fee": "₹400",
        "available": "Available Today",
        "image": "👩‍⚕️",
        "photoUrl": "/doctor_female2.jpg",
        "patientsCount": "3.3K+ Patients",
        "description": "Gastroenterology expert treating GERD, acidity, stomach ulcers, and digestive health.",
        "isOnline": True,
        "ailments": ["acidity", "gas", "heartburn", "stomach ache", "loose motion", "gerd", "bloating"]
    },
    {
        "id": 8,
        "name": "Dr. Subhash Patil",
        "specialization": "Gastroenterologist",
        "experience": "15+ Years Exp",
        "rating": "4.8",
        "hospital": "Apollo Hospital, Bengaluru",
        "fee": "₹450",
        "available": "Available Today",
        "image": "👨‍⚕️",
        "photoUrl": "/doctor_male1.jpg",
        "patientsCount": "3.9K+ Patients",
        "description": "Consultant gastroenterologist specializing in chronic acidity, IBS, and endoscopies.",
        "isOnline": True,
        "ailments": ["acidity", "gas", "stomach pain", "heartburn", "acid reflux", "gastritis"]
    },

    # GENERAL MEDICINE (Fever, Cold, Infection, Diabetes, Checkup)
    {
        "id": 9,
        "name": "Dr. Anita Rao",
        "specialization": "General Physician",
        "experience": "12+ Years Exp",
        "rating": "4.8",
        "hospital": "District Government Hospital, Gadag",
        "fee": "₹200",
        "available": "Available Today",
        "image": "👩‍⚕️",
        "photoUrl": "/featured_doctor.jpg",
        "patientsCount": "3.8K+ Patients",
        "description": "Specialist in general internal medicine, fever diagnostics, and preventive checkups.",
        "isOnline": True,
        "ailments": ["fever", "cold", "flu", "cough", "infection", "headache", "body pain"]
    },
    {
        "id": 10,
        "name": "Dr. Vivek Jain",
        "specialization": "General Physician",
        "experience": "14+ Years Exp",
        "rating": "4.8",
        "hospital": "Srinivasa Medical Centre",
        "fee": "₹250",
        "available": "Available Today",
        "image": "👨‍⚕️",
        "photoUrl": "/doctor_male1.jpg",
        "patientsCount": "3.1K+ Patients",
        "description": "Primary healthcare practitioner specializing in metabolic health and fever management.",
        "isOnline": True,
        "ailments": ["fever", "cold", "diabetes", "hypertension", "general checkup"]
    },
    {
        "id": 11,
        "name": "Dr. Harish Patil",
        "specialization": "General Physician",
        "experience": "15+ Years Exp",
        "rating": "4.8",
        "hospital": "City Nursing Home",
        "fee": "₹200",
        "available": "Available Today",
        "image": "👨‍⚕️",
        "photoUrl": "/doctor_male1.jpg",
        "patientsCount": "4.0K+ Patients",
        "description": "Family physician dedicated to comprehensive rural health diagnosis.",
        "isOnline": True,
        "ailments": ["fever", "viral infection", "cold", "fatigue", "weakness"]
    },

    # DERMATOLOGY (Skin Rash, Allergy, Itching, Acne, Eczema)
    {
        "id": 12,
        "name": "Dr. Rohit Bhat",
        "specialization": "Dermatologist",
        "experience": "13+ Years Exp",
        "rating": "4.9",
        "hospital": "Srinivasa Medical Centre",
        "fee": "₹400",
        "available": "Available Today",
        "image": "👨‍⚕️",
        "photoUrl": "/doctor_male1.jpg",
        "patientsCount": "2.7K+ Patients",
        "description": "Specialist in eczema, skin rashes, itching, acne management, and cosmetic dermatology.",
        "isOnline": True,
        "ailments": ["skin rash", "itching", "allergy", "acne", "eczema", "hives", "dermatitis"]
    },
    {
        "id": 13,
        "name": "Dr. Deepa Nair",
        "specialization": "Dermatologist",
        "experience": "11+ Years Exp",
        "rating": "4.8",
        "hospital": "KLE Hospital, Gadag",
        "fee": "₹350",
        "available": "Available Tomorrow",
        "image": "👩‍⚕️",
        "photoUrl": "/doctor_female2.jpg",
        "patientsCount": "2.4K+ Patients",
        "description": "Clinical dermatologist specializing in skin allergies, fungal infections, and psoriasis.",
        "isOnline": True,
        "ailments": ["skin rash", "itching", "allergy", "skin infection", "hives"]
    },

    # ORTHOPEDICS (Joint Pain, Knee Pain, Back Pain, Arthritis)
    {
        "id": 14,
        "name": "Dr. Sneha Rao",
        "specialization": "Orthopedic Surgeon",
        "experience": "11+ Years Exp",
        "rating": "4.7",
        "hospital": "District Government Hospital",
        "fee": "₹350",
        "available": "Available Today",
        "image": "👩‍⚕️",
        "photoUrl": "/featured_doctor.jpg",
        "patientsCount": "2.9K+ Patients",
        "description": "Expert in joint replacement surgery, knee pain relief, and trauma management.",
        "isOnline": False,
        "ailments": ["joint pain", "knee pain", "back pain", "arthritis", "fracture", "muscle pain"]
    },
    {
        "id": 15,
        "name": "Dr. James Wilson",
        "specialization": "Orthopedic Surgeon",
        "experience": "10+ Years Exp",
        "rating": "4.7",
        "hospital": "Fortis Specialty Hospital",
        "fee": "₹600",
        "available": "Available Today",
        "image": "👨‍⚕️",
        "photoUrl": "/doctor_male1.jpg",
        "patientsCount": "3.2K+ Patients",
        "description": "Specialist in joint replacement, sports injury rehabilitation, and spinal care.",
        "isOnline": False,
        "ailments": ["joint pain", "knee pain", "back pain", "arthritis", "ligament tear"]
    },

    # PEDIATRICS (Child Fever, Infant Health, Vaccination)
    {
        "id": 16,
        "name": "Dr. Meera Nair",
        "specialization": "Pediatrician",
        "experience": "10+ Years Exp",
        "rating": "4.9",
        "hospital": "Srinivasa Medical Centre",
        "fee": "₹300",
        "available": "Available Tomorrow",
        "image": "👩‍⚕️",
        "photoUrl": "/doctor_female2.jpg",
        "patientsCount": "3.4K+ Patients",
        "description": "Compassionate pediatrician dedicated to child nutrition and developmental care.",
        "isOnline": True,
        "ailments": ["child fever", "pediatric", "infant allergy", "child cold", "vaccination"]
    },
    {
        "id": 17,
        "name": "Dr. Priya Venkatesh",
        "specialization": "Pediatrician",
        "experience": "10+ Years Exp",
        "rating": "4.8",
        "hospital": "Apollo Rural Teleclinic",
        "fee": "₹300",
        "available": "Available Tomorrow",
        "image": "👩‍⚕️",
        "photoUrl": "/featured_doctor.jpg",
        "patientsCount": "3.1K+ Patients",
        "description": "Child health expert offering remote tele-consultations for rural children.",
        "isOnline": True,
        "ailments": ["child fever", "pediatric", "child infection", "child cough", "vaccination"]
    }
]


class BookingRequest(BaseModel):
    doctor_id: int
    doctor_name: str
    patient_name: str
    phone: str
    date: str
    time: str


@router.get("/doctors")
def get_doctors():
    return {"success": True, "doctors": DOCTORS_DATABASE}


@router.post("/book")
def book_appointment(req: BookingRequest):
    return {
        "success": True,
        "message": f"Appointment booked successfully with {req.doctor_name} for {req.date} at {req.time}!",
        "booking_id": "SS-APPT-8492"
    }
