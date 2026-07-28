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

st.title("🚨 Emergency Help")
st.caption("Quick access to emergency services, nearby hospitals, and your emergency contacts.")

# ── National emergency numbers ───────────────────────────────
st.subheader("📞 Emergency Services")
services = [
    ("🚑", "Ambulance", "108", "Ambulance"),
    ("🚔", "Police", "100", "Police"),
    ("🔥", "Fire Brigade", "101", "Fire Brigade"),
    ("🤰", "Women Helpline", "1091", None),
    ("🧠", "Mental Health (iCall)", "1800111565", None),
]

cols = st.columns(2)
for i, (icon, name, number, sos_type) in enumerate(services):
    with cols[i % 2]:
        with st.container(border=True):
            st.markdown(f"### {icon} {name}")
            st.markdown(f"**{number}**")
            st.markdown(f"[👆 Tap to call](tel:{number})")
            if sos_type and st.session_state.get("user_id"):
                if st.button(f"Log SOS — {name}", key=f"sos_{name}"):
                    DatabaseManager.save_sos(
                        st.session_state["user_id"], sos_type, number, None, None,
                        f"SOS triggered from Emergency Help page: {name}"
                    )
                    st.success(f"Logged. Now tap the call link above to reach {name}.")

st.divider()

# ── Nearby hospitals ──────────────────────────────────────────
st.subheader("🏥 Nearby Hospitals")
hospitals = DatabaseManager.get_nearby_hospitals(limit=5)
if not hospitals:
    st.info("No hospitals found in the database.")
else:
    for h in hospitals:
        with st.container(border=True):
            st.markdown(f"**{h['name']}** ({h.get('type', 'N/A')})")
            st.caption(h.get("address", ""))
            c1, c2, c3 = st.columns(3)
            c1.metric("Distance", f"{h.get('distance_km', '?')} km")
            c2.metric("Travel time", f"{h.get('travel_mins', '?')} min")
            c3.markdown(f"[📞 {h['phone_primary']}](tel:{h['phone_primary']})")
            tags = []
            if h.get("emergency_ward"): tags.append("🩺 Emergency ward")
            if h.get("icu_available"): tags.append("🛏️ ICU")
            if h.get("blood_bank"): tags.append("🩸 Blood bank")
            if h.get("ambulance"): tags.append("🚑 Ambulance")
            if tags:
                st.caption(" · ".join(tags))

st.divider()

# ── Personal emergency contacts ──────────────────────────────
st.subheader("👨‍👩‍👧 My Emergency Contacts")

if not st.session_state.get("user_id"):
    st.warning("Log in to save and manage your personal emergency contacts.")
else:
    contacts = DatabaseManager.get_emergency_contacts(st.session_state["user_id"])
    if not contacts:
        st.info("No emergency contacts saved yet.")
    else:
        for c in contacts:
            with st.container(border=True):
                col1, col2 = st.columns([3, 1])
                with col1:
                    st.markdown(f"**{c['full_name']}** — {c['relationship']}")
                    st.markdown(f"[📞 {c['phone']}](tel:{c['phone']})")
                with col2:
                    if st.button("Remove", key=f"del_{c['id']}"):
                        DatabaseManager.delete_emergency_contact(c["id"])
                        st.rerun()

    with st.expander("➕ Add a new emergency contact"):
        with st.form("add_contact"):
            name = st.text_input("Full name")
            relationship = st.selectbox("Relationship", [
                "Wife", "Husband", "Son", "Daughter", "Father", "Mother",
                "Brother", "Sister", "Friend", "Neighbour", "Doctor", "Other"
            ])
            phone = st.text_input("Phone number", placeholder="+91 XXXXX XXXXX")
            phone_alt = st.text_input("Alternate phone (optional)")
            priority = st.selectbox("Priority", [1, 2, 3], format_func=lambda x: {1: "Primary", 2: "Secondary", 3: "Tertiary"}[x])

            if st.form_submit_button("Save contact"):
                if not name or not phone:
                    st.error("Name and phone number are required.")
                else:
                    ok = DatabaseManager.add_emergency_contact(
                        st.session_state["user_id"], name, relationship, phone, phone_alt or None, priority
                    )
                    if ok:
                        st.success("Contact saved.")
                        st.rerun()
                    else:
                        st.error("Something went wrong saving this contact.")