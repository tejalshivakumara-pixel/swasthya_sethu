import streamlit as st
from google import genai
import os
import json
import importlib.util as ilu
from database.database_manager import DatabaseManager

# ── Shared sidebar + theme ──
_spec = ilu.spec_from_file_location("util", os.path.join(os.path.dirname(__file__), "util.py"))
_mod  = ilu.module_from_spec(_spec)
_spec.loader.exec_module(_mod)
_mod.init_session()
_mod.render_sidebar()
_mod.inject_css(st.session_state["theme"])

# ── Gemini API Client ──
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None


def analyze_symptoms_dynamically(symptoms_text, age, gender, duration, severity, history, medications, allergies):
    """
    Analyzes symptoms dynamically using Gemini 2.5 Flash API with fallback to comprehensive medical knowledge engine.
    """
    prompt = f"""
    System: You are an expert AI clinical health consultant. Analyze the patient's symptoms and provide an accurate, medical prescription and triage report.
    Patient Information:
    - Age: {age}
    - Gender: {gender}
    - Reported Symptoms: {symptoms_text}
    - Symptom Duration: {duration}
    - Severity Level: {severity}
    - Medical History: {history}
    - Current Medications: {medications}
    - Known Allergies: {allergies}

    Return a valid JSON object ONLY with the following exact keys:
    "possible_disease": (string: accurate probable diagnosis or condition name),
    "urgency": (string: e.g. "Low", "Moderate", "High", or "Emergency"),
    "reason": (string: detailed clinical rationale explaining the diagnosis),
    "recommended_specialist": (string: e.g. "General Physician", "Neurologist", "Somnologist", "Gastroenterologist", "Dermatologist", etc.),
    "medicines": (string: specific recommended medications with dosage guidelines),
    "tests_required": (string: relevant diagnostic tests or blood work),
    "self_care": (string: specific actionable self-care, lifestyle, and dietary advice),
    "emergency_warning": (string: red-flag symptoms requiring immediate emergency care).
    """

    # 1. Attempt Gemini API if client is available
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
            if "possible_disease" in result and "medicines" in result:
                return result
        except Exception:
            pass

    # 2. Comprehensive Fallback Medical Diagnostic Engine based on symptom keywords
    sym_lower = (symptoms_text or "").lower()

    if any(w in sym_lower for w in ["insomnia", "sleep", "sleepless", "can't sleep", "wake up", "nightmare", "restless"]):
        return {
            "possible_disease": "Primary Insomnia / Circadian Rhythm Sleep Disorder",
            "urgency": "Low to Moderate",
            "reason": f"Reported difficulty falling or staying asleep for {duration}. Disrupted sleep cycles impact cognitive function and daytime energy.",
            "recommended_specialist": "Somnologist (Sleep Specialist) / Psychiatrist",
            "medicines": "Melatonin (3mg to 5mg, 30–60 minutes before bedtime), Chamomile Extract / Magnesium Glycinate (400mg)",
            "tests_required": "Polysomnography (Overnight Sleep Study), Serum Ferritin, Thyroid Profile (TSH)",
            "self_care": "Maintain a strict sleep schedule (same bed and wake times). Eliminate blue light screen exposure 1 hour before sleep. Avoid caffeine after 2 PM.",
            "emergency_warning": "Seek medical care if severe sleep deprivation causes extreme daytime confusion, hallucinations, or depression."
        }

    elif any(w in sym_lower for w in ["stomach", "acidity", "gas", "nausea", "acid reflux", "indigestion", "belly", "cramps", "vomit"]):
        return {
            "possible_disease": "Acute Gastritis / Gastroesophageal Reflux Disease (GERD)",
            "urgency": "Low to Moderate",
            "reason": f"Upper abdominal discomfort and reflux symptoms lasting {duration}. Indicates gastric mucosa irritation or acid hypersecretion.",
            "recommended_specialist": "Gastroenterologist / General Physician",
            "medicines": "Pantoprazole (40mg once daily before breakfast), Antacid Oral Gel (10ml after meals as needed)",
            "tests_required": "Abdominal Ultrasound, H. pylori Stool Antigen Test, Routine CBC",
            "self_care": "Eat smaller, frequent meals. Avoid spicy, oily, acidic foods and carbonated drinks. Do not lie down within 2 hours of eating.",
            "emergency_warning": "Go to the ER immediately if you experience severe abdominal pain, persistent vomiting, or blood in stool."
        }

    elif any(w in sym_lower for w in ["headache", "migraine", "head pain", "throbbing", "temple"]):
        return {
            "possible_disease": "Tension Headache / Acute Migraine Episode",
            "urgency": "Moderate",
            "reason": f"Cephalgia and cranial discomfort reported for {duration}. May stem from muscular tension, stress, or vascular inflammation.",
            "recommended_specialist": "Neurologist / General Physician",
            "medicines": "Ibuprofen (400mg after meals) OR Paracetamol (500mg), Sumatriptan (50mg for acute migraine if prescribed)",
            "tests_required": "Blood Pressure Monitoring, Ophthalmic Eyestrain Check, MRI Brain (if chronic)",
            "self_care": "Rest in a quiet, dark, well-ventilated room. Apply a cold compress to the forehead. Maintain adequate hydration.",
            "emergency_warning": "Seek immediate emergency help if accompanied by sudden neck stiffness, high fever, speech difficulty, or weakness."
        }

    elif any(w in sym_lower for w in ["rash", "itch", "skin", "allergy", "redness", "hives", "eczema", "bumps"]):
        return {
            "possible_disease": "Acute Allergic Dermatitis / Contact Urticaria",
            "urgency": "Low",
            "reason": f"Dermal irritation and localized skin reaction reported for {duration}. Likely triggered by environmental allergens or contact irritants.",
            "recommended_specialist": "Dermatologist / Allergist",
            "medicines": "Cetirizine (10mg once daily at night), Calamine Topical Lotion (apply 2-3x daily to affected areas)",
            "tests_required": "Serum IgE Allergy Panel, Skin Patch Testing",
            "self_care": "Avoid harsh soaps and chemical detergents. Apply cool, damp cloths to soothe itching. Avoid scratching to prevent secondary infection.",
            "emergency_warning": "Seek emergency medical help immediately if skin rash is accompanied by facial swelling, lip swelling, or difficulty breathing."
        }

    elif any(w in sym_lower for w in ["back pain", "joint", "knee", "spine", "arthritis", "muscle ache", "leg pain"]):
        return {
            "possible_disease": "Musculoskeletal Strain / Osteoarthritis / Lumbar Spondylosis",
            "urgency": "Low to Moderate",
            "reason": f"Musculoskeletal pain and localized joint tenderness reported for {duration}. Suggests muscle strain or joint wear.",
            "recommended_specialist": "Orthopedist / Physiotherapist",
            "medicines": "Diclofenac Sodium Gel (topical massage 3x daily), Paracetamol (500mg as needed for pain relief)",
            "tests_required": "X-Ray Joint/Spine (AP & Lateral View), Vitamin D3 & Serum Uric Acid Level",
            "self_care": "Apply warm heat packs for 15 minutes twice daily. Practice gentle stretching exercises and maintain proper ergonomic posture.",
            "emergency_warning": "Consult ER if accompanied by loss of bladder/bowel control, numbness in legs, or inability to bear weight."
        }

    elif any(w in sym_lower for w in ["eye", "vision", "blur", "eye strain", "dry eyes", "red eye", "burning eye"]):
        return {
            "possible_disease": "Computer Vision Syndrome / Dry Eye Disease",
            "urgency": "Low",
            "reason": f"Ocular fatigue and visual dryness reported for {duration}. Associated with prolonged digital screen viewing or environmental dry air.",
            "recommended_specialist": "Ophthalmologist / Optometrist",
            "medicines": "Lubricating Eye Drops (Carboxymethylcellulose 0.5% - 1 drop in each eye 3–4 times daily)",
            "tests_required": "Slit Lamp Ophthalmic Examination, Refraction & Visual Acuity Test",
            "self_care": "Follow the 20-20-20 rule (every 20 minutes, look at an object 20 feet away for 20 seconds). Adjust screen brightness.",
            "emergency_warning": "Seek urgent eye care if experiencing severe eye pain, sudden vision loss, or discharge with light sensitivity."
        }

    elif any(w in sym_lower for w in ["anxiety", "panic", "stress", "heart racing", "nervous", "worry", "fear"]):
        return {
            "possible_disease": "Generalized Anxiety / Acute Stress Reaction",
            "urgency": "Moderate",
            "reason": f"Autonomic nervous system arousal and psychological stress reported for {duration}.",
            "recommended_specialist": "Psychiatrist / Clinical Psychologist",
            "medicines": "Ashwagandha Herbal Extract (500mg daily), Magnesium Supplementation",
            "tests_required": "Thyroid Profile (TSH, Free T4), Electrocardiogram (ECG)",
            "self_care": "Practice diaphragmatic breathing techniques (4-7-8 method). Engage in daily 20-minute outdoor walks and mindfulness meditation.",
            "emergency_warning": "Seek immediate crisis support if experiencing severe panic attacks, chest crushing pain, or thoughts of self-harm."
        }

    elif any(w in sym_lower for w in ["bp", "blood pressure", "dizziness", "hypertension", "lightheaded"]):
        return {
            "possible_disease": "Essential Hypertension / Orthostatic Dizziness",
            "urgency": "Moderate to High",
            "reason": f"Blood pressure fluctuation and dizziness reported for {duration}. Requires systematic BP monitoring.",
            "recommended_specialist": "Cardiologist / General Physician",
            "medicines": "Amlodipine (5mg once daily as prescribed), Oral Rehydration Electrolytes",
            "tests_required": "24-Hour Ambulatory BP Monitoring, Lipid Profile, Kidney Function Test (KFT), ECG",
            "self_care": "Restrict dietary sodium to under 2 grams daily. Avoid sudden standing shifts. Rest in a well-ventilated space.",
            "emergency_warning": "Seek immediate ER care if BP exceeds 180/120 mmHg or is accompanied by chest pain, shortness of breath, or numbness."
        }

    else:
        # Custom tailored output for any general symptoms
        formatted_symptoms = symptoms_text.strip().capitalize() if symptoms_text else "General Malaise"
        return {
            "possible_disease": f"Clinical Evaluation Required for: {formatted_symptoms}",
            "urgency": "Moderate",
            "reason": f"Patient reported {formatted_symptoms} lasting {duration} with {severity.lower()} severity.",
            "recommended_specialist": "General Physician / Internal Medicine Specialist",
            "medicines": "Paracetamol (500mg for symptomatic pain/fever relief as needed), Hydration Electrolytes",
            "tests_required": "Complete Blood Count (CBC), Inflammatory Markers (CRP/ESR)",
            "self_care": f"Get plenty of rest, maintain hydration with 2-3L water daily, and monitor your symptom progression closely.",
            "emergency_warning": "Seek immediate emergency medical care if symptoms worsen rapidly, or if high fever, breathing difficulty, or chest pain occurs."
        }


