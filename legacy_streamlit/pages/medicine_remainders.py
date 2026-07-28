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



st.title("💊 Medicine Reminders")

FREQUENCIES = ["Once daily", "Twice daily", "Three times daily", "Every 6 hours",
               "Every 8 hours", "Weekly", "As needed"]

DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]


def get_or_create_medicine(name: str, purpose: str = ""):
    """Looks up a medicine by name (case-insensitive); creates it if it
    doesn't exist yet. Returns the medicine_id."""
    existing = DatabaseManager.fetch_one(
        "SELECT medicine_id FROM medicines WHERE LOWER(medicine_name)=LOWER(%s)", (name,)
    )
    if existing:
        return existing["medicine_id"]
    DatabaseManager.execute_query(
        "INSERT INTO medicines (medicine_name, description) VALUES (%s, %s)",
        (name, purpose or None),
    )
    created = DatabaseManager.fetch_one(
        "SELECT medicine_id FROM medicines WHERE LOWER(medicine_name)=LOWER(%s)", (name,)
    )
    return created["medicine_id"] if created else None


tab_add, tab_view = st.tabs(["➕ Add reminder", "🔔 My reminders"])

with tab_add:
    with st.form("add_reminder"):
        name = st.text_input("Medicine name", placeholder="e.g. Metformin 500mg")
        dose = st.text_input("Dosage", placeholder="e.g. 1 tablet")
        frequency = st.selectbox("Frequency", FREQUENCIES)
        reminder_time = st.time_input("Reminder time")
        selected_days = st.multiselect("Days", DAYS, default=DAYS)
        purpose = st.text_input("Purpose (optional)", placeholder="e.g. Diabetes")

        c1, c2 = st.columns(2)
        start = c1.date_input("Start date", value=date.today())
        end = c2.date_input("End date (optional)", value=date.today() + timedelta(days=30))

        if st.form_submit_button("Save reminder"):
            if not name or not dose:
                st.error("Enter at least the medicine name and dosage.")
            else:
                medicine_id = get_or_create_medicine(name, purpose)
                if not medicine_id:
                    st.error("Couldn't create/find this medicine. Try again.")
                else:
                    days_str = ",".join(selected_days) if selected_days else "Daily"
                    freq_label = f"{frequency} ({days_str})"
                    ok = DatabaseManager.add_reminder(
                        st.session_state["user_id"],
                        medicine_id,
                        dose,
                        reminder_time.strftime("%I:%M %p"),
                        freq_label,
                        str(start),
                        str(end) if end else None,
                    )
                    if ok:
                        st.success(f"Reminder set for {name} at {reminder_time.strftime('%I:%M %p')}.")
                    else:
                        st.error("Something went wrong saving the reminder.")

with tab_view:
    reminders = DatabaseManager.get_reminders(st.session_state["user_id"])
    if not reminders:
        st.info("No reminders yet. Add one from the first tab.")
    else:
        medicines = {m["medicine_id"]: m["medicine_name"] for m in DatabaseManager.get_medicines()}
        for r in reminders:
            med_name = medicines.get(r["medicine_id"], "Unknown medicine")
            with st.container(border=True):
                st.subheader(f"💊 {med_name}")
                st.write(f"**Dose:** {r.get('dosage')}  ·  **Time:** {r.get('reminder_time')}")
                st.write(f"**Frequency:** {r.get('frequency')}")
                st.caption(f"From {r.get('start_date')}" + (f" to {r.get('end_date')}" if r.get("end_date") else " (ongoing)"))