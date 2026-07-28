from dotenv import load_dotenv
load_dotenv()
import json
import streamlit as st
import util

st.set_page_config(
    page_title="Swasthya Setu",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize Session & Shared Sidebar
util.init_session()

# Login check at app startup: if not logged in, redirect to login page
if not st.session_state.get("user_id"):
    st.switch_page("pages/login.py")

util.render_sidebar()
util.inject_css(st.session_state["theme"])

# Health Tips Data
HEALTH_TIPS = [
    {
        "icon": "💧",
        "category": "Hydration",
        "title": "Stay Hydrated",
        "text": "Drink 2–3 litres of water every day to keep your body healthy.",
        "color1": "#2193b0",
        "color2": "#6dd5ed"
    },
    {
        "icon": "🥗",
        "category": "Nutrition",
        "title": "Eat Healthy",
        "text": "Include fruits, vegetables, whole grains and proteins in your daily meals.",
        "color1": "#56ab2f",
        "color2": "#a8e063"
    },
    {
        "icon": "🏃",
        "category": "Fitness",
        "title": "Stay Active",
        "text": "Exercise for at least 30 minutes every day for a healthier lifestyle.",
        "color1": "#ff9966",
        "color2": "#ff5e62"
    },
    {
        "icon": "😴",
        "category": "Sleep",
        "title": "Sleep Well",
        "text": "Aim for 7–8 hours of quality sleep every night.",
        "color1": "#7F7FD5",
        "color2": "#86A8E7"
    },
    {
        "icon": "🧘",
        "category": "Mental Health",
        "title": "Manage Stress",
        "text": "Take short breaks, relax and maintain a healthy work-life balance.",
        "color1": "#11998e",
        "color2": "#38ef7d"
    },
    {
        "icon": "🩺",
        "category": "Health Check",
        "title": "Regular Check-ups",
        "text": "Schedule routine health check-ups to detect problems early.",
        "color1": "#4776E6",
        "color2": "#8E54E9"
    },
    {
        "icon": "❤️",
        "category": "Heart Care",
        "title": "Take Care of Your Heart",
        "text": "Reduce salt and sugar intake while staying physically active.",
        "color1": "#e53935",
        "color2": "#e35d5b"
    },
    {
        "icon": "🚭",
        "category": "Healthy Habits",
        "title": "Avoid Smoking",
        "text": "Avoid tobacco products to reduce the risk of serious diseases.",
        "color1": "#3a6073",
        "color2": "#16222A"
    }
]

# ─────────────────────────────────────────────────────────────
# HERO BANNER
# ─────────────────────────────────────────────────────────────
st.markdown(f"""
<div class="hero-container">
    <div class="hero-title">{util.T("hero_title")}</div>
    <div class="hero-subtitle">{util.T("hero_subtitle")}</div>
    <div class="hero-tags">
        <span class="hero-tag">{util.T("tag_accessible")}</span>
        <span class="hero-tag">{util.T("tag_ai")}</span>
        <span class="hero-tag">{util.T("tag_fast")}</span>
        <span class="hero-tag">{util.T("tag_rural")}</span>
        <span class="hero-tag">{util.T("tag_offline")}</span>
    </div>
</div>
""", unsafe_allow_html=True)

st.markdown("---")
st.markdown(f"## {util.T('daily_tips_title')}")

tips_json = json.dumps(HEALTH_TIPS)

carousel_html = f"""
<!DOCTYPE html>
<html>
<head>
<style>

body {{
    margin:0;
    padding:0;
    overflow:hidden;
    font-family:Arial, Helvetica, sans-serif;
}}

.card {{
    border-radius:18px;
    padding:16px 20px;
    color:white;
    height:125px;
    transition:0.7s ease;
    box-shadow:0 6px 20px rgba(0,0,0,.12);
    box-sizing:border-box;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
}}

.badge {{
    display:inline-block;
    background:rgba(255,255,255,.22);
    padding:3px 10px;
    border-radius:20px;
    font-size:11px;
    font-weight:bold;
}}

.header-row {{
    display:flex;
    align-items:center;
    gap:10px;
    margin-top:4px;
}}

.icon {{
    font-size:26px;
    line-height:1;
}}

.title {{
    font-size:18px;
    font-weight:bold;
    line-height:1.2;
}}

.text {{
    font-size:13px;
    margin-top:4px;
    line-height:1.4;
    opacity:0.95;
}}

.dots {{
    margin-top:6px;
    text-align:center;
    font-size:12px;
    letter-spacing:4px;
    opacity:0.8;
}}

</style>
</head>

<body>

<div class="card" id="card">

<div>
  <span class="badge" id="category"></span>
  <div class="header-row">
    <span class="icon" id="icon"></span>
    <span class="title" id="title"></span>
  </div>
  <div class="text" id="text"></div>
</div>

<div class="dots" id="dots"></div>

</div>

<script>

const tips = %s;

let current = 0;

function updateCard() {{

    const tip = tips[current];

    document.getElementById("category").textContent = tip.category;
    document.getElementById("icon").textContent = tip.icon;
    document.getElementById("title").textContent = tip.title;
    document.getElementById("text").textContent = tip.text;

    document.getElementById("card").style.background =
        "linear-gradient(135deg," + tip.color1 + "," + tip.color2 + ")";

    let dots = "";

    for(let i=0;i<tips.length;i++){{
        dots += (i===current) ? "● " : "○ ";
    }}

    document.getElementById("dots").textContent = dots;

    current = (current + 1) %% tips.length;
}}

updateCard();

setInterval(updateCard,4000);

</script>

</body>
</html>
""" % tips_json

st.components.v1.html(
    carousel_html,
    height=155,
)

# ─────────────────────────────────────────────────────────────
# PLATFORM FEATURES
# ─────────────────────────────────────────────────────────────
st.markdown(f"""
<div class="section-header"><h2>{util.T("platform_features")}</h2><div class="section-line"></div></div>
""", unsafe_allow_html=True)

features = [
    ("🤖", util.T("feat_ai_title"), util.T("feat_ai_desc")),
    ("📅", util.T("feat_appt_title"), util.T("feat_appt_desc")),
    ("🚑", util.T("feat_emergency_title"), util.T("feat_emergency_desc")),
    ("💊", util.T("feat_medicine_title"), util.T("feat_medicine_desc")),
    ("🗂️", util.T("feat_records_title"), util.T("feat_records_desc")),
    ("📷", util.T("feat_prescription_title"), util.T("feat_prescription_desc")),
]
cards_html = '<div class="features-grid">'
for icon, title, desc in features:
    cards_html += f'<div class="feature-card"><div class="feature-icon">{icon}</div><div class="feature-title">{title}</div><div class="feature-desc">{desc}</div></div>'
cards_html += '</div>'
st.markdown(cards_html, unsafe_allow_html=True)

# ─────────────────────────────────────────────────────────────
# WELCOME / GETTING STARTED
# ─────────────────────────────────────────────────────────────
st.markdown('<div class="service-container">', unsafe_allow_html=True)
st.markdown(f"### {util.T('welcome_title')}")
st.markdown(util.T("welcome_desc"))
st.markdown('</div>', unsafe_allow_html=True)

# ─────────────────────────────────────────────────────────────
# FOOTER
# ─────────────────────────────────────────────────────────────
st.markdown(f"""
<div class="footer"><p class="footer-text">{util.T("footer_text")}</p></div>
""", unsafe_allow_html=True)