# ── STEP 1 ──
if "sc_step" not in st.session_state:
    st.session_state.sc_step = 1
if "sc_result" not in st.session_state:
    st.session_state.sc_result = None

st.title("🩺 AI Symptom Checker")
st.caption("Answer a few questions and get an AI-assisted prescription & triage assessment.")

steps = [
    "1. About you",
    "2. Symptoms",
    "3. Medical History",
    "4. AI Health Prescription"
]
total_steps = len(steps)

st.progress((st.session_state.sc_step - 1) / total_steps)

st.write(
    f"**Step {st.session_state.sc_step} of {total_steps} — "
    f"{steps[st.session_state.sc_step - 1]}**"
)

# ── STEP 1: About You ─────────────────────────────────────────────
if st.session_state.sc_step == 1:
    col1, col2 = st.columns(2)
    with col1:
        st.number_input("Age", min_value=1, max_value=120, value=25, key="sc_age")
    with col2:
        st.selectbox("Gender", ["Male", "Female", "Other"], key="sc_gender")

    if st.button("Next ➔"):
        st.session_state.sc_step = 2
        st.rerun()

# ── STEP 2: Symptoms ──────────────────────────────────────────────
elif st.session_state.sc_step == 2:
    st.text_area(
        "Describe your symptoms in detail",
        placeholder="e.g. Insomnia, difficulty sleeping, restlessness at night...",
        key="sc_symptoms"
    )
    col1, col2 = st.columns(2)
    with col1:
        st.text_input("Duration of symptoms", value="3 days", key="sc_duration")
    with col2:
        st.selectbox("Severity level", ["Mild", "Moderate", "Severe"], key="sc_severity")

    c1, c2 = st.columns(2)
    with c1:
        if st.button("⬅️ Back"):
            st.session_state.sc_step = 1
            st.rerun()
    with c2:
        if st.button("Next ➔"):
            if not st.session_state.get("sc_symptoms"):
                st.error("Please describe your symptoms before proceeding.")
            else:
                st.session_state.sc_step = 3
                st.rerun()

