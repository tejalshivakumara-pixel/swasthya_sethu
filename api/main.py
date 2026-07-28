from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from api.routes import auth, symptom_checker, appointments, medicines, health_records, prescription, emergency

app = FastAPI(
    title="Swasthya Setu Healthcare API",
    description="Backend API powering Swasthya Setu AI Rural Healthcare Platform",
    version="2.0.0"
)

# CORS middleware to allow Vercel frontend and local development origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(symptom_checker.router, prefix="/api/symptom-checker", tags=["Symptom Checker"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["Appointments"])
app.include_router(medicines.router, prefix="/api/medicines", tags=["Medicines"])
app.include_router(health_records.router, prefix="/api/records", tags=["Health Records"])
app.include_router(prescription.router, prefix="/api/prescription", tags=["Prescription Scanner"])
app.include_router(emergency.router, prefix="/api/emergency", tags=["Emergency"])


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Swasthya Setu API",
        "version": "2.0.0",
        "docs": "/docs"
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
