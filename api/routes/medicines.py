from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

MOCK_MEDICINES = [
    {
        "id": 1,
        "name": "Paracetamol 500mg",
        "dosage": "1 tablet after meals",
        "time": "08:00 AM",
        "frequency": "Twice daily",
        "taken": True,
        "icon": "💊"
    },
    {
        "id": 2,
        "name": "Pantoprazole 40mg",
        "dosage": "1 capsule before breakfast",
        "time": "07:30 AM",
        "frequency": "Once daily (Morning)",
        "taken": True,
        "icon": "💊"
    },
    {
        "id": 3,
        "name": "Cetirizine 10mg",
        "dosage": "1 tablet at bedtime",
        "time": "09:30 PM",
        "frequency": "Once daily (Night)",
        "taken": False,
        "icon": "🌙"
    },
    {
        "id": 4,
        "name": "Melatonin 3mg",
        "dosage": "1 tablet 30 mins before sleep",
        "time": "10:00 PM",
        "frequency": "As needed for sleep",
        "taken": False,
        "icon": "💤"
    }
]


class MedicineRequest(BaseModel):
    name: str
    dosage: str
    time: str
    frequency: str


@router.get("/")
def get_medicines():
    return {"success": True, "medicines": MOCK_MEDICINES}


@router.post("/add")
def add_medicine(med: MedicineRequest):
    new_med = {
        "id": len(MOCK_MEDICINES) + 1,
        "name": med.name,
        "dosage": med.dosage,
        "time": med.time,
        "frequency": med.frequency,
        "taken": False,
        "icon": "💊"
    }
    MOCK_MEDICINES.append(new_med)
    return {"success": True, "message": "Medication reminder added successfully", "medicine": new_med}
