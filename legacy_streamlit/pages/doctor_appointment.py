import streamlit as st
from datetime import date, timedelta
import os
import importlib.util as ilu
from database.database_manager import DatabaseManager

# ── Shared sidebar + theme ──
_spec = ilu.spec_from_file_location("util", os.path.join(os.path.dirname(__file__), "util.py"))
_mod  = ilu.module_from_spec(_spec)
_spec.loader.exec_module(_mod)
_mod.init_session()
_mod.render_sidebar()
_mod.inject_css(st.session_state["theme"])

if "ap_step" not in st.session_state:
    st.session_state.ap_step = 1

steps = ["1. Hospital", "2. Doctor", "3. Date & Time", "4. Your details", "5. Confirm"]
st.title("📅 Book a Doctor Appointment")
st.progress((st.session_state.ap_step - 1) / 4)
st.write(f"**Step {st.session_state.ap_step} of 5 — {steps[st.session_state.ap_step - 1]}**")

# ── STEP 1: hospital ─────────────────────────────────────────
if st.session_state.ap_step == 1:
    hospitals = DatabaseManager.get_hospitals()
    if not hospitals:
        st.error("No hospitals found. Check your database seed data.")
        st.stop()

    options = {f"{h['name']} — {h.get('city', '')}": h["id"] for h in hospitals}
    choice = st.selectbox("Choose a hospital", list(options.keys()))

    if st.button("Next: Choose Doctor →"):
        st.session_state.ap_hospital_id = options[choice]
        st.session_state.ap_hospital_name = choice
        st.session_state.ap_step = 2
        st.rerun()

# ── STEP 2: doctor ───────────────────────────────────────────
elif st.session_state.ap_step == 2:
    doctors = DatabaseManager.get_doctors(st.session_state.ap_hospital_id)
    if not doctors:
        st.warning("No doctors listed for this hospital yet.")
    else:
        options = {f"{d['doctor_name']} — {d.get('specialty', 'General')}": d for d in doctors}
        choice = st.radio("Choose a doctor", list(options.keys()))

    c1, c2 = st.columns(2)
    if c1.button("← Back"):
        st.session_state.ap_step = 1
        st.rerun()
    if doctors and c2.button("Next: Date & Time →"):
        selected = options[choice]
        st.session_state.ap_doctor_id = selected["doctor_id"]
        st.session_state.ap_doctor_name = selected["doctor_name"]
        st.session_state.ap_step = 3
        st.rerun()

# ── STEP 3: date & time ──────────────────────────────────────
elif st.session_state.ap_step == 3:
    appt_date = st.date_input("Appointment date", min_value=date.today(),
                               max_value=date.today() + timedelta(days=60))
    visit_type = st.selectbox("Visit type", ["In-person", "Follow-up", "Video consultation"])
    slots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
    appt_time = st.selectbox("Available time slots", slots)

    c1, c2 = st.columns(2)
    if c1.button("← Back"):
        st.session_state.ap_step = 2
        st.rerun()
    if c2.button("Next: Your Details →"):
        st.session_state.ap_date = appt_date
        st.session_state.ap_visit_type = visit_type
        st.session_state.ap_time = appt_time
        st.session_state.ap_step = 4
        st.rerun()

# ── STEP 4: patient details ──────────────────────────────────
elif st.session_state.ap_step == 4:
    with st.form("details_form"):
        name = st.text_input("Full name", value=st.session_state.get("user_name", ""))
        age = st.number_input("Age", min_value=1, max_value=120, value=30)
        gender = st.selectbox("Gender", ["Male", "Female", "Other", "Prefer not to say"])
        phone = st.text_input("Phone", placeholder="+91 XXXXX XXXXX")
        village = st.text_input("Village / Town")
        district = st.text_input("District")
        symptoms = st.text_area("Briefly describe your symptoms or reason for visit")
        allergies = st.text_input("Allergies (optional)", placeholder="e.g. Penicillin, Dust, None")
        meds = st.text_input("Current medicines (optional)")

        c1, c2 = st.columns(2)
        back = c1.form_submit_button("← Back")
        nxt = c2.form_submit_button("Review & Confirm →")

        if back:
            st.session_state.ap_step = 3
            st.rerun()
        if nxt:
            if not name or not phone or not symptoms:
                st.error("Please fill in your name, phone, and reason for visit.")
            else:
                st.session_state.ap_name = name
                st.session_state.ap_age = age
                st.session_state.ap_gender = gender
                st.session_state.ap_phone = phone
                st.session_state.ap_village = village
                st.session_state.ap_district = district
                st.session_state.ap_symptoms = symptoms
                st.session_state.ap_allergies = allergies
                st.session_state.ap_meds = meds
                st.session_state.ap_step = 5
                st.rerun()

# ── STEP 5: review & confirm ──────────────────────────────────
elif st.session_state.ap_step == 5:
    st.subheader("Review your appointment")
    st.write(f"**Hospital:** {st.session_state.ap_hospital_name}")
    st.write(f"**Doctor:** {st.session_state.ap_doctor_name}")
    st.write(f"**Date:** {st.session_state.ap_date}")
    st.write(f"**Time:** {st.session_state.ap_time}  ·  **Visit type:** {st.session_state.ap_visit_type}")
    st.write(f"**Patient:** {st.session_state.ap_name}, {st.session_state.ap_age}, {st.session_state.ap_gender}")
    st.write(f"**Phone:** {st.session_state.ap_phone}")
    st.write(f"**Reason:** {st.session_state.ap_symptoms}")

    c1, c2 = st.columns(2)
    if c1.button("← Edit Details"):
        st.session_state.ap_step = 4
        st.rerun()

    if c2.button("✅ Confirm Appointment"):
        ok = DatabaseManager.book_appointment(
            st.session_state["user_id"],
            st.session_state.ap_doctor_id,
            st.session_state.ap_hospital_id,
            str(st.session_state.ap_date),
            st.session_state.ap_time,
            st.session_state.ap_symptoms,
        )
        if ok:
            st.success("🎉 Appointment booked successfully!")
            st.balloons()
            if st.button("📋 Book another appointment"):
                for k in list(st.session_state.keys()):
                    if k.startswith("ap_"):
                        del st.session_state[k]
                st.session_state.ap_step = 1
                st.rerun()
        else:
            st.error("Something went wrong booking your appointment. Please try again.")