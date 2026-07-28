import streamlit as st
import hashlib
from database.database_manager import DatabaseManager


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


# ── Sign-up form ─────────────────────────────────────────────────────────────
st.title("📝 Create your account")

with st.form("signup_form"):
    name     = st.text_input("Full name")
    email    = st.text_input("Email")
    password = st.text_input("Password", type="password")
    confirm  = st.text_input("Confirm password", type="password")
    phone    = st.text_input("Phone number")
    dob      = st.date_input("Date of birth", value=None)

    submitted = st.form_submit_button("Create account")

    if submitted:
        if not name or not email or not password or not phone:
            st.error("Please fill in name, email, password, and phone.")
        elif password != confirm:
            st.error("Passwords don't match.")
        elif len(password) < 6:
            st.error("Password should be at least 6 characters.")
        else:
            existing = DatabaseManager.fetch_one(
                "SELECT id FROM users WHERE email=%s", (email,)
            )
            if existing:
                st.error("An account with this email already exists. Try logging in instead.")
            else:
                ok = DatabaseManager.register_user(
                    name, email, hash_password(password), phone, dob
                )
                if ok:
                    st.success("Account created! Redirecting to login…")
                    st.switch_page("pages/login.py")
                else:
                    st.error("Something went wrong creating your account. Please try again.")

st.caption("Already have an account? Go to the Login page from the sidebar.")