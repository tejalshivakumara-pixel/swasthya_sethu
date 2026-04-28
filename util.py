import streamlit as st

# ─────────────────────────────────────────────────────────────
# TRANSLATIONS
# ─────────────────────────────────────────────────────────────
TRANSLATIONS = {
    "English": {
        "settings": "⚙️ Settings",
        "theme_label": "🎨 Theme",
        "language_label": "🌐 Language",
        "quick_stats": "📊 Quick Stats",
        "users_served": "Users Served",
        "consultations": "Consultations",
        "villages": "Villages Covered",
        "stats_disclaimer": "These statistics are for visual/demo purposes only.",
        # Sidebar nav
        "nav_title": "🏥 Swasthya Setu",
        "nav_home": "🏠 Home",
        "nav_symptom": "🤖 Symptom Checker",
        "nav_appointment": "📅 Doctor Appointment",
        "nav_medicine": "💊 Medicine Reminders",
        "nav_records": "🗂️ Health Records",
        "nav_prescription": "📷 Prescription Scanner",
        "nav_emergency": "🚑 Emergency Help",
    },
    "हिंदी": {
        "settings": "⚙️ सेटिंग्स",
        "theme_label": "🎨 थीम",
        "language_label": "🌐 भाषा",
        "quick_stats": "📊 त्वरित आँकड़े",
        "users_served": "सेवित उपयोगकर्ता",
        "consultations": "परामर्श",
        "villages": "कवर किए गए गाँव",
        "stats_disclaimer": "ये आँकड़े केवल डेमो के लिए हैं।",
        "nav_title": "🏥 स्वास्थ्य सेतु",
        "nav_home": "🏠 होम",
        "nav_symptom": "🤖 लक्षण जाँचकर्ता",
        "nav_appointment": "📅 डॉक्टर अपॉइंटमेंट",
        "nav_medicine": "💊 दवा अनुस्मारक",
        "nav_records": "🗂️ स्वास्थ्य रिकॉर्ड",
        "nav_prescription": "📷 पर्चा स्कैनर",
        "nav_emergency": "🚑 आपातकालीन सहायता",
    },
    "ಕನ್ನಡ": {
        "settings": "⚙️ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
        "theme_label": "🎨 ಥೀಮ್",
        "language_label": "🌐 ಭಾಷೆ",
        "quick_stats": "📊 ತ್ವರಿತ ಅಂಕಿಅಂಶಗಳು",
        "users_served": "ಸೇವಿಸಿದ ಬಳಕೆದಾರರು",
        "consultations": "ಸಮಾಲೋಚನೆಗಳು",
        "villages": "ಒಳಗೊಂಡ ಗ್ರಾಮಗಳು",
        "stats_disclaimer": "ಈ ಅಂಕಿಅಂಶಗಳು ಡೆಮೋ ಉದ್ದೇಶಕ್ಕಾಗಿ ಮಾತ್ರ.",
        "nav_title": "🏥 ಸ್ವಾಸ್ಥ್ಯ ಸೇತು",
        "nav_home": "🏠 ಮನೆ",
        "nav_symptom": "🤖 ರೋಗಲಕ್ಷಣ ಪರೀಕ್ಷಕ",
        "nav_appointment": "📅 ವೈದ್ಯರ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್",
        "nav_medicine": "💊 ಔಷಧ ಜ್ಞಾಪನೆಗಳು",
        "nav_records": "🗂️ ಆರೋಗ್ಯ ದಾಖಲೆಗಳು",
        "nav_prescription": "📷 ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಸ್ಕ್ಯಾನರ್",
        "nav_emergency": "🚑 ತುರ್ತು ಸಹಾಯ",
    },
    "தமிழ்": {
        "settings": "⚙️ அமைப்புகள்",
        "theme_label": "🎨 தீம்",
        "language_label": "🌐 மொழி",
        "quick_stats": "📊 விரைவு புள்ளிவிவரங்கள்",
        "users_served": "சேவை பெற்றவர்கள்",
        "consultations": "ஆலோசனைகள்",
        "villages": "உள்ளடக்கிய கிராமங்கள்",
        "stats_disclaimer": "இந்த புள்ளிவிவரங்கள் டெமோ நோக்கங்களுக்காக மட்டுமே.",
        "nav_title": "🏥 ஸ்வாஸ்த்ய சேது",
        "nav_home": "🏠 முகப்பு",
        "nav_symptom": "🤖 அறிகுறி சரிபார்ப்பாளர்",
        "nav_appointment": "📅 மருத்துவர் சந்திப்பு",
        "nav_medicine": "💊 மருந்து நினைவூட்டல்",
        "nav_records": "🗂️ சுகாதார பதிவுகள்",
        "nav_prescription": "📷 மருந்துசீட்டு ஸ்கேனர்",
        "nav_emergency": "🚑 அவசர உதவி",
    },
    "తెలుగు": {
        "settings": "⚙️ సెట్టింగ్‌లు",
        "theme_label": "🎨 థీమ్",
        "language_label": "🌐 భాష",
        "quick_stats": "📊 త్వరిత గణాంకాలు",
        "users_served": "సేవ చేసిన వినియోగదారులు",
        "consultations": "సంప్రదింపులు",
        "villages": "కవర్ చేసిన గ్రామాలు",
        "stats_disclaimer": "ఈ గణాంకాలు డెమో ప్రయోజనాల కోసం మాత్రమే.",
        "nav_title": "🏥 స్వాస్థ్య సేతు",
        "nav_home": "🏠 హోమ్",
        "nav_symptom": "🤖 లక్షణ పరీక్షకుడు",
        "nav_appointment": "📅 డాక్టర్ అపాయింట్‌మెంట్",
        "nav_medicine": "💊 మందు గుర్తుచేపులు",
        "nav_records": "🗂️ ఆరోగ్య రికార్డులు",
        "nav_prescription": "📷 ప్రిస్క్రిప్షన్ స్కానర్",
        "nav_emergency": "🚑 అత్యవసర సహాయం",
    },
}


