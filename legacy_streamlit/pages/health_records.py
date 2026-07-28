import streamlit as st
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

st.title("📋 My Health Records")

# ── Login guard — must come before any DatabaseManager call ──
if not st.session_state.get("user_id"):
    st.warning("Please log in first to view or add health records.")
    st.stop()

tab_add, tab_view = st.tabs(["➕ Add a record", "📖 View history"])

with tab_add:
    with st.form("add_record"):
        col1, col2 = st.columns(2)
        bp = col1.text_input("Blood pressure", placeholder="e.g. 120/80")
        sugar = col2.text_input("Sugar level", placeholder="e.g. 95 mg/dL")
        height = col1.text_input("Height", placeholder="e.g. 170 cm")
        weight = col2.text_input("Weight", placeholder="e.g. 68 kg")
        allergies = st.text_input("Allergies", placeholder="e.g. Penicillin, Dust, None")
        chronic = st.text_input("Chronic conditions", placeholder="e.g. Diabetes, High BP, None")
        notes = st.text_area("Notes", placeholder="Anything else worth recording...")

        if st.form_submit_button("Save record"):
            if not any([bp, sugar, height, weight, allergies, chronic, notes]):
                st.error("Fill in at least one field before saving.")
            else:
                ok = DatabaseManager.save_health_record(
                    st.session_state["user_id"], bp, sugar, height, weight, allergies, chronic, notes
                )
                if ok:
                    st.success("Record saved.")
                else:
                    st.error("Something went wrong saving your record.")

with tab_view:
    records = DatabaseManager.get_health_records(st.session_state["user_id"])
    if not records:
        st.info("No health records yet. Add one from the first tab.")
    else:
        for r in records:
            with st.container(border=True):
                st.caption(str(r.get("created_at", "")))
                cols = st.columns(4)
                cols[0].metric("BP", r.get("blood_pressure") or "—")
                cols[1].metric("Sugar", r.get("sugar_level") or "—")
                cols[2].metric("Height", r.get("height") or "—")
                cols[3].metric("Weight", r.get("weight") or "—")
                if r.get("allergies"):
                    st.write(f"**Allergies:** {r['allergies']}")
                if r.get("chronic_diseases"):
                    st.write(f"**Chronic conditions:** {r['chronic_diseases']}")
                if r.get("notes"):
                    st.write(f"**Notes:** {r['notes']}")