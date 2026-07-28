from fastapi import APIRouter
from pydantic import BaseModel
import os
import json
from google import genai
from database.database_manager import DatabaseManager

router = APIRouter()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None


class SymptomCheckRequest(BaseModel):
    user_id: int = None
    age: int = 25
    gender: str = "Male"
    symptoms: str
    duration: str = "3 days"
    severity: str = "Moderate"
    history: str = "None"
    medications: str = "None"
    allergies: str = "None"


@router.post("/analyze")
def analyze_symptoms(req: SymptomCheckRequest):
    prompt = f"""
    System: You are an expert AI clinical health consultant. Analyze the patient's symptoms with high medical precision and provide an accurate diagnostic prescription and triage report.
    Patient Information:
    - Age: {req.age}
    - Gender: {req.gender}
    - Reported Symptoms: {req.symptoms}
    - Symptom Duration: {req.duration}
    - Severity Level: {req.severity}
    - Medical History: {req.history}
    - Current Medications: {req.medications}
    - Known Allergies: {req.allergies}

    Return a valid JSON object ONLY with the following exact keys:
    "possible_disease": (string: accurate, highly specific probable diagnosis name e.g. "Acute Myocardial Infarction", "Tension Headache", "Gastroesophageal Reflux Disease"),
    "urgency": (string: e.g. "Low", "Moderate", "High", or "CRITICAL EMERGENCY - IMMEDIATE HOSPITALIZATION REQUIRED"),
    "reason": (string: detailed clinical rationale explaining pathophysiology and symptom correlation),
    "recommended_specialist": (string: e.g. "Interventional Cardiologist", "Neurologist", "Gastroenterologist", "Pulmonologist"),
    "medicines": (string: specific recommended medications with exact dosage and administration guidelines),
    "tests_required": (string: relevant diagnostic tests, ECG, blood work, or imaging),
    "self_care": (string: specific actionable self-care, lifestyle, and dietary advice),
    "emergency_warning": (string: red-flag emergency warnings or immediate action steps).
    """

    result = None

    if client:
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            text = response.text.strip()
            if text.startswith("```"):
                text = text.strip("`")
                if text.lower().startswith("json"):
                    text = text[4:]
            result = json.loads(text)
        except Exception:
            pass

    if not result:
        sym_lower = (req.symptoms or "").lower()

        # Cardiovascular Emergency
        if any(w in sym_lower for w in ["chest pain", "shortness of breath", "radiating pain", "diaphoresis", "sweating", "arm pain", "jaw pain", "heart attack", "angina"]):
            result = {
                "possible_disease": "Acute Myocardial Infarction (Heart Attack) / Acute Coronary Syndrome",
                "urgency": "CRITICAL EMERGENCY - IMMEDIATE HOSPITALIZATION REQUIRED",
                "reason": "Acute coronary artery occlusion causing myocardial ischemia. Classic presentation of retrosternal chest pain, dyspnea, diaphoresis, and radiation to arm/jaw.",
                "recommended_specialist": "Interventional Cardiologist / Emergency Medical Specialist",
                "medicines": "EMERGENCY PROTOCOL (Under Doctor Supervision): Aspirin 325mg (chewed) + Clopidogrel 300mg + Nitroglycerin sublingual.",
                "tests_required": "12-Lead ECG, High-Sensitivity Cardiac Troponin I/T, Echocardiogram, Emergency Coronary Angiography.",
                "self_care": "DO NOT EXERT. Sit down, keep calm, chew Aspirin 325mg if available, and call 108 / 112 immediately for emergency ambulance dispatch.",
                "emergency_warning": "🚨 LIFE THREATENING EMERGENCY! Call 108 / 112 or go to the nearest Cardiac ER immediately. Do not drive yourself."
            }
        # Neurological Emergency (Stroke)
        elif any(w in sym_lower for w in ["slurred speech", "face drooping", "arm weakness", "numbness", "stroke", "paralysis"]):
            result = {
                "possible_disease": "Acute Ischemic Stroke / Cerebrovascular Accident (CVA)",
                "urgency": "CRITICAL EMERGENCY - BRAIN ATTACK PROTOCOL",
                "reason": "Sudden focal neurological deficit caused by cerebral artery thrombosis or hemorrhage (FAST protocol positive).",
                "recommended_specialist": "Neurologist / Stroke Emergency Team",
                "medicines": "Requires Immediate Hospital Assessment for Thrombolytic Therapy (tPA within 4.5 hours window).",
                "tests_required": "Non-Contrast CT Brain, MRI Brain Diffusion, Carotid Doppler, ECG.",
                "self_care": "Note the exact time symptoms started. Keep patient lying down with head slightly elevated.",
                "emergency_warning": "🚨 CRITICAL STROKE EMERGENCY! Call 108 / 112 immediately. Time lost is brain lost."
            }
        # Respiratory Emergency
        elif any(w in sym_lower for w in ["wheezing", "breathlessness", "coughing blood", "suffocation"]):
            result = {
                "possible_disease": "Acute Bronchial Asthma Exacerbation / Pneumonia",
                "urgency": "HIGH URGENCY (Immediate Medical Care Needed)",
                "reason": "Airway hyper-responsiveness, bronchospasm, or alveolar consolidation compromising respiratory gas exchange.",
                "recommended_specialist": "Pulmonologist / Critical Care Specialist",
                "medicines": "Levosalbutamol + Ipratropium Nebulization + Budesonide inhaler.",
                "tests_required": "Pulse Oximetry (SpO2), Chest X-Ray (PA View), Arterial Blood Gas (ABG), CBC.",
                "self_care": "Sit upright. Use rescue inhaler (Salbutamol 2 puffs via spacer every 20 mins). Stay calm.",
                "emergency_warning": "Go to ER immediately if oxygen saturation drops below 92% or severe gasping occurs."
            }
        # Insomnia
        elif any(w in sym_lower for w in ["insomnia", "sleep", "sleepless", "can't sleep", "wake up"]):
            result = {
                "possible_disease": "Insomnia / Circadian Sleep Rhythm Disorder",
                "urgency": "Low (Self-Care & Sleep Hygiene)",
                "reason": "Difficulty falling or staying asleep resulting from elevated stress, altered circadian rhythm, or cortisol dysfunction.",
                "recommended_specialist": "Somnologist (Sleep Specialist) / Neurologist",
                "medicines": "Melatonin 3mg (1 tablet 30 mins before bedtime for 5 days) + Magnesium Glycinate 200mg.",
                "tests_required": "Polysomnography (Sleep Study), Thyroid Profile (TSH), Vitamin D3 & B12.",
                "self_care": "Maintain strict sleep hours. Avoid screens 1 hour before bedtime. Avoid caffeine after 4:00 PM.",
                "emergency_warning": "Seek medical care if severe sleep deprivation causes extreme daytime confusion or hallucinations."
            }
        # Acidity / Gastritis
        elif any(w in sym_lower for w in ["stomach", "acidity", "gas", "nausea", "acid reflux", "heartburn"]):
            result = {
                "possible_disease": "Gastroesophageal Reflux Disease (GERD) / Acid Peptic Disease",
                "urgency": "Low to Moderate",
                "reason": "Gastric mucosa irritation caused by excess stomach acid or irregular meal timings.",
                "recommended_specialist": "Gastroenterologist / General Physician",
                "medicines": "Pantoprazole 40mg (1 capsule 30 mins before breakfast) + Syrup Digene 10ml after meals.",
                "tests_required": "Endoscopy (if persistent), H. pylori Stool Antigen test.",
                "self_care": "Eat smaller, frequent meals. Avoid spicy food. Do not lie down within 2 hours after meals.",
                "emergency_warning": "Go to emergency if experiencing black tarry stools or blood in vomit."
            }
        # Headache / Migraine
        elif any(w in sym_lower for w in ["headache", "migraine", "head pain", "throbbing"]):
            result = {
                "possible_disease": "Tension Headache / Vascular Migraine",
                "urgency": "Low to Moderate",
                "reason": "Neurovascular inflammation, muscle contraction in neck/head, or stress.",
                "recommended_specialist": "Neurologist / General Physician",
                "medicines": "Naproxen 250mg or Paracetamol 650mg after food.",
                "tests_required": "Blood Pressure Monitoring, Ophthalmic Vision Test.",
                "self_care": "Rest in a quiet, dark room. Apply cool compress to forehead. Stay hydrated.",
                "emergency_warning": "Seek immediate help if accompanied by sudden neck stiffness or high fever."
            }
        else:
            result = {
                "possible_disease": f"Systemic Medical Evaluation Required: {req.symptoms.capitalize()}",
                "urgency": "Moderate",
                "reason": f"Symptom complex reported: {req.symptoms} lasting {req.duration}.",
                "recommended_specialist": "General Physician / Internal Medicine",
                "medicines": "Paracetamol 500mg (as needed for pain/fever) + Hydration Electrolytes",
                "tests_required": "Complete Blood Count (CBC), Routine Health Panel",
                "self_care": "Rest adequately, drink 2-3L water daily, and monitor symptom progression.",
                "emergency_warning": "Seek immediate emergency care if symptoms rapidly escalate or chest pain occurs."
            }

    if req.user_id:
        try:
            DatabaseManager.save_symptom_history(
                req.user_id,
                req.symptoms,
                json.dumps(result),
                result.get("possible_disease", ""),
            )
        except Exception:
            pass

    return {
        "success": True,
        "result": result
    }
