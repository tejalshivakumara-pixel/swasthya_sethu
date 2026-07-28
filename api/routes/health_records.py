from fastapi import APIRouter

router = APIRouter()

MOCK_RECORDS = [
    {
        "id": 1,
        "title": "Complete Blood Count (CBC) Report",
        "date": "2026-07-20",
        "doctor": "Dr. Rajesh Sharma",
        "type": "Lab Test",
        "summary": "Hemoglobin: 14.2 g/dL, WBC: 7,500/mcL. All parameters normal.",
        "icon": "🩸"
    },
    {
        "id": 2,
        "title": "AI Symptom Triage & Prescription",
        "date": "2026-07-25",
        "doctor": "Swasthya Setu AI Assistant",
        "type": "Digital Rx",
        "summary": "Diagnosis: Acute Viral Cold. Prescribed Paracetamol 500mg and Cetirizine 10mg.",
        "icon": "📋"
    },
    {
        "id": 3,
        "title": "Thyroid Profile (TSH, T3, T4)",
        "date": "2026-06-15",
        "doctor": "Dr. Priya Venkatesh",
        "type": "Lab Test",
        "summary": "TSH: 2.1 mIU/L (Normal). Thyroid function is healthy.",
        "icon": "🩺"
    }
]


@router.get("/")
def get_health_records():
    return {"success": True, "records": MOCK_RECORDS}
