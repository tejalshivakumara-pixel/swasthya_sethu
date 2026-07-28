import streamlit as st
import hashlib
from database.database_manager import DatabaseManager
st.markdown("""
<style>
[data-testid="stSidebar"] {
    display: none;
}
</style>
""", unsafe_allow_html=True)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


# ── Already logged in? ──────────────────────────────────────────────────────
if st.session_state.get("user_id"):
    st.success(f"You're logged in as {st.session_state.get('user_name')}.")
    
    if st.button("Log out"):
        st.session_state.pop("user_id", None)
        st.session_state.pop("user_name", None)
        st.rerun()
    st.stop()

# ── Login form ───────────────────────────────────────────────────────────────
st.title("🔐 Log in")

with st.form("login_form"):
    email    = st.text_input("Email")
    password = st.text_input("Password", type="password")
    submitted = st.form_submit_button("Log in")

    if submitted:
        if not email or not password:
            st.error("Enter both email and password.")
        else:
            user = DatabaseManager.login_user(email, hash_password(password))
            if user:
                st.session_state["user_id"]   = user["id"]
                st.session_state["user_name"] = user["full_name"]
                st.success(f"Welcome back, {user['full_name']}!")
                st.switch_page("app.py")
            else:
                st.error("Incorrect email or password.")

st.caption("Don't have an account?")

if st.button("📝 Create Account"):
    st.switch_page("pages/signup.py")