# ── STEP 3: Medical History ───────────────────────────────────────
elif st.session_state.sc_step == 3:
    st.text_input("Existing medical conditions (if any)", placeholder="e.g. Asthma, Diabetes, Hypertension", key="sc_history")
    st.text_input("Current medications (if any)", placeholder="e.g. Paracetamol, Metformin", key="sc_medications")
    st.text_input("Known allergies (if any)", placeholder="e.g. Penicillin, Dust", key="sc_allergies")

    c1, c2 = st.columns(2)
    with c1:
        if st.button("⬅️ Back"):
            st.session_state.sc_step = 2
            st.rerun()
    with c2:
        if st.button("🤖 Generate AI Prescription & Report"):
            result = analyze_symptoms_dynamically(
                st.session_state.get("sc_symptoms", ""),
                st.session_state.get("sc_age", 25),
                st.session_state.get("sc_gender", "Male"),
                st.session_state.get("sc_duration", "3 days"),
                st.session_state.get("sc_severity", "Moderate"),
                st.session_state.get("sc_history", "None"),
                st.session_state.get("sc_medications", "None"),
                st.session_state.get("sc_allergies", "None")
            )

            st.session_state.sc_result = result
            user_id = st.session_state.get("user_id", None)
            if user_id:
                try:
                    DatabaseManager.save_symptom_history(
                        user_id,
                        st.session_state.get("sc_symptoms"),
                        json.dumps(result),
                        result.get("possible_disease", ""),
                    )
                except Exception:
                    pass
            st.session_state.sc_step = 4
            st.rerun()