def T(key):
    lang = st.session_state.get("language", "English")
    return TRANSLATIONS.get(lang, TRANSLATIONS["English"]).get(
        key, TRANSLATIONS["English"].get(key, key)
    )


def init_session():
    """Call at the top of every page to ensure session defaults exist."""
    params = st.query_params

    # Read theme from URL if present, else keep existing session value, else default
    if "theme" not in st.session_state:
        st.session_state["theme"] = params.get("theme", "Light")
    else:
        # URL always wins so navigating carries the setting over
        if "theme" in params:
            st.session_state["theme"] = params["theme"]

    if "language" not in st.session_state:
        st.session_state["language"] = params.get("language", "English")
    else:
        if "language" in params:
            st.session_state["language"] = params["language"]


def inject_css(theme: str = None):
    if theme is None:
        theme = st.session_state.get("theme", "Light")

    dark = theme == "Dark"
    bg_primary     = "#0f172a" if dark else "#ffffff"
    bg_secondary   = "#1e293b" if dark else "#f1f5f9"
    bg_card        = "#1e293b" if dark else "#ffffff"
    text_primary   = "#f8fafc" if dark else "#0f172a"
    text_secondary = "#94a3b8" if dark else "#64748b"
    accent         = "#3b82f6"
    border_color   = "#334155" if dark else "#e2e8f0"
    shadow         = "0 4px 20px rgba(0,0,0,0.3)" if dark else "0 4px 20px rgba(0,0,0,0.08)"

    st.markdown(f"""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap');

    .stApp {{ background: {bg_primary}; font-family: 'Inter', sans-serif; }}

    h1,h2,h3,h4,h5,h6 {{ font-family:'Poppins',sans-serif !important; color:{text_primary} !important; font-weight:700 !important; }}
    p,span,label,.stMarkdown {{ color:{text_primary} !important; }}
    .stTextInput label,.stSelectbox label,.stTextArea label {{ color:{text_primary} !important; font-weight:500 !important; }}

    .hero-container {{
        background: linear-gradient(135deg,{accent} 0%,#8b5cf6 100%);
        border-radius:24px; padding:60px 40px; text-align:center;
        margin-bottom:40px; position:relative; overflow:hidden;
    }}
    .hero-container::before {{
        content:''; position:absolute; top:-50%; left:-50%;
        width:200%; height:200%;
        background:radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 70%);
        animation:pulse 4s ease-in-out infinite;
    }}
    @keyframes pulse {{ 0%,100%{{transform:scale(1);opacity:0.5}} 50%{{transform:scale(1.1);opacity:0.8}} }}

    .hero-title   {{ font-size:3.5rem; font-weight:800; color:white !important; margin-bottom:10px; position:relative; z-index:1; }}
    .hero-subtitle {{ font-size:1.4rem; color:rgba(255,255,255,0.9) !important; font-weight:500; margin-bottom:20px; position:relative; z-index:1; }}
    .hero-tags    {{ display:flex; justify-content:center; gap:15px; flex-wrap:wrap; position:relative; z-index:1; }}
    .hero-tag     {{ background:rgba(255,255,255,0.2); backdrop-filter:blur(10px); padding:8px 20px; border-radius:50px; color:white !important; font-size:0.9rem; font-weight:500; }}

    .features-grid {{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:16px; }}
    .feature-card {{
        background:{bg_card}; border:1px solid {border_color}; border-radius:16px;
        padding:24px; transition:all 0.3s ease; box-shadow:{shadow};
        display:flex; flex-direction:column; height:100%; min-height:160px; box-sizing:border-box;
    }}
    .feature-card:hover {{ transform:translateY(-5px); box-shadow:0 12px 40px rgba(59,130,246,0.15); border-color:{accent}; }}
    .feature-icon  {{ font-size:2.5rem; margin-bottom:12px; line-height:1; }}
    .feature-title {{ font-size:1.05rem; font-weight:600; color:{text_primary} !important; margin-bottom:8px; }}
    .feature-desc  {{ font-size:0.88rem; color:{text_secondary} !important; line-height:1.5; flex:1; }}

    .section-header {{ display:flex; align-items:center; gap:12px; margin:40px 0 24px 0; }}
    .section-header h2 {{ margin:0; font-size:1.8rem; }}
    .section-line {{ flex:1; height:2px; background:linear-gradient(90deg,{accent},transparent); border-radius:2px; }}

    .service-container {{ background:{bg_card}; border:1px solid {border_color}; border-radius:20px; padding:30px; box-shadow:{shadow}; }}

    .stButton>button {{
        background:linear-gradient(135deg,{accent} 0%,#8b5cf6 100%);
        color:white !important; border:none; border-radius:12px; padding:12px 32px;
        font-weight:600; font-size:1rem; transition:all 0.3s ease;
        box-shadow:0 4px 15px rgba(59,130,246,0.3);
    }}
    .stButton>button:hover {{ transform:translateY(-2px); box-shadow:0 6px 25px rgba(59,130,246,0.4); }}

    .stTextInput>div>div>input,
    .stTextArea>div>div>textarea {{
        background:{bg_secondary} !important; border:2px solid {border_color} !important;
        border-radius:12px !important; color:{text_primary} !important;
        padding:12px 16px !important; font-size:1rem !important;
    }}
    .stTextInput>div>div>input:focus,
    .stTextArea>div>div>textarea:focus {{
        border-color:{accent} !important; box-shadow:0 0 0 3px rgba(59,130,246,0.1) !important;
    }}
    .stSelectbox>div>div {{ background:{bg_secondary} !important; border:2px solid {border_color} !important; border-radius:12px !important; }}

    section[data-testid="stSidebar"] {{ background:{bg_secondary} !important; }}
    section[data-testid="stSidebar"] .stRadio label,
    section[data-testid="stSidebar"] .stSelectbox label {{ color:{text_primary} !important; }}

    .nav-link {{
        display:block; padding:10px 14px; border-radius:10px;
        color:{text_primary} !important; text-decoration:none;
        font-size:0.92rem; font-weight:600; margin-bottom:4px;
        transition:all 0.2s;
    }}
    .nav-link:hover {{ background:rgba(59,130,246,0.15); color:{accent} !important; }}
    .nav-link.active {{ background:rgba(59,130,246,0.2); color:{accent} !important; border-left:3px solid {accent}; }}
    .nav-section-title {{
        font-size:0.72rem; font-weight:700; color:{text_secondary} !important;
        text-transform:uppercase; letter-spacing:0.08em;
        padding:4px 14px; margin-top:8px; margin-bottom:4px;
    }}

    .stats-disclaimer {{
        font-size:0.75rem; color:{text_secondary} !important; font-style:italic;
        margin-top:6px; padding:6px 10px; border-left:3px solid {accent};
        background:rgba(59,130,246,0.06); border-radius:0 6px 6px 0;
    }}

    .stSuccess,.stInfo,.stWarning,.stError {{ border-radius:12px !important; border:none !important; }}
    hr {{ border:none; height:1px; background:linear-gradient(90deg,transparent,{border_color},transparent); margin:40px 0; }}

    .footer {{ text-align:center; padding:40px 20px; margin-top:60px; border-top:1px solid {border_color}; }}
    .footer-text  {{ color:{text_secondary} !important; font-size:0.9rem; }}
    .footer-badge {{
        display:inline-flex; align-items:center; gap:8px; background:{bg_card};
        border:1px solid {border_color}; padding:10px 20px; border-radius:50px;
        margin-top:15px; font-size:0.85rem; color:{text_primary} !important;
    }}

    [data-testid="stSidebarNav"] {{ display: none !important; }}
    #MainMenu {{visibility:hidden;}} footer {{visibility:hidden;}}

    @media (max-width:768px) {{
        .hero-title {{ font-size:2.2rem; }}
        .hero-subtitle {{ font-size:1.1rem; }}
        .features-grid {{ grid-template-columns:1fr; }}
    }}
    </style>
    """, unsafe_allow_html=True)


