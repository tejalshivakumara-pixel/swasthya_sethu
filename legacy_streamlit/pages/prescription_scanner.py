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



st.title("🔬 Prescription Scanner")
st.caption("Upload a photo of a prescription and let AI read it for you.")

UPLOAD_DIR = "uploaded_prescriptions"
os.makedirs(UPLOAD_DIR, exist_ok=True)

uploaded = st.file_uploader("Choose a photo of your prescription", type=["png", "jpg", "jpeg"])

if uploaded:
    st.image(uploaded, caption="Preview", use_container_width=True)

    if st.button("🔍 Scan prescription"):
        with st.spinner("Reading your prescription..."):
            save_path = os.path.join(UPLOAD_DIR, f"{st.session_state['user_id']}_{uploaded.name}")
            with open(save_path, "wb") as f:
                f.write(uploaded.getbuffer())

            result = DatabaseManager.scan_and_save_prescription(
                st.session_state["user_id"], save_path
            )

        if result.get("error"):
            st.error(f"Couldn't read this prescription clearly: {result['error']}")
        elif not result.get("medicines"):
            st.warning("No medicines could be identified in this image. Try a clearer photo.")
        else:
            st.success("Prescription scanned and saved to your records." if result.get("saved")
                        else "Prescription scanned, but saving to your records failed.")

            if result.get("diagnosis"):
                st.markdown(f"**Diagnosis noted:** {result['diagnosis']}")

            st.markdown("**Medicines found:**")
            for m in result["medicines"]:
                with st.container(border=True):
                    st.write(f"💊 **{m.get('name', 'Unknown')}**")
                    if m.get("dosage"):
                        st.caption(f"Dosage: {m['dosage']}")
                    if m.get("frequency"):
                        st.caption(f"Frequency: {m['frequency']}")

            if result.get("raw_text_notes"):
                with st.expander("Other text found on the prescription"):
                    st.write(result["raw_text_notes"])

st.divider()
st.subheader("📖 Past prescriptions")
past = DatabaseManager.get_prescriptions(st.session_state["user_id"])
if not past:
    st.info("No scanned prescriptions yet.")
else:
    for p in past:
        with st.container(border=True):
            st.caption(str(p.get("created_at", "")))
            if p.get("diagnosis"):
                st.write(f"**Diagnosis:** {p['diagnosis']}")
            if p.get("image_path") and os.path.exists(p["image_path"]):
                st.image(p["image_path"], width=200)