# ── STEP 4: Prescription & AI Health Report ───────────────────────
elif st.session_state.sc_step == 4:
    res = st.session_state.sc_result or {}

    disease = res.get('possible_disease', 'Condition Evaluation')
    urgency = res.get('urgency', 'Low to Moderate')
    specialist = res.get('recommended_specialist', 'General Physician')
    medicines = res.get('medicines', 'Medication guidance based on clinical assessment.')
    reason = res.get('reason', 'Based on reported symptoms and medical evaluation.')
    self_care = res.get('self_care', 'Maintain hydration, adequate rest, and balanced nutrition.')
    emergency = res.get('emergency_warning', 'Seek immediate ER help if severe symptoms occur.')
    tests = res.get('tests_required', 'Routine diagnostic tests as advised by specialist.')

    report_text = f"""🏥 SWASTHYA SETU - AI MEDICAL PRESCRIPTION & REPORT
──────────────────────────────────────────────────────────
Patient Info : Age {st.session_state.get('sc_age', '25')}, {st.session_state.get('sc_gender', 'N/A')}
Symptoms     : {st.session_state.get('sc_symptoms', 'N/A')} (Duration: {st.session_state.get('sc_duration', 'N/A')}, Severity: {st.session_state.get('sc_severity', 'N/A')})

Prescription & Suggested Medicines:
{medicines}

Diagnosis / Possible Condition:
{disease} (Urgency: {urgency})

Specialist Recommended: {specialist}
Recommended Tests    : {tests}

Reasoning:
{reason}

Self-Care Guidance:
{self_care}

Emergency Warning:
{emergency}
──────────────────────────────────────────────────────────
Generated via Swasthya Setu Healthcare Platform"""

    # Heading updated to Prescription & Assessment Report
    st.markdown("## 📋 Medical Prescription & Assessment Report")

    # Render Prescription Card HTML
    card_html = f"""<div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border: 1px solid #cbd5e1; border-radius: 20px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); margin-bottom: 24px; color: #0f172a;">
<div style="display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid #059669; padding-bottom:14px; margin-bottom:18px;">
<div>
<span style="font-size:20px; font-weight:800; color:#059669;">🏥 Swasthya Setu</span>
<span style="font-size:11px; background:#dcfce7; color:#166534; padding:3px 10px; border-radius:20px; font-weight:700; margin-left:8px;">Rx Digital Prescription</span>
</div>
<div style="font-size:12px; color:#64748b; font-weight:600;">
Patient Age: {st.session_state.get('sc_age', '25')} | Gender: {st.session_state.get('sc_gender', 'N/A')}
</div>
</div>

<div style="background:#f0fdf4; border-left:4px solid #059669; padding:14px 18px; border-radius:12px; margin-bottom:18px;">
<div style="font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:#166534; font-weight:800;">Possible Condition / Diagnosis</div>
<div style="font-size:18px; font-weight:800; color:#0f172a; margin-top:2px;">{disease}</div>
<div style="font-size:13px; color:#475569; margin-top:4px;">{reason}</div>
</div>

<div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:14px; padding:16px; margin-bottom:18px;">
<div style="font-size:13px; font-weight:800; color:#1e40af; display:flex; align-items:center; gap:6px;">
💊 Suggested Medicines (Prescription Recommendation)
</div>
<div style="font-size:15px; font-weight:700; color:#1e3a8a; margin-top:6px; background:#ffffff; padding:12px; border-radius:10px; border:1px solid #dbeafe;">
{medicines}
</div>
</div>

<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:18px;">
<div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px;">
<div style="font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase;">Specialist Recommended</div>
<div style="font-size:14px; font-weight:700; color:#0f172a; margin-top:4px;">👨‍⚕️ {specialist}</div>
</div>
<div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px;">
<div style="font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase;">Urgency Level</div>
<div style="font-size:14px; font-weight:700; color:#d97706; margin-top:4px;">⚠️ {urgency}</div>
</div>
</div>

<div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:14px; margin-bottom:12px;">
<div style="font-size:12px; font-weight:800; color:#166534;">💡 Self-Care Guidance</div>
<div style="font-size:13px; color:#15803d; margin-top:4px;">{self_care}</div>
</div>

<div style="background:#fef2f2; border:1px solid #fecaca; border-radius:12px; padding:14px;">
<div style="font-size:12px; font-weight:800; color:#991b1b;">🚨 Emergency Warning</div>
<div style="font-size:13px; color:#b91c1c; margin-top:4px;">{emergency}</div>
</div>
</div>"""

    st.markdown(card_html, unsafe_allow_html=True)

    # Copy Plain Prescription Text
    st.markdown("#### 📋 Copy Plain Prescription Text")
    st.code(report_text, language="text")

    if st.button("🔄 Start New Symptom Check"):
        st.session_state.sc_step = 1
        st.session_state.sc_result = None
        st.rerun()