def render_sidebar():
    """
    Renders the shared sidebar on every page.
    Theme/language are saved to URL query params so they persist across page navigation.
    """
    try:
        current = st.context.headers.get("Referer", "")
    except Exception:
        current = ""

    def _on_theme_change():
        st.session_state["theme"] = st.session_state["_theme_radio"]
        st.query_params["theme"] = st.session_state["theme"]
        st.query_params["language"] = st.session_state["language"]

    def _on_lang_change():
        st.session_state["language"] = st.session_state["_lang_select"]
        st.query_params["theme"] = st.session_state["theme"]
        st.query_params["language"] = st.session_state["language"]

    with st.sidebar:
        # ── App title ──
        st.markdown(f"### {T('nav_title')}")
        st.markdown("---")

        # ── Navigation links ──
        st.markdown('<div class="nav-section-title">Navigation</div>', unsafe_allow_html=True)

        pages = [
            ("nav_home",         "/"),
            ("nav_symptom",      "/symptom_checker"),
            ("nav_appointment",  "/doctor_appointment"),
            ("nav_medicine",     "/medicine_remainders"),
            ("nav_records",      "/health_records"),
            ("nav_prescription", "/prescription_scanner"),
            ("nav_emergency",    "/emergency_help"),
        ]

        # Carry theme+language in every nav link so they persist on click
        theme_param    = st.session_state.get("theme", "Light")
        language_param = st.session_state.get("language", "English")

        for key, path in pages:
            is_active = path in current or (path == "/" and current.endswith(":8501/"))
            css_class = "nav-link active" if is_active else "nav-link"
            href = f"{path}?theme={theme_param}&language={language_param}"
            st.markdown(
                f'<a href="{href}" target="_self" class="{css_class}">{T(key)}</a>',
                unsafe_allow_html=True
            )

        st.markdown("---")

        # ── Settings ──
        st.markdown(f"### {T('settings')}")

        st.radio(
            T("theme_label"),
            ["Light", "Dark"],
            horizontal=True,
            index=["Light", "Dark"].index(st.session_state["theme"]),
            key="_theme_radio",
            on_change=_on_theme_change,
        )

        st.markdown("")

        lang_options = ["English", "हिंदी", "ಕನ್ನಡ", "தமிழ்", "తెలుగు"]
        st.selectbox(
            T("language_label"),
            lang_options,
            index=lang_options.index(st.session_state["language"]),
            key="_lang_select",
            on_change=_on_lang_change,
        )

        st.markdown("---")

        # ── Quick Stats ──
        st.markdown(f"### {T('quick_stats')}")
        st.metric(T("users_served"),  "12,450+", "+340 today")
        st.metric(T("consultations"), "8,920",   "+89 this week")
        st.metric(T("villages"),      "156",     "+12 new")
        st.markdown(
            f'<p class="stats-disclaimer">{T("stats_disclaimer")}</p>',
            unsafe_allow_html=True,
        )