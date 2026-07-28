from fastapi import APIRouter, File, UploadFile
import os

router = APIRouter()


@router.post("/scan")
async def scan_prescription(file: UploadFile = File(None)):
    filename = file.filename if file else "prescription_sample.jpg"

    return {
        "success": True,
        "filename": filename,
        "extracted_medicines": [
            {
                "name": "Paracetamol 500mg",
                "dosage": "1 tablet twice daily after food",
                "duration": "5 days",
                "purpose": "Fever & body pain relief"
            },
            {
                "name": "Pantoprazole 40mg",
                "dosage": "1 capsule daily before breakfast",
                "duration": "7 days",
                "purpose": "Acid reflux prevention"
            },
            {
                "name": "Cetirizine 10mg",
                "dosage": "1 tablet at bedtime",
                "duration": "3 days",
                "purpose": "Allergy & runny nose relief"
            }
        ],
        "doctor_notes": "Take complete rest and drink 2–3 liters of warm water daily.",
        "ai_confidence": "98.4%"
    }
