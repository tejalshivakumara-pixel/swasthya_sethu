import streamlit as st

# ─────────────────────────────────────────────────────────────
# COMPREHENSIVE MULTI-LANGUAGE TRANSLATIONS
# ─────────────────────────────────────────────────────────────
TRANSLATIONS = {
    "English": {
        "settings": "⚙️ Settings & Privacy",
        "theme_label": "🎨 Theme",
        "language_label": "🌐 Language",
        "navigation": "Navigation",
        # Sidebar nav
        "nav_title": "Swasthya Setu",
        "nav_home": "Dashboard",
        "nav_symptom": "AI Symptom Checker",
        "nav_appointment": "Doctor Appointments",
        "nav_medicine": "Medicine Reminders",
        "nav_records": "Health Records",
        "nav_prescription": "Prescription Scanner",
        "nav_emergency": "Emergency Help",
        "nav_login": "Login",
        "nav_signup": "Sign Up",
        # Hero & Landing Page
        "hero_title": "🏥 Swasthya Setu",
        "hero_subtitle": "AI-Powered Rural Healthcare Accessibility Platform",
        "tag_accessible": "✨ Accessible",
        "tag_ai": "🤖 AI-Powered",
        "tag_fast": "⚡ Fast",
        "tag_rural": "🌾 Rural-Friendly",
        "tag_offline": "📴 Offline Support",
        "daily_tips_title": "💡 Daily Health Tips",
        "platform_features": "🚀 Platform Features",
        "feat_ai_title": "AI Symptom Checker",
        "feat_ai_desc": "Describe symptoms in your language and get instant preliminary health insights",
        "feat_appt_title": "Doctor Appointments",
        "feat_appt_desc": "Book consultations with verified doctors near you or via telemedicine",
        "feat_emergency_title": "Emergency Help",
        "feat_emergency_desc": "One-tap emergency assistance with ambulance and hospital contacts",
        "feat_medicine_title": "Medicine Reminders",
        "feat_medicine_desc": "Never miss a dose with smart medication scheduling",
        "feat_records_title": "Health Records",
        "feat_records_desc": "Securely store and access your medical history anytime",
        "feat_prescription_title": "Prescription Scanner",
        "feat_prescription_desc": "Upload images for AI-powered medicine identification",
        "welcome_title": "👋 Welcome to Swasthya Setu",
        "welcome_desc": """
Use the navigation sidebar to access healthcare tools and services. Swasthya Setu brings quality healthcare to your fingertips — whether you're in a village or a city.

**Getting Started:**
1. Pick a healthcare service from the navigation sidebar
2. Follow the simple steps in each page
3. Store and access medical reports anytime

Need help? Each page guides you step by step.
""",
        "footer_text": "💙 Technology for Better Healthcare",
    },
    "हिंदी": {
        "settings": "⚙️ सेटिंग्स और गोपनीयता",
        "theme_label": "🎨 थीम",
        "language_label": "🌐 भाषा",
        "navigation": "नेविगेशन",
        "nav_title": "स्वास्थ्य सेतु",
        "nav_home": "डैशबोर्ड",
        "nav_symptom": "AI लक्षण जाँचकर्ता",
        "nav_appointment": "डॉक्टर अपॉइंटमेंट",
        "nav_medicine": "दवा अनुस्मारक",
        "nav_records": "स्वास्थ्य रिकॉर्ड",
        "nav_prescription": "पर्चा स्कैनर",
        "nav_emergency": "आपातकालीन सहायता",
        "nav_login": "लॉग इन",
        "nav_signup": "साइन अप",
        "hero_title": "🏥 स्वास्थ्य सेतु",
        "hero_subtitle": "एआई-संचालित ग्रामीण स्वास्थ्य सेवा मंच",
        "tag_accessible": "✨ सुलभ",
        "tag_ai": "🤖 एआई-संचालित",
        "tag_fast": "⚡ तेज़",
        "tag_rural": "🌾 ग्रामीण-अनुकूल",
        "tag_offline": "📴 ऑफ़लाइन सहायता",
        "daily_tips_title": "💡 दैनिक स्वास्थ्य सुझाव",
        "platform_features": "🚀 प्लेटफॉर्म की विशेषताएं",
        "feat_ai_title": "एआई लक्षण जाँचकर्ता",
        "feat_ai_desc": "अपनी भाषा में लक्षणों का वर्णन करें और तुरंत स्वास्थ्य अंतर्दृष्टि प्राप्त करें",
        "feat_appt_title": "डॉक्टर अपॉइंटमेंट",
        "feat_appt_desc": "अपने पास के डॉक्टरों के साथ परामर्श बुक करें",
        "feat_emergency_title": "आपातकालीन सहायता",
        "feat_emergency_desc": "एंबुलेंस और अस्पताल संपर्कों के साथ आपातकालीन सहायता",
        "feat_medicine_title": "दवा अनुस्मारक",
        "feat_medicine_desc": "स्मार्ट दवा समय-सारणी के साथ खुराक कभी न चूकें",
        "feat_records_title": "स्वास्थ्य रिकॉर्ड",
        "feat_records_desc": "अपना चिकित्सा इतिहास सुरक्षित रूप से संग्रहीत करें",
        "feat_prescription_title": "पर्चा स्कैनर",
        "feat_prescription_desc": "दवा की पहचान के लिए चित्र अपलोड करें",
        "welcome_title": "👋 स्वास्थ्य सेतु में आपका स्वागत है",
        "welcome_desc": "स्वास्थ्य सेवाओं तक पहुँचने के लिए नेविगेशन बार का उपयोग करें।",
        "footer_text": "💙 बेहतर स्वास्थ्य सेवा के लिए प्रौद्योगिकी",
    },
    "ಕನ್ನಡ": {
        "settings": "⚙️ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
        "theme_label": "🎨 ಥೀಮ್",
        "language_label": "🌐 ಭಾಷೆ",
        "navigation": "ನ್ಯಾವಿಗೇಷನ್",
        "nav_title": "ಸ್ವಾಸ್ಥ್ಯ ಸೇತು",
        "nav_home": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        "nav_symptom": "AI ರೋಗಲಕ್ಷಣ ಪರೀಕ್ಷಕ",
        "nav_appointment": "ವೈದ್ಯರ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್",
        "nav_medicine": "ಔಷಧ ಜ್ಞಾಪನೆಗಳು",
        "nav_records": "ಆರೋಗ್ಯ ದಾಖಲೆಗಳು",
        "nav_prescription": "ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಸ್ಕ್ಯಾನರ್",
        "nav_emergency": "ತುರ್ತು ಸಹಾಯ",
        "nav_login": "ಲಾಗಿನ್",
        "nav_signup": "ಸೈನ್ ಅಪ್",
        "hero_title": "🏥 ಸ್ವಾಸ್ಥ್ಯ ಸೇತು",
        "hero_subtitle": "ಎಐ-ಆಧಾರಿತ ಗ್ರಾಮೀಣ ಆರೋಗ್ಯ ಸೇವಾ ವೇದಿಕೆ",
        "tag_accessible": "✨ ಸುಲಭ ಲಭ್ಯ",
        "tag_ai": "🤖 ಎಐ-ಚಾಲಿತ",
        "tag_fast": "⚡ ವೇಗವಾದ",
        "tag_rural": "🌾 ಗ್ರಾಮೀಣ-ಸ್ನೇಹಿ",
        "tag_offline": "📴 ಆಫ್‌ಲೈನ್ ಬೆಂಬಲ",
        "daily_tips_title": "💡 ದೈನಂದಿನ ಆರೋಗ್ಯ ಸಲಹೆಗಳು",
        "platform_features": "🚀 ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ವೈಶಿಷ್ಟ್ಯಗಳು",
        "feat_ai_title": "ಎಐ ರೋಗಲಕ್ಷಣ ಪರೀಕ್ಷಕ",
        "feat_ai_desc": "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ ಮತ್ತು ತಕ್ಷಣದ ಆರೋಗ್ಯ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಿರಿ",
        "feat_appt_title": "ವೈದ್ಯರ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್",
        "feat_appt_desc": "ನಿಮ್ಮ ಹತ್ತಿರದ ಪ್ರಮಾಣೀಕೃತ ವೈದ್ಯರೊಂದಿಗೆ ಸಮಾಲೋಚನೆ ಕಾಯ್ದಿರಿಸಿ",
        "feat_emergency_title": "ತುರ್ತು ಸಹಾಯ",
        "feat_emergency_desc": "ಆಂಬ್ಯುಲೆನ್ಸ್ ಮತ್ತು ಆಸ್ಪತ್ರೆ ಸಂಪರ್ಕಗಳೊಂದಿಗೆ ತಕ್ಷಣದ ಸಹಾಯ",
        "feat_medicine_title": "ಔಷಧ ಜ್ಞಾಪನೆಗಳು",
        "feat_medicine_desc": "ಔಷಧ ವೇಳಾಪಟ್ಟಿಯೊಂದಿಗೆ ಡೋಸ್ ತಪ್ಪಿಸಬೇಡಿ",
        "feat_records_title": "ಆರೋಗ್ಯ ದಾಖಲೆಗಳು",
        "feat_records_desc": "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸವನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹಿಸಿ",
        "feat_prescription_title": "ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಸ್ಕ್ಯಾನರ್",
        "feat_prescription_desc": "ಔಷಧ ಗುರುತಿಸುವಿಕೆಗಾಗಿ ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
        "welcome_title": "👋 ಸ್ವಾಸ್ಥ್ಯ ಸೇತುಗೆ ಸುಸ್ವಾಗತ",
        "welcome_desc": "ಆರೋಗ್ಯ ಸೇವೆಗಳನ್ನು ಪಡೆಯಲು ನ್ಯಾವಿಗೇಷನ್ ಬಾರ್ ಬಳಸಿ.",
        "footer_text": "💙 ಉತ್ತಮ ಆರೋಗ್ಯ ಸೇವೆಗಾಗಿ ತಂತ್ರಜ್ಞಾನ",
    },
    "தமிழ்": {
        "settings": "⚙️ அமைப்புகள்",
        "theme_label": "🎨 தீம்",
        "language_label": "🌐 மொழி",
        "navigation": "வழிசெலுத்தல்",
        "nav_title": "ஸ்வாஸ்த்ய சேது",
        "nav_home": "முகப்பு",
        "nav_symptom": "அறிகுறி சரிபார்ப்பாளர்",
        "nav_appointment": "மருத்துவர் சந்திப்பு",
        "nav_medicine": "மருந்து நினைவூட்டல்",
        "nav_records": "சுகாதார பதிவுகள்",
        "nav_prescription": "மருந்துசீட்டு ஸ்கேனர்",
        "nav_emergency": "அவசர உதவி",
        "nav_login": "உள்நுழைவு",
        "nav_signup": "பதிவுபெறு",
        "hero_title": "🏥 ஸ்வாஸ்த்ய சேது",
        "hero_subtitle": "AI இயங்கும் கிராமப்புற சுகாதார தளம்",
        "tag_accessible": "✨ அணுகக்கூடியது",
        "tag_ai": "🤖 AI-இயங்கும்",
        "tag_fast": "⚡ வேகமானது",
        "tag_rural": "🌾 கிராமப்புற நட்பு",
        "tag_offline": "📴 ஆஃப்லைன் ஆதரவு",
        "daily_tips_title": "💡 தினசரி சுகாதார குறிப்புகள்",
        "platform_features": "🚀 தளத்தின் அம்சங்கள்",
        "feat_ai_title": "அறிகுறி சரிபார்ப்பாளர்",
        "feat_ai_desc": "உங்கள் மொழியில் அறிகுறிகளை விவரிக்கவும்",
        "feat_appt_title": "மருத்துவர் சந்திப்பு",
        "feat_appt_desc": "மருத்துவர்களுடன் ஆலோசனைகளை பதிவு செய்யுங்கள்",
        "feat_emergency_title": "அவசர உதவி",
        "feat_emergency_desc": "அவசர ஆம்புலன்ஸ் உதவி",
        "feat_medicine_title": "மருந்து நினைவூட்டல்",
        "feat_medicine_desc": "மருந்து அளவை தவறவிடாதீர்கள்",
        "feat_records_title": "சுகாதார பதிவுகள்",
        "feat_records_desc": "உங்கள் மருத்துவ வரலாற்றைப் பாதுகாப்பாக சேமிக்கவும்",
        "feat_prescription_title": "மருந்துசீட்டு ஸ்கேனர்",
        "feat_prescription_desc": "மருந்து அடையாளத்திற்காக படங்களை பதிவேற்றவும்",
        "welcome_title": "👋 ஸ்வாஸ்த்ய சேதுவிற்கு நல்வரவு",
        "welcome_desc": "சுகாதார சேவைகளைப் பெற வழிசெலுத்தல் பட்டியைப் பயன்படுத்தவும்.",
        "footer_text": "💙 சிறந்த சுகாதாரத்திற்கான தொழில்நுட்பம்",
    },
    "తెలుగు": {
        "settings": "⚙️ సెట్టింగ్‌లు",
        "theme_label": "🎨 టీమ్",
        "language_label": "🌐 భాష",
        "navigation": "నేవిగేషన్",
        "nav_title": "స్వాస్థ్య సేతు",
        "nav_home": "హోమ్",
        "nav_symptom": "లక్షణ పరీక్షకుడు",
        "nav_appointment": "డాక్టర్ అపాయింట్‌మెంట్",
        "nav_medicine": "మందు గుర్తుచేపులు",
        "nav_records": "ఆరోగ్య రికార్డులు",
        "nav_prescription": "ప్రిస్క్రిప్షన్ స్కానర్",
        "nav_emergency": "అత్యవసర సహాయం",
        "nav_login": "లాగిన్",
        "nav_signup": "సైన్ అప్",
        "hero_title": "🏥 స్వాస్థ్య సేతు",
        "hero_subtitle": "AI-సమర్థవంతమైన గ్రామీణ ఆరోగ్య సంరక్షణ ప్లాట్‌ఫారమ్",
        "tag_accessible": "✨ అందుబాటులో ఉంది",
        "tag_ai": "🤖 AI-సమర్థవంతమైన",
        "tag_fast": "⚡ వేగవంతమైనది",
        "tag_rural": "🌾 గ్రామీణ అనుకూల",
        "tag_offline": "📴 ఆఫ్‌లైన్ మద్దతు",
        "daily_tips_title": "💡 రోజువారీ ఆరోగ్య చిట్కాలు",
        "platform_features": "🚀 ప్లాట్‌ఫారమ్ ఫీచర్లు",
        "feat_ai_title": "లక్షణ పరీక్షకుడు",
        "feat_ai_desc": "మీ భాషలో లక్షణాలను వివరించండి",
        "feat_appt_title": "డాక్టర్ అపాయింట్‌మెంట్",
        "feat_appt_desc": "డాక్టర్లతో సంప్రదింపులు బుక్ చేయండి",
        "feat_emergency_title": "అత్యవసర సహాయం",
        "feat_emergency_desc": "ఆంబులెన్స్ సహాయం",
        "feat_medicine_title": "మందు గుర్తుచేపులు",
        "feat_medicine_desc": "మందుల మోతాదును కోల్పోకండి",
        "feat_records_title": "ఆరోగ్య రికార్డులు",
        "feat_records_desc": "మీ వైద్య చరిత్రను సురక్షితంగా నిల్వ చేయండి",
        "feat_prescription_title": "ప్రిస్క్రిప్షన్ స్కానర్",
        "feat_prescription_desc": "మందుల గుర్తింపు కోసం చిత్రాలను అప్‌లోడ్ చేయండి",
        "welcome_title": "👋 స్వాస్థ్య సేతుకి సుస్వాగతం",
        "welcome_desc": "ఆరోగ్య సేవలను పొందడానికి నేవిగేషన్ బార్‌ను ఉపయోగించండి.",
        "footer_text": "💙 మెరుగైన ఆరోగ్య సంరక్షణ కోసం సాంకేతికత",
    },
}


