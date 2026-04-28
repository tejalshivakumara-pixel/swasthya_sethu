import streamlit as st
import time

st.set_page_config(
    page_title="Swasthya Setu",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ─────────────────────────────────────────────────────────────
# SESSION STATE — initialize ONLY if not already set
# ─────────────────────────────────────────────────────────────
if "theme" not in st.session_state:
    st.session_state["theme"] = "Light"
if "language" not in st.session_state:
    st.session_state["language"] = "English"

# ─────────────────────────────────────────────────────────────
# TRANSLATIONS
# ─────────────────────────────────────────────────────────────
TRANSLATIONS = {
    "English": {
        "hero_title": "🏥 Swasthya Setu",
        "hero_subtitle": "AI-Powered Rural Healthcare Accessibility Platform",
        "tag_accessible": "✨ Accessible",
        "tag_ai": "🤖 AI-Powered",
        "tag_fast": "⚡ Fast",
        "tag_rural": "🌾 Rural-Friendly",
        "tag_offline": "📴 Offline Support",
        "platform_features": "🚀 Platform Features",
        "quick_access": "⚡ Quick Access",
        "select_service": "Select a service to get started",
        "settings": "⚙️ Settings",
        "theme_label": "🎨 Theme",
        "language_label": "🌐 Language",
        "quick_stats": "📊 Quick Stats",
        "users_served": "⭐ Users Served",
        "consultations": "⭐ Consultations",
        "villages": "⭐ Villages Covered",
        "stats_disclaimer": "⭐ These statistics are for visual/demo purposes only and do not reflect real data.",
        "service_home": "🏠 Home",
        "service_symptom": "🤖 AI Symptom Checker",
        "service_appointment": "📅 Book Appointment",
        "service_pharmacy": "💉 Find Pharmacy",
        "service_upload": "📷 Upload Prescription",
        "service_emergency": "🚑 Emergency Help",
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
        "feat_pharmacy_title": "Nearby Pharmacies",
        "feat_pharmacy_desc": "Locate pharmacies with real-time medicine availability",
        "feat_multilingual_title": "Multilingual",
        "feat_multilingual_desc": "Full support for Hindi, Kannada, Tamil, Telugu, and more",
        "symptom_title": "### 🤖 AI Symptom Checker",
        "symptom_desc": "Describe your symptoms in detail and our AI will provide preliminary insights.",
        "symptom_input_label": "Describe your symptoms",
        "symptom_placeholder": "E.g., I have had a headache and mild fever for 2 days...",
        "age_label": "Age",
        "gender_label": "Gender",
        "gender_options": ["Male", "Female", "Other"],
        "analyze_btn": "🔍 Analyze Symptoms",
        "analyzing": "Analyzing symptoms...",
        "analysis_complete": "**Analysis Complete**",
        "analysis_result": """
**Possible Conditions:**
- Common Cold / Viral Fever (High probability)
- Tension Headache (Medium probability)

**Recommended Actions:**
1. Rest and stay hydrated
2. Monitor temperature regularly
3. Consult a doctor if symptoms persist beyond 3 days

⚠️ *This is not a medical diagnosis. Please consult a healthcare professional.*
""",
        "symptom_warning": "Please describe your symptoms first.",
        "appt_title": "### 📅 Book Doctor Appointment",
        "patient_name": "Patient Name",
        "patient_placeholder": "Enter full name",
        "phone_label": "Phone Number",
        "phone_placeholder": "+91 XXXXXXXXXX",
        "date_label": "Preferred Date",
        "specialty_label": "Specialty",
        "specialty_options": ["General Physician", "Pediatrics", "Gynecology", "Orthopedics", "Dermatology", "ENT", "Cardiology"],
        "mode_label": "Consultation Mode",
        "mode_options": ["In-Person", "Video Call"],
        "time_label": "Time Slot",
        "time_options": ["9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "2:00 PM - 3:00 PM", "4:00 PM - 5:00 PM"],
        "confirm_btn": "✅ Confirm Booking",
        "appt_success": "**Appointment Confirmed!** 🎉",
        "appt_warning": "Please fill in all required fields.",
        "pharmacy_title": "### 💉 Find Nearby Pharmacy",
        "medicine_label": "Medicine Name",
        "medicine_placeholder": "Enter medicine name to search",
        "location_label": "Your Location",
        "location_placeholder": "Enter village/town name or PIN code",
        "search_btn": "🔍 Search Pharmacies",
        "searching": "Searching nearby pharmacies...",
        "pharmacy_found": "**3 pharmacies found with availability**",
        "pharmacy_warning": "Please enter a medicine name.",
        "upload_title": "### 📷 Upload Prescription / Report",
        "upload_desc": "Upload an image of your prescription or medical report for AI analysis.",
        "upload_label": "Drag and drop or click to upload",
        "analyzing_doc": "Analyzing document...",
        "upload_complete": "**Analysis Complete**",
        "upload_result": """
**Detected Medicines:**
- Paracetamol 500mg - Twice daily
- Cetirizine 10mg - Once at night
- Vitamin C 500mg - Once daily

**Reminders Set:** ✅

**Nearby Availability:** 3 pharmacies have all medicines in stock.
""",
        "emergency_title": "### 🚑 Emergency Assistance",
        "emergency_desc": "Get immediate help in medical emergencies.",
        "emergency_warning": "⚠️ If this is a life-threatening emergency, call **112** immediately.",
        "emergency_contacts": """
**Emergency Contacts:**
- 🚑 Ambulance: **108**
- 🏥 Emergency: **112**
- 🩸 Blood Bank: **104**
""",
        "nearest_hospital": """
**Nearest Hospital:**
- 🏥 District Hospital
- 📍 3.2 km away
- ☎️ +91 80 XXXX XXXX
""",
        "emergency_btn": "🚨 Request Emergency Ambulance",
        "emergency_sent": """
**Emergency Request Sent!**

📍 Your location has been shared with the nearest ambulance service.
🚑 Estimated arrival: 8-12 minutes

Stay calm. Keep this screen open.
""",
        "welcome_title": "### 👋 Welcome to Swasthya Setu",
        "welcome_desc": """
Select a service from the dropdown above to get started. Swasthya Setu brings 
quality healthcare to your fingertips — whether you're in a village or a city.

**Getting Started:**
1. Choose your preferred language from the sidebar
2. Select a service you need
3. Follow the simple steps

Need help? Our AI assistant is always available to guide you.
""",
        "footer_text": "Built with ❤️ for rural India",
        "footer_badge": "🌍 Google Solution Challenge 2025 | SDG 3 — Good Health and Well-being",
    },
    "हिंदी": {
        "hero_title": "🏥 स्वास्थ्य सेतु",
        "hero_subtitle": "AI-संचालित ग्रामीण स्वास्थ्य सेवा मंच",
        "tag_accessible": "✨ सुलभ",
        "tag_ai": "🤖 AI-संचालित",
        "tag_fast": "⚡ तेज़",
        "tag_rural": "🌾 ग्रामीण-अनुकूल",
        "tag_offline": "📴 ऑफलाइन सहायता",
        "platform_features": "🚀 प्लेटफ़ॉर्म विशेषताएं",
        "quick_access": "⚡ त्वरित पहुँच",
        "select_service": "शुरू करने के लिए सेवा चुनें",
        "settings": "⚙️ सेटिंग्स",
        "theme_label": "🎨 थीम",
        "language_label": "🌐 भाषा",
        "quick_stats": "📊 त्वरित आँकड़े",
        "users_served": "⭐ सेवित उपयोगकर्ता",
        "consultations": "⭐ परामर्श",
        "villages": "⭐ कवर किए गए गाँव",
        "stats_disclaimer": "⭐ ये आँकड़े केवल डेमो के लिए हैं।",
        "service_home": "🏠 होम",
        "service_symptom": "🤖 AI लक्षण जाँचकर्ता",
        "service_appointment": "📅 अपॉइंटमेंट बुक करें",
        "service_pharmacy": "💉 दवाखाना खोजें",
        "service_upload": "📷 पर्चा अपलोड करें",
        "service_emergency": "🚑 आपातकालीन सहायता",
        "feat_ai_title": "AI लक्षण जाँचकर्ता",
        "feat_ai_desc": "अपनी भाषा में लक्षण बताएं और तत्काल स्वास्थ्य जानकारी पाएं",
        "feat_appt_title": "डॉक्टर अपॉइंटमेंट",
        "feat_appt_desc": "नज़दीकी सत्यापित डॉक्टरों से परामर्श बुक करें",
        "feat_emergency_title": "आपातकालीन सहायता",
        "feat_emergency_desc": "एक टैप में एम्बुलेंस और अस्पताल से सहायता",
        "feat_medicine_title": "दवा अनुस्मारक",
        "feat_medicine_desc": "स्मार्ट दवा शेड्यूलिंग से कोई खुराक न चूकें",
        "feat_records_title": "स्वास्थ्य रिकॉर्ड",
        "feat_records_desc": "अपना चिकित्सा इतिहास सुरक्षित रखें",
        "feat_prescription_title": "पर्चा स्कैनर",
        "feat_prescription_desc": "AI द्वारा दवा पहचान के लिए छवि अपलोड करें",
        "feat_pharmacy_title": "नज़दीकी दवाखाने",
        "feat_pharmacy_desc": "रियल-टाइम दवा उपलब्धता के साथ दवाखाने खोजें",
        "feat_multilingual_title": "बहुभाषी",
        "feat_multilingual_desc": "हिंदी, कन्नड़, तमिल, तेलुगु और अधिक का पूर्ण समर्थन",
        "symptom_title": "### 🤖 AI लक्षण जाँचकर्ता",
        "symptom_desc": "अपने लक्षण विस्तार से बताएं।",
        "symptom_input_label": "अपने लक्षण बताएं",
        "symptom_placeholder": "जैसे, मुझे 2 दिनों से सिरदर्द और हल्का बुखार है...",
        "age_label": "आयु",
        "gender_label": "लिंग",
        "gender_options": ["पुरुष", "महिला", "अन्य"],
        "analyze_btn": "🔍 लक्षण विश्लेषण करें",
        "analyzing": "लक्षण विश्लेषण हो रहा है...",
        "analysis_complete": "**विश्लेषण पूर्ण**",
        "analysis_result": """
**संभावित स्थितियाँ:**
- सामान्य सर्दी / वायरल बुखार (अधिक संभावना)
- तनाव सिरदर्द (मध्यम संभावना)

**अनुशंसित कार्य:**
1. आराम करें और पानी पिएं
2. तापमान नियमित रूप से जाँचें
3. 3 दिन से अधिक लक्षण रहने पर डॉक्टर से मिलें

⚠️ *यह चिकित्सा निदान नहीं है। कृपया डॉक्टर से परामर्श लें।*
""",
        "symptom_warning": "कृपया पहले अपने लक्षण बताएं।",
        "appt_title": "### 📅 डॉक्टर अपॉइंटमेंट बुक करें",
        "patient_name": "मरीज़ का नाम",
        "patient_placeholder": "पूरा नाम दर्ज करें",
        "phone_label": "फ़ोन नंबर",
        "phone_placeholder": "+91 XXXXXXXXXX",
        "date_label": "पसंदीदा तारीख",
        "specialty_label": "विशेषता",
        "specialty_options": ["सामान्य चिकित्सक", "बाल रोग", "स्त्री रोग", "हड्डी रोग", "त्वचा रोग", "ENT", "हृदय रोग"],
        "mode_label": "परामर्श मोड",
        "mode_options": ["व्यक्तिगत", "वीडियो कॉल"],
        "time_label": "समय स्लॉट",
        "time_options": ["9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "2:00 PM - 3:00 PM", "4:00 PM - 5:00 PM"],
        "confirm_btn": "✅ बुकिंग की पुष्टि करें",
        "appt_success": "**अपॉइंटमेंट की पुष्टि हो गई!** 🎉",
        "appt_warning": "कृपया सभी आवश्यक फ़ील्ड भरें।",
        "pharmacy_title": "### 💉 नज़दीकी दवाखाना खोजें",
        "medicine_label": "दवा का नाम",
        "medicine_placeholder": "खोजने के लिए दवा का नाम दर्ज करें",
        "location_label": "आपका स्थान",
        "location_placeholder": "गाँव/शहर का नाम या PIN कोड दर्ज करें",
        "search_btn": "🔍 दवाखाने खोजें",
        "searching": "नज़दीकी दवाखाने खोजे जा रहे हैं...",
        "pharmacy_found": "**3 दवाखाने उपलब्धता के साथ मिले**",
        "pharmacy_warning": "कृपया दवा का नाम दर्ज करें।",
        "upload_title": "### 📷 पर्चा / रिपोर्ट अपलोड करें",
        "upload_desc": "AI विश्लेषण के लिए अपना पर्चा या रिपोर्ट अपलोड करें।",
        "upload_label": "खींचें और छोड़ें या क्लिक करके अपलोड करें",
        "analyzing_doc": "दस्तावेज़ विश्लेषण हो रहा है...",
        "upload_complete": "**विश्लेषण पूर्ण**",
        "upload_result": """
**पहचानी गई दवाइयाँ:**
- पैरासिटामोल 500mg - दिन में दो बार
- सेटिरिज़िन 10mg - रात में एक बार
- विटामिन C 500mg - दिन में एक बार

**अनुस्मारक सेट:** ✅

**नज़दीकी उपलब्धता:** 3 दवाखानों में सभी दवाइयाँ उपलब्ध हैं।
""",
        "emergency_title": "### 🚑 आपातकालीन सहायता",
        "emergency_desc": "चिकित्सा आपात स्थिति में तत्काल सहायता प्राप्त करें।",
        "emergency_warning": "⚠️ यदि यह जानलेवा आपात स्थिति है, तो **112** पर तुरंत कॉल करें।",
        "emergency_contacts": """
**आपातकालीन संपर्क:**
- 🚑 एम्बुलेंस: **108**
- 🏥 आपातकाल: **112**
- 🩸 ब्लड बैंक: **104**
""",
        "nearest_hospital": """
**नज़दीकी अस्पताल:**
- 🏥 जिला अस्पताल
- 📍 3.2 किमी दूर
- ☎️ +91 80 XXXX XXXX
""",
        "emergency_btn": "🚨 आपातकालीन एम्बुलेंस मांगें",
        "emergency_sent": """
**आपातकालीन अनुरोध भेज दिया गया!**

📍 आपका स्थान निकटतम एम्बुलेंस सेवा के साथ साझा किया गया है।
🚑 अनुमानित आगमन: 8-12 मिनट

शांत रहें। यह स्क्रीन खुला रखें।
""",
        "welcome_title": "### 👋 स्वास्थ्य सेतु में आपका स्वागत है",
        "welcome_desc": """
ऊपर दिए गए ड्रॉपडाउन से सेवा चुनें। स्वास्थ्य सेतु गुणवत्तापूर्ण स्वास्थ्य सेवा आपकी उँगलियों पर लाता है।

**शुरुआत कैसे करें:**
1. साइडबार से अपनी पसंदीदा भाषा चुनें
2. आवश्यक सेवा चुनें
3. सरल चरणों का पालन करें

सहायता चाहिए? हमारा AI सहायक हमेशा उपलब्ध है।
""",
        "footer_text": "❤️ ग्रामीण भारत के लिए बनाया गया",
        "footer_badge": "🌍 गूगल सॉल्यूशन चैलेंज 2025 | SDG 3 — अच्छा स्वास्थ्य",
    },
    "ಕನ್ನಡ": {
        "hero_title": "🏥 ಸ್ವಾಸ್ಥ್ಯ ಸೇತು",
        "hero_subtitle": "AI-ಚಾಲಿತ ಗ್ರಾಮೀಣ ಆರೋಗ್ಯ ಸೇವಾ ವೇದಿಕೆ",
        "tag_accessible": "✨ ಸುಲಭ",
        "tag_ai": "🤖 AI-ಚಾಲಿತ",
        "tag_fast": "⚡ ವೇಗ",
        "tag_rural": "🌾 ಗ್ರಾಮೀಣ-ಸ್ನೇಹಿ",
        "tag_offline": "📴 ಆಫ್‌ಲೈನ್ ಬೆಂಬಲ",
        "platform_features": "🚀 ವೇದಿಕೆ ವೈಶಿಷ್ಟ್ಯಗಳು",
        "quick_access": "⚡ ತ್ವರಿತ ಪ್ರವೇಶ",
        "select_service": "ಪ್ರಾರಂಭಿಸಲು ಸೇವೆ ಆಯ್ಕೆ ಮಾಡಿ",
        "settings": "⚙️ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
        "theme_label": "🎨 ಥೀಮ್",
        "language_label": "🌐 ಭಾಷೆ",
        "quick_stats": "📊 ತ್ವರಿತ ಅಂಕಿಅಂಶಗಳು",
        "users_served": "⭐ ಸೇವಿಸಿದ ಬಳಕೆದಾರರು",
        "consultations": "⭐ ಸಮಾಲೋಚನೆಗಳು",
        "villages": "⭐ ಒಳಗೊಂಡ ಗ್ರಾಮಗಳು",
        "stats_disclaimer": "⭐ ಈ ಅಂಕಿಅಂಶಗಳು ಡೆಮೋ ಉದ್ದೇಶಕ್ಕಾಗಿ ಮಾತ್ರ.",
        "service_home": "🏠 ಮನೆ",
        "service_symptom": "🤖 AI ರೋಗಲಕ್ಷಣ ಪರೀಕ್ಷಕ",
        "service_appointment": "📅 ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ",
        "service_pharmacy": "💉 ಔಷಧಾಲಯ ಹುಡುಕಿ",
        "service_upload": "📷 ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
        "service_emergency": "🚑 ತುರ್ತು ಸಹಾಯ",
        "feat_ai_title": "AI ರೋಗಲಕ್ಷಣ ಪರೀಕ್ಷಕ",
        "feat_ai_desc": "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ ತಕ್ಷಣ ಮಾಹಿತಿ ಪಡೆಯಿರಿ",
        "feat_appt_title": "ವೈದ್ಯರ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್",
        "feat_appt_desc": "ನಿಮ್ಮ ಹತ್ತಿರದ ಪರಿಶೀಲಿತ ವೈದ್ಯರೊಂದಿಗೆ ಸಮಾಲೋಚನೆ ಬುಕ್ ಮಾಡಿ",
        "feat_emergency_title": "ತುರ್ತು ಸಹಾಯ",
        "feat_emergency_desc": "ಒಂದು ಟ್ಯಾಪ್‌ನಲ್ಲಿ ಆಂಬ್ಯುಲೆನ್ಸ್ ಮತ್ತು ಆಸ್ಪತ್ರೆ ಸಂಪರ್ಕ",
        "feat_medicine_title": "ಔಷಧ ಜ್ಞಾಪನೆಗಳು",
        "feat_medicine_desc": "ಸ್ಮಾರ್ಟ್ ಔಷಧ ವೇಳಾಪಟ್ಟಿಯೊಂದಿಗೆ ಯಾವುದೇ ಪ್ರಮಾಣ ತಪ್ಪಿಸಬೇಡಿ",
        "feat_records_title": "ಆರೋಗ್ಯ ದಾಖಲೆಗಳು",
        "feat_records_desc": "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹಿಸಿ",
        "feat_prescription_title": "ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಸ್ಕ್ಯಾನರ್",
        "feat_prescription_desc": "AI ಔಷಧ ಗುರುತಿಸುವಿಕೆಗಾಗಿ ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
        "feat_pharmacy_title": "ಹತ್ತಿರದ ಔಷಧಾಲಯಗಳು",
        "feat_pharmacy_desc": "ನೈಜ-ಸಮಯ ಔಷಧ ಲಭ್ಯತೆಯೊಂದಿಗೆ ಔಷಧಾಲಯಗಳನ್ನು ಹುಡುಕಿ",
        "feat_multilingual_title": "ಬಹುಭಾಷಾ",
        "feat_multilingual_desc": "ಹಿಂದಿ, ಕನ್ನಡ, ತಮಿಳು, ತೆಲುಗು ಮತ್ತು ಹೆಚ್ಚಿನ ಭಾಷೆಗಳಿಗೆ ಬೆಂಬಲ",
        "symptom_title": "### 🤖 AI ರೋಗಲಕ್ಷಣ ಪರೀಕ್ಷಕ",
        "symptom_desc": "ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿವರವಾಗಿ ವಿವರಿಸಿ.",
        "symptom_input_label": "ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ",
        "symptom_placeholder": "ಉದಾ., ನನಗೆ 2 ದಿನಗಳಿಂದ ತಲೆನೋವು ಮತ್ತು ಸಣ್ಣ ಜ್ವರ ಇದೆ...",
        "age_label": "ವಯಸ್ಸು",
        "gender_label": "ಲಿಂಗ",
        "gender_options": ["ಪುರುಷ", "ಮಹಿಳೆ", "ಇತರೆ"],
        "analyze_btn": "🔍 ರೋಗಲಕ್ಷಣ ವಿಶ್ಲೇಷಿಸಿ",
        "analyzing": "ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
        "analysis_complete": "**ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣ**",
        "analysis_result": """
**ಸಂಭಾವ್ಯ ಪರಿಸ್ಥಿತಿಗಳು:**
- ಸಾಮಾನ್ಯ ಶೀತ / ವೈರಲ್ ಜ್ವರ (ಹೆಚ್ಚಿನ ಸಂಭಾವ್ಯತೆ)
- ತಲೆನೋವು (ಮಧ್ಯಮ ಸಂಭಾವ್ಯತೆ)

**ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮಗಳು:**
1. ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳಿ ಮತ್ತು ಹೆಚ್ಚು ನೀರು ಕುಡಿಯಿರಿ
2. ತಾಪಮಾನ ನಿಯಮಿತವಾಗಿ ಪರೀಕ್ಷಿಸಿ
3. 3 ದಿನಗಳ ನಂತರವೂ ರೋಗಲಕ್ಷಣ ಇದ್ದರೆ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ

⚠️ *ಇದು ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯ ಅಲ್ಲ. ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.*
""",
        "symptom_warning": "ದಯವಿಟ್ಟು ಮೊದಲು ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ.",
        "appt_title": "### 📅 ವೈದ್ಯರ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ",
        "patient_name": "ರೋಗಿಯ ಹೆಸರು",
        "patient_placeholder": "ಪೂರ್ಣ ಹೆಸರು ನಮೂದಿಸಿ",
        "phone_label": "ಫೋನ್ ಸಂಖ್ಯೆ",
        "phone_placeholder": "+91 XXXXXXXXXX",
        "date_label": "ಆದ್ಯತೆಯ ದಿನಾಂಕ",
        "specialty_label": "ವಿಶೇಷತೆ",
        "specialty_options": ["ಸಾಮಾನ್ಯ ವೈದ್ಯ", "ಮಕ್ಕಳ ರೋಗ", "ಸ್ತ್ರೀ ರೋಗ", "ಮೂಳೆ ರೋಗ", "ಚರ್ಮ ರೋಗ", "ENT", "ಹೃದ್ರೋಗ"],
        "mode_label": "ಸಮಾಲೋಚನೆ ಮೋಡ್",
        "mode_options": ["ವೈಯಕ್ತಿಕ", "ವೀಡಿಯೊ ಕರೆ"],
        "time_label": "ಸಮಯ ಸ್ಲಾಟ್",
        "time_options": ["9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "2:00 PM - 3:00 PM", "4:00 PM - 5:00 PM"],
        "confirm_btn": "✅ ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಿ",
        "appt_success": "**ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ!** 🎉",
        "appt_warning": "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.",
        "pharmacy_title": "### 💉 ಹತ್ತಿರದ ಔಷಧಾಲಯ ಹುಡುಕಿ",
        "medicine_label": "ಔಷಧದ ಹೆಸರು",
        "medicine_placeholder": "ಹುಡುಕಲು ಔಷಧದ ಹೆಸರು ನಮೂದಿಸಿ",
        "location_label": "ನಿಮ್ಮ ಸ್ಥಳ",
        "location_placeholder": "ಗ್ರಾಮ/ಪಟ್ಟಣದ ಹೆಸರು ಅಥವಾ PIN ಕೋಡ್ ನಮೂದಿಸಿ",
        "search_btn": "🔍 ಔಷಧಾಲಯಗಳನ್ನು ಹುಡುಕಿ",
        "searching": "ಹತ್ತಿರದ ಔಷಧಾಲಯಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
        "pharmacy_found": "**ಲಭ್ಯತೆಯೊಂದಿಗೆ 3 ಔಷಧಾಲಯಗಳು ಕಂಡುಬಂದಿವೆ**",
        "pharmacy_warning": "ದಯವಿಟ್ಟು ಔಷಧದ ಹೆಸರು ನಮೂದಿಸಿ.",
        "upload_title": "### 📷 ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ / ವರದಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
        "upload_desc": "AI ವಿಶ್ಲೇಷಣೆಗಾಗಿ ನಿಮ್ಮ ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಅಥವಾ ವರದಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
        "upload_label": "ಎಳೆದು ಬಿಡಿ ಅಥವಾ ಕ್ಲಿಕ್ ಮಾಡಿ",
        "analyzing_doc": "ದಾಖಲೆ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
        "upload_complete": "**ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣ**",
        "upload_result": """
**ಪತ್ತೆಯಾದ ಔಷಧಗಳು:**
- ಪ್ಯಾರಾಸಿಟಮಾಲ್ 500mg - ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ
- ಸೆಟಿರಿಜಿನ್ 10mg - ರಾತ್ರಿ ಒಮ್ಮೆ
- ವಿಟಮಿನ್ C 500mg - ದಿನಕ್ಕೆ ಒಮ್ಮೆ

**ಜ್ಞಾಪನೆಗಳು ಹೊಂದಿಸಲಾಗಿದೆ:** ✅

**ಹತ್ತಿರದ ಲಭ್ಯತೆ:** 3 ಔಷಧಾಲಯಗಳಲ್ಲಿ ಎಲ್ಲಾ ಔಷಧಗಳು ಲಭ್ಯವಿದೆ.
""",
        "emergency_title": "### 🚑 ತುರ್ತು ಸಹಾಯ",
        "emergency_desc": "ವೈದ್ಯಕೀಯ ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ತಕ್ಷಣ ಸಹಾಯ ಪಡೆಯಿರಿ.",
        "emergency_warning": "⚠️ ಇದು ಜೀವಕ್ಕೆ ಅಪಾಯಕರ ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಾಗಿದ್ದರೆ, **112** ಗೆ ತಕ್ಷಣ ಕರೆ ಮಾಡಿ.",
        "emergency_contacts": """
**ತುರ್ತು ಸಂಪರ್ಕಗಳು:**
- 🚑 ಆಂಬ್ಯುಲೆನ್ಸ್: **108**
- 🏥 ತುರ್ತು: **112**
- 🩸 ರಕ್ತ ಬ್ಯಾಂಕ್: **104**
""",
        "nearest_hospital": """
**ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ:**
- 🏥 ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆ
- 📍 3.2 ಕಿಮೀ ದೂರ
- ☎️ +91 80 XXXX XXXX
""",
        "emergency_btn": "🚨 ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್ ಕೋರಿಕೆ",
        "emergency_sent": """
**ತುರ್ತು ವಿನಂತಿ ಕಳುಹಿಸಲಾಗಿದೆ!**

📍 ನಿಮ್ಮ ಸ್ಥಳ ಹತ್ತಿರದ ಆಂಬ್ಯುಲೆನ್ಸ್ ಸೇವೆಯೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಲಾಗಿದೆ.
🚑 ಅಂದಾಜು ಆಗಮನ: 8-12 ನಿಮಿಷಗಳು

ಶಾಂತವಾಗಿರಿ. ಈ ಪರದೆ ತೆರೆದಿರಲಿ.
""",
        "welcome_title": "### 👋 ಸ್ವಾಸ್ಥ್ಯ ಸೇತುಗೆ ಸ್ವಾಗತ",
        "welcome_desc": """
ಮೇಲಿನ ಡ್ರಾಪ್‌ಡೌನ್‌ನಿಂದ ಸೇವೆ ಆಯ್ಕೆ ಮಾಡಿ.

**ಪ್ರಾರಂಭ ಹೇಗೆ:**
1. ಸೈಡ್‌ಬಾರ್‌ನಿಂದ ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ
2. ಅಗತ್ಯ ಸೇವೆ ಆಯ್ಕೆ ಮಾಡಿ
3. ಸರಳ ಹಂತಗಳನ್ನು ಅನುಸರಿಸಿ
""",
        "footer_text": "❤️ ಗ್ರಾಮೀಣ ಭಾರತಕ್ಕಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ",
        "footer_badge": "🌍 ಗೂಗಲ್ ಸೊಲ್ಯೂಷನ್ ಚಾಲೆಂಜ್ 2025 | SDG 3",
    },
    "தமிழ்": {
        "hero_title": "🏥 ஸ்வாஸ்த்ய சேது",
        "hero_subtitle": "AI-இயங்கும் கிராமப்புற சுகாதார சேவை தளம்",
        "tag_accessible": "✨ அணுகக்கூடிய",
        "tag_ai": "🤖 AI-இயங்கும்",
        "tag_fast": "⚡ வேகமான",
        "tag_rural": "🌾 கிராமத்திற்கு ஏற்றது",
        "tag_offline": "📴 ஆஃப்லைன் ஆதரவு",
        "platform_features": "🚀 தள அம்சங்கள்",
        "quick_access": "⚡ விரைவு அணுகல்",
        "select_service": "தொடங்க சேவையை தேர்ந்தெடுக்கவும்",
        "settings": "⚙️ அமைப்புகள்",
        "theme_label": "🎨 தீம்",
        "language_label": "🌐 மொழி",
        "quick_stats": "📊 விரைவு புள்ளிவிவரங்கள்",
        "users_served": "⭐ சேவை பெற்றவர்கள்",
        "consultations": "⭐ ஆலோசனைகள்",
        "villages": "⭐ உள்ளடக்கிய கிராமங்கள்",
        "stats_disclaimer": "⭐ இந்த புள்ளிவிவரங்கள் டெமோ நோக்கங்களுக்காக மட்டுமே.",
        "service_home": "🏠 முகப்பு",
        "service_symptom": "🤖 AI அறிகுறி சரிபார்ப்பாளர்",
        "service_appointment": "📅 சந்திப்பு முன்பதிவு",
        "service_pharmacy": "💉 மருந்தகம் தேடு",
        "service_upload": "📷 மருந்துசீட்டு பதிவேற்றம்",
        "service_emergency": "🚑 அவசர உதவி",
        "feat_ai_title": "AI அறிகுறி சரிபார்ப்பாளர்",
        "feat_ai_desc": "உங்கள் மொழியில் அறிகுறிகளை விவரித்து உடனடி ஆரோக்கிய தகவல் பெறுங்கள்",
        "feat_appt_title": "மருத்துவர் சந்திப்புகள்",
        "feat_appt_desc": "அருகிலுள்ள சரிபார்க்கப்பட்ட மருத்துவர்களுடன் ஆலோசனை முன்பதிவு செய்யுங்கள்",
        "feat_emergency_title": "அவசர உதவி",
        "feat_emergency_desc": "ஒரு தட்டலில் ஆம்புலன்ஸ் மற்றும் மருத்துவமனை தொடர்பு",
        "feat_medicine_title": "மருந்து நினைவூட்டல்கள்",
        "feat_medicine_desc": "ஸ்மார்ட் மருந்து அட்டவணையுடன் எந்த டோஸையும் தவறவிடாதீர்கள்",
        "feat_records_title": "சுகாதார பதிவுகள்",
        "feat_records_desc": "உங்கள் மருத்துவ வரலாற்றை பாதுகாப்பாக சேமிக்கவும்",
        "feat_prescription_title": "மருந்துசீட்டு ஸ்கேனர்",
        "feat_prescription_desc": "AI மருந்து அடையாளத்திற்காக படத்தை பதிவேற்றவும்",
        "feat_pharmacy_title": "அருகிலுள்ள மருந்தகங்கள்",
        "feat_pharmacy_desc": "நேரலை மருந்து கிடைக்கும் தன்மையுடன் மருந்தகங்களை கண்டறியுங்கள்",
        "feat_multilingual_title": "பல மொழி",
        "feat_multilingual_desc": "இந்தி, கன்னடம், தமிழ், தெலுங்கு மற்றும் பலவற்றிற்கு முழு ஆதரவு",
        "symptom_title": "### 🤖 AI அறிகுறி சரிபார்ப்பாளர்",
        "symptom_desc": "உங்கள் அறிகுறிகளை விரிவாக விவரிக்கவும்.",
        "symptom_input_label": "உங்கள் அறிகுறிகளை விவரிக்கவும்",
        "symptom_placeholder": "எ.கா., என்னக்கு 2 நாட்களாக தலைவலி மற்றும் லேசான காய்ச்சல் உள்ளது...",
        "age_label": "வயது",
        "gender_label": "பாலினம்",
        "gender_options": ["ஆண்", "பெண்", "மற்றவை"],
        "analyze_btn": "🔍 அறிகுறிகளை பகுப்பாய்வு செய்",
        "analyzing": "அறிகுறிகளை பகுப்பாய்வு செய்கிறது...",
        "analysis_complete": "**பகுப்பாய்வு முடிந்தது**",
        "analysis_result": """
**சாத்தியமான நிலைமைகள்:**
- பொதுவான சளி / வைரஸ் காய்ச்சல் (அதிக வாய்ப்பு)
- பதற்ற தலைவலி (நடுத்தர வாய்ப்பு)

**பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்:**
1. ஓய்வு எடுங்கள் மற்றும் நிறைய தண்ணீர் குடியுங்கள்
2. வெப்பநிலையை தொடர்ந்து கண்காணிக்கவும்
3. 3 நாட்களுக்கும் அதிகமாக அறிகுறிகள் நீடித்தால் மருத்துவரை அணுகவும்

⚠️ *இது மருத்துவ நோயறிதல் அல்ல. தயவுசெய்து மருத்துவரை அணுகவும்.*
""",
        "symptom_warning": "தயவுசெய்து முதலில் உங்கள் அறிகுறிகளை விவரிக்கவும்.",
        "appt_title": "### 📅 மருத்துவர் சந்திப்பு முன்பதிவு",
        "patient_name": "நோயாளி பெயர்",
        "patient_placeholder": "முழு பெயரை உள்ளிடவும்",
        "phone_label": "தொலைபேசி எண்",
        "phone_placeholder": "+91 XXXXXXXXXX",
        "date_label": "விருப்பமான தேதி",
        "specialty_label": "சிறப்பு",
        "specialty_options": ["பொது மருத்துவர்", "குழந்தை மருத்துவம்", "மகப்பேறு மருத்துவம்", "எலும்பியல்", "தோல் மருத்துவம்", "ENT", "இதயவியல்"],
        "mode_label": "ஆலோசனை முறை",
        "mode_options": ["நேரில்", "வீடியோ அழைப்பு"],
        "time_label": "நேர இடம்",
        "time_options": ["9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "2:00 PM - 3:00 PM", "4:00 PM - 5:00 PM"],
        "confirm_btn": "✅ முன்பதிவை உறுதிப்படுத்தவும்",
        "appt_success": "**சந்திப்பு உறுதிப்படுத்தப்பட்டது!** 🎉",
        "appt_warning": "தயவுசெய்து அனைத்து தேவையான புலங்களையும் நிரப்பவும்.",
        "pharmacy_title": "### 💉 அருகிலுள்ள மருந்தகம் தேடு",
        "medicine_label": "மருந்தின் பெயர்",
        "medicine_placeholder": "தேட மருந்தின் பெயரை உள்ளிடவும்",
        "location_label": "உங்கள் இருப்பிடம்",
        "location_placeholder": "கிராமம்/நகரம் பெயர் அல்லது PIN கோடை உள்ளிடவும்",
        "search_btn": "🔍 மருந்தகங்களை தேடு",
        "searching": "அருகிலுள்ள மருந்தகங்களை தேடுகிறது...",
        "pharmacy_found": "**கிடைக்கும் தன்மையுடன் 3 மருந்தகங்கள் கண்டறியப்பட்டன**",
        "pharmacy_warning": "தயவுசெய்து மருந்தின் பெயரை உள்ளிடவும்.",
        "upload_title": "### 📷 மருந்துசீட்டு / அறிக்கை பதிவேற்றம்",
        "upload_desc": "AI பகுப்பாய்விற்காக உங்கள் மருந்துசீட்டு அல்லது மருத்துவ அறிக்கையை பதிவேற்றவும்.",
        "upload_label": "இழுத்து விடுங்கள் அல்லது கிளிக் செய்யுங்கள்",
        "analyzing_doc": "ஆவணத்தை பகுப்பாய்வு செய்கிறது...",
        "upload_complete": "**பகுப்பாய்வு முடிந்தது**",
        "upload_result": """
**கண்டறியப்பட்ட மருந்துகள்:**
- பாராசிட்டமால் 500mg - நாளுக்கு இரண்டு முறை
- செட்டிரிசின் 10mg - இரவு ஒரு முறை
- வைட்டமின் C 500mg - நாளுக்கு ஒரு முறை

**நினைவூட்டல்கள் அமைக்கப்பட்டன:** ✅

**அருகிலுள்ள கிடைக்கும் தன்மை:** 3 மருந்தகங்களில் அனைத்து மருந்துகளும் உள்ளன.
""",
        "emergency_title": "### 🚑 அவசர உதவி",
        "emergency_desc": "மருத்துவ அவசரநிலைகளில் உடனடி உதவி பெறுங்கள்.",
        "emergency_warning": "⚠️ இது உயிருக்கு ஆபத்தான அவசரநிலை என்றால், **112** ஐ உடனடியாக அழைக்கவும்.",
        "emergency_contacts": """
**அவசர தொடர்புகள்:**
- 🚑 ஆம்புலன்ஸ்: **108**
- 🏥 அவசரம்: **112**
- 🩸 ரத்த வங்கி: **104**
""",
        "nearest_hospital": """
**அருகிலுள்ள மருத்துவமனை:**
- 🏥 மாவட்ட மருத்துவமனை
- 📍 3.2 கி.மீ தொலைவு
- ☎️ +91 80 XXXX XXXX
""",
        "emergency_btn": "🚨 அவசர ஆம்புலன்ஸ் கோரு",
        "emergency_sent": """
**அவசர கோரிக்கை அனுப்பப்பட்டது!**

📍 உங்கள் இருப்பிடம் அருகிலுள்ள ஆம்புலன்ஸ் சேவையுடன் பகிரப்பட்டது.
🚑 மதிப்பிடப்பட்ட வருகை: 8-12 நிமிடங்கள்

அமைதியாக இருங்கள். இந்த திரையை திறந்து வையுங்கள்.
""",
        "welcome_title": "### 👋 ஸ்வாஸ்த்ய சேதுவிற்கு வரவேற்கிறோம்",
        "welcome_desc": """
மேலே உள்ள டிராப்டவுனில் இருந்து சேவையை தேர்ந்தெடுக்கவும்.

**தொடங்குவது எப்படி:**
1. பக்கப்பட்டியில் இருந்து விருப்பமான மொழியை தேர்ந்தெடுக்கவும்
2. தேவையான சேவையை தேர்ந்தெடுக்கவும்
3. எளிய படிகளை பின்பற்றவும்
""",
        "footer_text": "❤️ கிராமப்புற இந்தியாவிற்காக உருவாக்கப்பட்டது",
        "footer_badge": "🌍 Google Solution Challenge 2025 | SDG 3",
    },
    "తెలుగు": {
        "hero_title": "🏥 స్వాస్థ్య సేతు",
        "hero_subtitle": "AI-ఆధారిత గ్రామీణ ఆరోగ్య సేవా వేదిక",
        "tag_accessible": "✨ అందుబాటులో",
        "tag_ai": "🤖 AI-ఆధారిత",
        "tag_fast": "⚡ వేగం",
        "tag_rural": "🌾 గ్రామీణ-అనుకూల",
        "tag_offline": "📴 ఆఫ్‌లైన్ మద్దతు",
        "platform_features": "🚀 వేదిక లక్షణాలు",
        "quick_access": "⚡ త్వరిత యాక్సెస్",
        "select_service": "ప్రారంభించడానికి సేవను ఎంచుకోండి",
        "settings": "⚙️ సెట్టింగ్‌లు",
        "theme_label": "🎨 థీమ్",
        "language_label": "🌐 భాష",
        "quick_stats": "📊 త్వరిత గణాంకాలు",
        "users_served": "⭐ సేవ చేసిన వినియోగదారులు",
        "consultations": "⭐ సంప్రదింపులు",
        "villages": "⭐ కవర్ చేసిన గ్రామాలు",
        "stats_disclaimer": "⭐ ఈ గణాంకాలు డెమో ప్రయోజనాల కోసం మాత్రమే.",
        "service_home": "🏠 హోమ్",
        "service_symptom": "🤖 AI లక్షణ పరీక్షకుడు",
        "service_appointment": "📅 అపాయింట్‌మెంట్ బుక్ చేయండి",
        "service_pharmacy": "💉 ఫార్మసీ వెతకండి",
        "service_upload": "📷 ప్రిస్క్రిప్షన్ అప్‌లోడ్",
        "service_emergency": "🚑 అత్యవసర సహాయం",
        "feat_ai_title": "AI లక్షణ పరీక్షకుడు",
        "feat_ai_desc": "మీ భాషలో లక్షణాలను వివరించి తక్షణ ఆరోగ్య సమాచారం పొందండి",
        "feat_appt_title": "డాక్టర్ అపాయింట్‌మెంట్లు",
        "feat_appt_desc": "మీ దగ్గర ధృవీకరించబడిన డాక్టర్లతో సంప్రదింపు బుక్ చేయండి",
        "feat_emergency_title": "అత్యవసర సహాయం",
        "feat_emergency_desc": "ఒక్క ట్యాప్‌లో యాంబులెన్స్ మరియు ఆసుపత్రి సంప్రదింపు",
        "feat_medicine_title": "మందు గుర్తుచేపులు",
        "feat_medicine_desc": "స్మార్ట్ మందు షెడ్యూలింగ్‌తో ఏ డోస్‌నూ మిస్ చేయకండి",
        "feat_records_title": "ఆరోగ్య రికార్డులు",
        "feat_records_desc": "మీ వైద్య చరిత్రను సురక్షితంగా నిల్వ చేయండి",
        "feat_prescription_title": "ప్రిస్క్రిప్షన్ స్కానర్",
        "feat_prescription_desc": "AI మందు గుర్తింపు కోసం చిత్రాన్ని అప్‌లోడ్ చేయండి",
        "feat_pharmacy_title": "సమీప ఫార్మసీలు",
        "feat_pharmacy_desc": "నిజ-సమయ మందు లభ్యతతో ఫార్మసీలను కనుగొనండి",
        "feat_multilingual_title": "బహుభాషా",
        "feat_multilingual_desc": "హిందీ, కన్నడ, తమిళ్, తెలుగు మరియు మరిన్నింటికి పూర్తి మద్దతు",
        "symptom_title": "### 🤖 AI లక్షణ పరీక్షకుడు",
        "symptom_desc": "మీ లక్షణాలను వివరంగా వివరించండి.",
        "symptom_input_label": "మీ లక్షణాలను వివరించండి",
        "symptom_placeholder": "ఉదా., నాకు 2 రోజులుగా తలనొప్పి మరియు తేలికపాటి జ్వరం ఉంది...",
        "age_label": "వయస్సు",
        "gender_label": "లింగం",
        "gender_options": ["పురుషుడు", "స్త్రీ", "ఇతర"],
        "analyze_btn": "🔍 లక్షణాలు విశ్లేషించండి",
        "analyzing": "లక్షణాలు విశ్లేషిస్తోంది...",
        "analysis_complete": "**విశ్లేషణ పూర్తయింది**",
        "analysis_result": """
**సాధ్యమయ్యే పరిస్థితులు:**
- సాధారణ జలుబు / వైరల్ జ్వరం (అధిక సంభావ్యత)
- టెన్షన్ తలనొప్పి (మధ్యమ సంభావ్యత)

**సిఫారసు చేసిన చర్యలు:**
1. విశ్రాంతి తీసుకోండి మరియు నీళ్ళు తాగండి
2. ఉష్ణోగ్రతను నిర్ధారించండి
3. 3 రోజులకు మించి లక్షణాలు కొనసాగితే డాక్టర్‌ని సంప్రదించండి

⚠️ *ఇది వైద్య నిర్ధారణ కాదు. దయచేసి వైద్యుడిని సంప్రదించండి.*
""",
        "symptom_warning": "దయచేసి మొదట మీ లక్షణాలను వివరించండి.",
        "appt_title": "### 📅 డాక్టర్ అపాయింట్‌మెంట్ బుక్ చేయండి",
        "patient_name": "రోగి పేరు",
        "patient_placeholder": "పూర్తి పేరు నమోదు చేయండి",
        "phone_label": "ఫోన్ నంబర్",
        "phone_placeholder": "+91 XXXXXXXXXX",
        "date_label": "ఇష్టమైన తేదీ",
        "specialty_label": "ప్రత్యేకత",
        "specialty_options": ["సాధారణ వైద్యుడు", "శిశురోగ వైద్యం", "స్త్రీ రోగ వైద్యం", "ఎముక రోగం", "చర్మ రోగం", "ENT", "హృదయ రోగం"],
        "mode_label": "సంప్రదింపు మోడ్",
        "mode_options": ["వ్యక్తిగతంగా", "వీడియో కాల్"],
        "time_label": "సమయ స్లాట్",
        "time_options": ["9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "2:00 PM - 3:00 PM", "4:00 PM - 5:00 PM"],
        "confirm_btn": "✅ బుకింగ్ నిర్ధారించండి",
        "appt_success": "**అపాయింట్‌మెంట్ నిర్ధారించబడింది!** 🎉",
        "appt_warning": "దయచేసి అన్ని అవసరమైన ఫీల్డ్‌లను పూరించండి.",
        "pharmacy_title": "### 💉 సమీప ఫార్మసీ వెతకండి",
        "medicine_label": "మందు పేరు",
        "medicine_placeholder": "వెతకడానికి మందు పేరు నమోదు చేయండి",
        "location_label": "మీ స్థానం",
        "location_placeholder": "గ్రామం/పట్టణం పేరు లేదా PIN కోడ్ నమోదు చేయండి",
        "search_btn": "🔍 ఫార్మసీలను వెతకండి",
        "searching": "సమీప ఫార్మసీలు వెతుకుతోంది...",
        "pharmacy_found": "**లభ్యతతో 3 ఫార్మసీలు కనుగొనబడ్డాయి**",
        "pharmacy_warning": "దయచేసి మందు పేరు నమోదు చేయండి.",
        "upload_title": "### 📷 ప్రిస్క్రిప్షన్ / నివేదిక అప్‌లోడ్ చేయండి",
        "upload_desc": "AI విశ్లేషణ కోసం మీ ప్రిస్క్రిప్షన్ లేదా వైద్య నివేదికను అప్‌లోడ్ చేయండి.",
        "upload_label": "లాగి వదలండి లేదా క్లిక్ చేయండి",
        "analyzing_doc": "పత్రాన్ని విశ్లేషిస్తోంది...",
        "upload_complete": "**విశ్లేషణ పూర్తయింది**",
        "upload_result": """
**గుర్తించిన మందులు:**
- పారాసిటమాల్ 500mg - రోజుకు రెండుసార్లు
- సెటిరిజిన్ 10mg - రాత్రి ఒకసారి
- విటమిన్ C 500mg - రోజుకు ఒకసారి

**రిమైండర్లు సెట్ చేయబడ్డాయి:** ✅

**సమీప లభ్యత:** 3 ఫార్మసీలలో అన్ని మందులు అందుబాటులో ఉన్నాయి.
""",
        "emergency_title": "### 🚑 అత్యవసర సహాయం",
        "emergency_desc": "వైద్య అత్యవసర పరిస్థితుల్లో తక్షణ సహాయం పొందండి.",
        "emergency_warning": "⚠️ ఇది ప్రాణాపాయ అత్యవసర పరిస్థితి అయితే, **112** కి వెంటనే కాల్ చేయండి.",
        "emergency_contacts": """
**అత్యవసర సంప్రదింపులు:**
- 🚑 యాంబులెన్స్: **108**
- 🏥 అత్యవసరం: **112**
- 🩸 బ్లడ్ బ్యాంక్: **104**
""",
        "nearest_hospital": """
**సమీప ఆసుపత్రి:**
- 🏥 జిల్లా ఆసుపత్రి
- 📍 3.2 కి.మీ దూరం
- ☎️ +91 80 XXXX XXXX
""",
        "emergency_btn": "🚨 అత్యవసర యాంబులెన్స్ అభ్యర్థించండి",
        "emergency_sent": """
**అత్యవసర అభ్యర్థన పంపబడింది!**

📍 మీ స్థానం సమీప యాంబులెన్స్ సేవతో పంచుకోబడింది.
🚑 అంచనా వేసిన రాక: 8-12 నిమిషాలు

శాంతంగా ఉండండి. ఈ స్క్రీన్‌ని తెరిచి ఉంచండి.
""",
        "welcome_title": "### 👋 స్వాస్థ్య సేతుకు స్వాగతం",
        "welcome_desc": """
పైన ఉన్న డ్రాప్‌డౌన్ నుండి సేవను ఎంచుకోండి.

**ప్రారంభించడం ఎలా:**
1. సైడ్‌బార్ నుండి ఇష్టమైన భాషను ఎంచుకోండి
2. అవసరమైన సేవను ఎంచుకోండి
3. సరళమైన దశలను అనుసరించండి
""",
        "footer_text": "❤️ గ్రామీణ భారత్ కోసం నిర్మించబడింది",
        "footer_badge": "🌍 Google Solution Challenge 2025 | SDG 3",
    },
}


def T(key):
    """Get translated string for current language."""
    lang = st.session_state.get("language", "English")
    return TRANSLATIONS.get(lang, TRANSLATIONS["English"]).get(key, TRANSLATIONS["English"].get(key, key))


# ─────────────────────────────────────────────────────────────
# CUSTOM CSS
# ─────────────────────────────────────────────────────────────
def inject_css(theme: str):
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

    #MainMenu {{visibility:hidden;}} footer {{visibility:hidden;}}
    @media (max-width:768px) {{
        .hero-title {{ font-size:2.2rem; }}
        .hero-subtitle {{ font-size:1.1rem; }}
        .features-grid {{ grid-template-columns:1fr; }}
    }}
    </style>
    """, unsafe_allow_html=True)


# ─────────────────────────────────────────────────────────────
# SIDEBAR
# KEY FIX: use on_change callbacks to update session_state
# instead of assigning the widget return value directly.
# This prevents the widget from overwriting session_state
# with a stale default on page navigation.
# ─────────────────────────────────────────────────────────────
def _on_theme_change():
    st.session_state["theme"] = st.session_state["_theme_radio"]

def _on_language_change():
    st.session_state["language"] = st.session_state["_language_select"]

with st.sidebar:
    st.markdown(f"## {T('settings')}")
    st.markdown("---")

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
        key="_language_select",
        on_change=_on_language_change,
    )

    st.markdown("---")
    st.markdown(f"### {T('quick_stats')}")
    st.metric(T("users_served"), "12,450+", "+340 today")
    st.metric(T("consultations"), "8,920", "+89 this week")
    st.metric(T("villages"), "156", "+12 new")
    st.markdown(
        f'<p class="stats-disclaimer">{T("stats_disclaimer")}</p>',
        unsafe_allow_html=True
    )

# Inject CSS using the stable session_state value
inject_css(st.session_state["theme"])

# ─────────────────────────────────────────────────────────────
# HERO SECTION
# ─────────────────────────────────────────────────────────────
st.markdown(f"""
<div class="hero-container">
    <div class="hero-title">{T("hero_title")}</div>
    <div class="hero-subtitle">{T("hero_subtitle")}</div>
    <div class="hero-tags">
        <span class="hero-tag">{T("tag_accessible")}</span>
        <span class="hero-tag">{T("tag_ai")}</span>
        <span class="hero-tag">{T("tag_fast")}</span>
        <span class="hero-tag">{T("tag_rural")}</span>
        <span class="hero-tag">{T("tag_offline")}</span>
    </div>
</div>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────────────────────
# FEATURES GRID
# ─────────────────────────────────────────────────────────────
st.markdown(f"""
<div class="section-header">
    <h2>{T("platform_features")}</h2>
    <div class="section-line"></div>
</div>
""", unsafe_allow_html=True)

features = [
    ("🤖", T("feat_ai_title"),           T("feat_ai_desc")),
    ("📅", T("feat_appt_title"),         T("feat_appt_desc")),
    ("🚑", T("feat_emergency_title"),    T("feat_emergency_desc")),
    ("💊", T("feat_medicine_title"),     T("feat_medicine_desc")),
    ("🗂️", T("feat_records_title"),      T("feat_records_desc")),
    ("📷", T("feat_prescription_title"), T("feat_prescription_desc")),
    ("💉", T("feat_pharmacy_title"),     T("feat_pharmacy_desc")),
    ("🌐", T("feat_multilingual_title"), T("feat_multilingual_desc")),
]

cards_html = '<div class="features-grid">'
for icon, title, desc in features:
    cards_html += f"""
    <div class="feature-card">
        <div class="feature-icon">{icon}</div>
        <div class="feature-title">{title}</div>
        <div class="feature-desc">{desc}</div>
    </div>"""
cards_html += '</div>'
st.markdown(cards_html, unsafe_allow_html=True)

# ─────────────────────────────────────────────────────────────
# QUICK ACCESS SERVICES
# ─────────────────────────────────────────────────────────────
st.markdown(f"""
<div class="section-header">
    <h2>{T("quick_access")}</h2>
    <div class="section-line"></div>
</div>
""", unsafe_allow_html=True)

service_labels = [
    T("service_home"),
    T("service_symptom"),
    T("service_appointment"),
    T("service_pharmacy"),
    T("service_upload"),
    T("service_emergency"),
]
service_keys = ["home", "symptom", "appointment", "pharmacy", "upload", "emergency"]
service_map = dict(zip(service_labels, service_keys))

selected = st.selectbox(
    T("select_service"),
    service_labels,
    label_visibility="collapsed"
)
st.markdown("<br>", unsafe_allow_html=True)

# ─────────────────────────────────────────────────────────────
# SERVICE PANELS
# ─────────────────────────────────────────────────────────────
service = service_map[selected]

if service == "symptom":
    st.markdown('<div class="service-container">', unsafe_allow_html=True)
    st.markdown(T("symptom_title"))
    st.markdown(T("symptom_desc"))

    col1, col2 = st.columns([2, 1])
    with col1:
        symptoms = st.text_area(T("symptom_input_label"), placeholder=T("symptom_placeholder"), height=150)
    with col2:
        age    = st.number_input(T("age_label"), min_value=1, max_value=120, value=30)
        gender = st.selectbox(T("gender_label"), T("gender_options"))

    if st.button(T("analyze_btn"), use_container_width=True):
        if symptoms:
            with st.spinner(T("analyzing")):
                time.sleep(1.5)
            st.success(T("analysis_complete"))
            st.info(T("analysis_result"))
        else:
            st.warning(T("symptom_warning"))
    st.markdown('</div>', unsafe_allow_html=True)

elif service == "appointment":
    st.markdown('<div class="service-container">', unsafe_allow_html=True)
    st.markdown(T("appt_title"))

    col1, col2 = st.columns(2)
    with col1:
        name      = st.text_input(T("patient_name"), placeholder=T("patient_placeholder"))
        phone     = st.text_input(T("phone_label"),  placeholder=T("phone_placeholder"))
        date      = st.date_input(T("date_label"))
    with col2:
        specialty = st.selectbox(T("specialty_label"), T("specialty_options"))
        mode      = st.radio(T("mode_label"), T("mode_options"), horizontal=True)
        time_slot = st.selectbox(T("time_label"), T("time_options"))

    if st.button(T("confirm_btn"), use_container_width=True):
        if name and phone:
            st.success(f"""
{T("appt_success")}

- **{T("patient_name")}:** {name}
- **{T("specialty_label")}:** {specialty}
- **{T("date_label")}:** {date}
- **{T("time_label")}:** {time_slot}
- **{T("mode_label")}:** {mode}
""")
        else:
            st.warning(T("appt_warning"))
    st.markdown('</div>', unsafe_allow_html=True)

elif service == "pharmacy":
    st.markdown('<div class="service-container">', unsafe_allow_html=True)
    st.markdown(T("pharmacy_title"))

    medicine = st.text_input(T("medicine_label"), placeholder=T("medicine_placeholder"))
    location = st.text_input(T("location_label"), placeholder=T("location_placeholder"))

    if st.button(T("search_btn"), use_container_width=True):
        if medicine:
            with st.spinner(T("searching")):
                time.sleep(1)
            st.success(T("pharmacy_found"))
            pharmacies = [
                ("🏪 Sai Medical Store",   "0.8 km", "₹45", "In Stock"),
                ("🏪 Jan Aushadhi Kendra", "1.2 km", "₹28", "In Stock"),
                ("🏪 Apollo Pharmacy",     "2.5 km", "₹52", "Low Stock"),
            ]
            for pname, dist, price, status in pharmacies:
                st.markdown(f"""
                <div class="feature-card">
                    <strong>{pname}</strong><br>
                    📍 {dist} away | 💰 {price} | 📦 {status}
                </div>""", unsafe_allow_html=True)
        else:
            st.warning(T("pharmacy_warning"))
    st.markdown('</div>', unsafe_allow_html=True)

elif service == "upload":
    st.markdown('<div class="service-container">', unsafe_allow_html=True)
    st.markdown(T("upload_title"))
    st.markdown(T("upload_desc"))

    uploaded = st.file_uploader(T("upload_label"), type=["png", "jpg", "jpeg", "pdf"], label_visibility="collapsed")
    if uploaded:
        col1, col2 = st.columns(2)
        with col1:
            if uploaded.type == "application/pdf":
                st.info("PDF uploaded successfully")
            else:
                st.image(uploaded, caption=T("upload_label"), use_container_width=True)
        with col2:
            with st.spinner(T("analyzing_doc")):
                time.sleep(2)
            st.success(T("upload_complete"))
            st.markdown(T("upload_result"))
    st.markdown('</div>', unsafe_allow_html=True)

elif service == "emergency":
    st.markdown('<div class="service-container">', unsafe_allow_html=True)
    st.markdown(T("emergency_title"))
    st.markdown(T("emergency_desc"))
    st.warning(T("emergency_warning"))

    col1, col2 = st.columns(2)
    with col1:
        st.markdown(T("emergency_contacts"))
    with col2:
        st.markdown(T("nearest_hospital"))

    if st.button(T("emergency_btn"), use_container_width=True):
        st.error(T("emergency_sent"))
    st.markdown('</div>', unsafe_allow_html=True)

else:  # home
    st.markdown('<div class="service-container">', unsafe_allow_html=True)
    st.markdown(T("welcome_title"))
    st.markdown(T("welcome_desc"))
    st.markdown('</div>', unsafe_allow_html=True)

# ─────────────────────────────────────────────────────────────
# FOOTER
# ─────────────────────────────────────────────────────────────
st.markdown(f"""
<div class="footer">
    <p class="footer-text">{T("footer_text")}</p>
    <div class="footer-badge">{T("footer_badge")}</div>
</div>
""", unsafe_allow_html=True)