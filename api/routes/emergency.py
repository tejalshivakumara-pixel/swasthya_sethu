from fastapi import APIRouter

router = APIRouter()

EMERGENCY_CONTACTS = [
    {"name": "National Emergency Helpline", "number": "112", "type": "Toll Free", "icon": "🚨"},
    {"name": "Medical Ambulance Service", "number": "108", "type": "Ambulance", "icon": "🚑"},
    {"name": "Health Helpline (Telemedicine)", "number": "104", "type": "Government", "icon": "📞"},
    {"name": "Primary Health Center Emergency", "number": "+91 80 2345 6789", "type": "Hospital", "icon": "🏥"}
]

NEARBY_HOSPITALS = [
    {"name": "District General Hospital", "distance": "2.4 km away", "phone": "080-2223344", "status": "24/7 Open", "icubeds": 12},
    {"name": "Mandya Community Health Center", "distance": "5.1 km away", "phone": "080-3334455", "status": "24/7 Open", "icubeds": 6},
    {"name": "Apollo Emergency Clinic", "distance": "8.7 km away", "phone": "080-4445566", "status": "24/7 Open", "icubeds": 18}
]


@router.get("/contacts")
def get_emergency_contacts():
    return {
        "success": True,
        "contacts": EMERGENCY_CONTACTS,
        "hospitals": NEARBY_HOSPITALS
    }