def T(key):
    lang = st.session_state.get("language", "English")
    lang_dict = TRANSLATIONS.get(lang, TRANSLATIONS["English"])
    return lang_dict.get(key, TRANSLATIONS["English"].get(key, key))


def init_session():
    """Call at the top of every page to ensure session defaults exist."""
    params = st.query_params

    if "user_id" not in st.session_state:
        st.session_state["user_id"] = None

    if "user_name" not in st.session_state:
        st.session_state["user_name"] = None

    if "theme" not in st.session_state:
        st.session_state["theme"] = params.get("theme", "Light")
    else:
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
    bg_primary     = "#090d16" if dark else "#f8fafc"
    bg_secondary   = "#0f172a" if dark else "#ffffff"
    bg_card        = "#1e293b" if dark else "#ffffff"
    text_primary   = "#f8fafc" if dark else "#0f172a"
    text_secondary = "#94a3b8" if dark else "#64748b"
    border_color   = "#1e293b" if dark else "#e2e8f0"
    shadow         = "0 4px 20px rgba(0,0,0,0.3)" if dark else "0 4px 20px rgba(0,0,0,0.06)"

    st.markdown(f"""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    .stApp {{ background: {bg_primary}; font-family: 'Plus Jakarta Sans', sans-serif; }}

    h1,h2,h3,h4,h5,h6 {{ font-family:'Plus Jakarta Sans',sans-serif !important; color:{text_primary} !important; font-weight:700 !important; }}
    p,span,label,.stMarkdown {{ color:{text_primary} !important; }}
    .stTextInput label,.stSelectbox label,.stTextArea label {{ color:{text_primary} !important; font-weight:600 !important; }}

    /* Hero Banner Gradient Box */
    .hero-container {{
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%);
        border-radius: 28px;
        padding: 48px 30px;
        text-align: center;
        margin-bottom: 30px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 12px 35px rgba(99, 102, 241, 0.3);
    }}
    .hero-title {{
        font-size: 3.2rem;
        font-weight: 800;
        color: white !important;
        margin-bottom: 12px;
        line-height: 1.1;
    }}
    .hero-subtitle {{
        font-size: 1.3rem;
        color: rgba(255,255,255,0.92) !important;
        font-weight: 500;
        margin-bottom: 24px;
    }}
    .hero-tags {{
        display: flex;
        justify-content: center;
        gap: 12px;
        flex-wrap: wrap;
    }}
    .hero-tag {{
        background: rgba(255,255,255,0.22);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        padding: 8px 20px;
        border-radius: 50px;
        color: white !important;
        font-size: 0.9rem;
        font-weight: 600;
        border: 1px solid rgba(255,255,255,0.3);
    }}

    /* Features Grid */
    .features-grid {{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-bottom: 30px;
    }}
    .feature-card {{
        background: {bg_card};
        border: 1px solid {border_color};
        border-radius: 20px;
        padding: 24px;
        transition: all 0.3s ease;
        box-shadow: {shadow};
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 170px;
        box-sizing: border-box;
    }}
    .feature-card:hover {{
        transform: translateY(-5px);
        box-shadow: 0 12px 30px rgba(59,130,246,0.15);
        border-color: #3b82f6;
    }}
    .feature-icon {{
        font-size: 2.4rem;
        margin-bottom: 12px;
        line-height: 1;
    }}
    .feature-title {{
        font-size: 1.1rem;
        font-weight: 700;
        color: {text_primary} !important;
        margin-bottom: 8px;
    }}
    .feature-desc {{
        font-size: 0.88rem;
        color: {text_secondary} !important;
        line-height: 1.5;
        flex: 1;
    }}

    .section-header {{
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 32px 0 20px 0;
    }}
    .section-header h2 {{
        margin: 0;
        font-size: 1.8rem;
    }}
    .section-line {{
        flex: 1;
        height: 2px;
        background: linear-gradient(90deg, #3b82f6, transparent);
        border-radius: 2px;
    }}
    .service-container {{
        background: {bg_card};
        border: 1px solid {border_color};
        border-radius: 20px;
        padding: 28px;
        box-shadow: {shadow};
    }}

    /* Custom Modern Sidebar */
    section[data-testid="stSidebar"] {{
        background: {bg_secondary} !important;
        border-right: 1px solid {border_color} !important;
        padding-top: 1rem !important;
    }}

    .sidebar-brand {{
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        margin-bottom: 16px;
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(5,150,105,0.15) 0%, rgba(13,148,136,0.1) 100%);
        border: 1px solid rgba(5,150,105,0.2);
    }}
    .sidebar-brand-icon {{
        width: 36px; height: 36px;
        border-radius: 10px;
        background: linear-gradient(135deg, #059669, #0d9488);
        color: white;
        display: flex; align-items: center; justify-content: center;
        font-weight: 800; font-size: 18px;
        box-shadow: 0 4px 12px rgba(5,150,105,0.3);
    }}
    .sidebar-brand-text {{
        font-size: 17px; font-weight: 800; color: {text_primary};
        line-height: 1.1;
    }}
    .sidebar-brand-sub {{
        font-size: 10px; text-transform: uppercase; tracking: 0.05em;
        color: #059669; font-weight: 700;
    }}

    .nav-link {{
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        padding: 10px 14px !important;
        border-radius: 12px !important;
        color: {text_primary} !important;
        text-decoration: none !important;
        font-size: 0.92rem !important;
        font-weight: 600 !important;
        margin-bottom: 6px !important;
        transition: all 0.2s ease !important;
        border-bottom: none !important;
    }}
    .nav-link:hover {{
        background: rgba(5,150,105,0.15) !important;
        color: #059669 !important;
        text-decoration: none !important;
    }}
    .nav-link.active {{
        background: #059669 !important;
        color: white !important;
        text-decoration: none !important;
        box-shadow: 0 4px 14px rgba(5,150,105,0.3) !important;
    }}

    .nav-section-title {{
        font-size: 0.72rem;
        font-weight: 800;
        color: {text_secondary} !important;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        padding: 8px 12px 6px 12px;
        margin-top: 12px;
    }}

    .user-pill {{
        background: rgba(5,150,105,0.12);
        border: 1px solid rgba(5,150,105,0.2);
        border-radius: 12px;
        padding: 10px 14px;
        margin-bottom: 12px;
        font-weight: 600;
        color: {text_primary};
        display: flex; align-items: center; gap: 8px;
    }}

    .stButton>button {{
        background: linear-gradient(135deg,#059669 0%,#0d9488 100%);
        color: white !important; border: none; border-radius: 12px; padding: 10px 24px;
        font-weight: 700; font-size: 0.92rem; transition: all 0.2s ease;
        box-shadow: 0 4px 15px rgba(5,150,105,0.25);
    }}
    .stButton>button:hover {{ transform: translateY(-2px); box-shadow: 0 6px 20px rgba(5,150,105,0.35); }}

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
    Renders the shared Swasthya Setu sidebar on every page with active language switching.
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
        st.rerun()

    with st.sidebar:
        # ── Brand Header ──
        st.markdown(f"""
        <div class="sidebar-brand">
            <div class="sidebar-brand-icon">❤️</div>
            <div>
                <div class="sidebar-brand-text">{T("nav_title")}</div>
                <div class="sidebar-brand-sub">Health Portal</div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        # ── Simple Navigation Section ──
        st.markdown(f'<div class="nav-section-title">{T("navigation")}</div>', unsafe_allow_html=True)

        theme_param    = st.session_state.get("theme", "Light")
        language_param = st.session_state.get("language", "English")

        nav_pages = [
            ("nav_home", "/", "🏠"),
            ("nav_symptom", "/symptom_checker", "🤖"),
            ("nav_appointment", "/doctor_appointment", "📅"),
            ("nav_medicine", "/medicine_remainders", "💊"),
            ("nav_records", "/health_records", "🗂️"),
            ("nav_prescription", "/prescription_scanner", "📷"),
            ("nav_emergency", "/emergency_help", "🚨"),
        ]

        # Add Login and Sign Up links if user is NOT logged in
        if not st.session_state.get("user_id"):
            nav_pages.extend([
                ("nav_login", "/login", "🔑"),
                ("nav_signup", "/signup", "📝"),
            ])

        for key, path, icon in nav_pages:
            is_active = path in current or (path == "/" and current.endswith(":8501/"))
            css_class = "nav-link active" if is_active else "nav-link"
            href = f"{path}?theme={theme_param}&language={language_param}"
            st.markdown(
                f'<a href="{href}" target="_self" class="{css_class}">{icon} {T(key)}</a>',
                unsafe_allow_html=True
            )

        st.markdown("---")

        # ── User Profile Pill & Logout button if logged in ──
        if st.session_state.get("user_id") or st.session_state.get("user_name"):
            user_disp = st.session_state.get("user_name", "Tejal S")
            st.markdown(f'<div class="user-pill">👤 {user_disp}</div>', unsafe_allow_html=True)
            if st.button("Log out"):
                st.session_state.pop("user_id", None)
                st.session_state.pop("user_name", None)
                st.switch_page("pages/login.py")

        # ── Settings & Language Selector ──
        st.markdown(f"### {T('settings')}")

        st.radio(
            T("theme_label"),
            ["Light", "Dark"],
            horizontal=True,
            index=["Light", "Dark"].index(st.session_state["theme"]),
            key="_theme_radio",
            on_change=_on_theme_change,
        )

        lang_options = ["English", "हिंदी", "ಕನ್ನಡ", "தமிழ்", "తెలుగు"]
        st.selectbox(
            T("language_label"),
            lang_options,
            index=lang_options.index(st.session_state["language"]),
            key="_lang_select",
            on_change=_on_lang_change,
        )