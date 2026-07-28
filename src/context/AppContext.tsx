import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode, LanguageCode, User } from '../types';

interface AppContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  English: {
    nav_title: "Swasthya Setu",
    navigation: "Navigation",
    nav_home: "Dashboard",
    nav_symptom: "AI Symptom Checker",
    nav_appointment: "Doctor Appointments",
    nav_medicine: "Medicine Reminders",
    nav_records: "Health Records",
    nav_prescription: "Prescription Scanner",
    nav_emergency: "Emergency Help",
    nav_login: "Login",
    nav_signup: "Sign Up",
    settings: "Settings & Privacy",
    theme_label: "Theme",
    language_label: "Language",
    hero_title: "🏥 Swasthya Setu",
    hero_subtitle: "AI-Powered Rural Healthcare Accessibility Platform",
    tag_accessible: "✨ Accessible",
    tag_ai: "🤖 AI-Powered",
    tag_fast: "⚡ Fast",
    tag_rural: "🌾 Rural-Friendly",
    tag_offline: "📴 Offline Support",
    daily_tips_title: "💡 Daily Health Tips",
    platform_features: "🚀 Platform Features",
    feat_ai_title: "AI Symptom Checker",
    feat_ai_desc: "Describe symptoms in your language and get instant preliminary health insights",
    feat_appt_title: "Doctor Appointments",
    feat_appt_desc: "Book consultations with verified doctors near you or via telemedicine",
    feat_emergency_title: "Emergency Help",
    feat_emergency_desc: "One-tap emergency assistance with ambulance and hospital contacts",
    feat_medicine_title: "Medicine Reminders",
    feat_medicine_desc: "Never miss a dose with smart medication scheduling",
    feat_records_title: "Health Records",
    feat_records_desc: "Securely store and access your medical history anytime",
    feat_prescription_title: "Prescription Scanner",
    feat_prescription_desc: "Upload images for AI-powered medicine identification",
    welcome_title: "👋 Welcome to Swasthya Setu",
    welcome_desc: "Use the navigation sidebar to access healthcare tools and services.",
    footer_text: "💙 Technology for Better Healthcare",
  },
  "हिंदी": {
    nav_title: "स्वास्थ्य सेतु",
    navigation: "नेविगेशन",
    nav_home: "डैशबोर्ड",
    nav_symptom: "AI लक्षण जाँचकर्ता",
    nav_appointment: "डॉक्टर अपॉइंटमेंट",
    nav_medicine: "दवा अनुस्मारक",
    nav_records: "स्वास्थ्य रिकॉर्ड",
    nav_prescription: "पर्चा स्कैनर",
    nav_emergency: "आपातकालीन सहायता",
    nav_login: "लॉग इन",
    nav_signup: "साइन अप",
    settings: "सेटिंग्स और गोपनीयता",
    theme_label: "थीम",
    language_label: "भाषा",
    hero_title: "🏥 स्वास्थ्य सेतु",
    hero_subtitle: "एआई-संचालित ग्रामीण स्वास्थ्य सेवा मंच",
    tag_accessible: "✨ सुलभ",
    tag_ai: "🤖 एआई-संचालित",
    tag_fast: "⚡ तेज़",
    tag_rural: "🌾 ग्रामीण-अनुकूल",
    tag_offline: "📴 ऑफ़लाइन सहायता",
    daily_tips_title: "💡 दैनिक स्वास्थ्य सुझाव",
    platform_features: "🚀 प्लेटफॉर्म की विशेषताएं",
    feat_ai_title: "एआई लक्षण जाँचकर्ता",
    feat_ai_desc: "अपनी भाषा में लक्षणों का वर्णन करें और तुरंत स्वास्थ्य अंतर्दृष्टि प्राप्त करें",
    feat_appt_title: "डॉक्टर अपॉइंटमेंट",
    feat_appt_desc: "अपने पास के डॉक्टरों के साथ परामर्श बुक करें",
    feat_emergency_title: "आपातकालीन सहायता",
    feat_emergency_desc: "एंबुलेंस और अस्पताल संपर्कों के साथ आपातकालीन सहायता",
    feat_medicine_title: "दवा अनुस्मारक",
    feat_medicine_desc: "स्मार्ट दवा समय-सारणी के साथ खुराक कभी न चूकें",
    feat_records_title: "स्वास्थ्य रिकॉर्ड",
    feat_records_desc: "अपना चिकित्सा इतिहास सुरक्षित रूप से संग्रहीत करें",
    feat_prescription_title: "पर्चा स्कैनर",
    feat_prescription_desc: "दवा की पहचान के लिए चित्र अपलोड करें",
    welcome_title: "👋 स्वास्थ्य सेतु में आपका स्वागत है",
    welcome_desc: "स्वास्थ्य सेवाओं तक पहुँचने के लिए नेविगेशन बार का उपयोग करें।",
    footer_text: "💙 बेहतर स्वास्थ्य सेवा के लिए प्रौद्योगिकी",
  },
  "ಕನ್ನಡ": {
    nav_title: "ಸ್ವಾಸ್ಥ್ಯ ಸೇತು",
    navigation: "ನ್ಯಾವಿಗೇಷನ್",
    nav_home: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    nav_symptom: "AI ರೋಗಲಕ್ಷಣ ಪರೀಕ್ಷಕ",
    nav_appointment: "ವೈದ್ಯರ ಭೇಟಿ",
    nav_medicine: "ಔಷಧಿ ಜ್ಞಾಪನೆಗಳು",
    nav_records: "ಆರೋಗ್ಯ ದಾಖಲೆಗಳು",
    nav_prescription: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಸ್ಕ್ಯಾನರ್",
    nav_emergency: "ತುರ್ತು ನೆರವು",
    nav_login: "ಲಾಗಿನ್",
    nav_signup: "ಸೈನ್ ಅಪ್",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    theme_label: "ಥೀಮ್",
    language_label: "ಭಾಷೆ",
    hero_title: "🏥 ಸ್ವಾಸ್ಥ್ಯ ಸೇತು",
    hero_subtitle: "ಎಐ-ಚಾಲಿತ ಗ್ರಾಮೀಣ ಆರೋಗ್ಯ ಸೇವೆ",
    tag_accessible: "✨ ಸುಲಭ",
    tag_ai: "🤖 ಎಐ-ಚಾಲಿತ",
    tag_fast: "⚡ ವೇಗ",
    tag_rural: "🌾 ಗ್ರಾಮೀಣ-ಸ್ನೇಹಿ",
    tag_offline: "📴 ಆಫ್‌ಲೈನ್ ಬೆಂಬಲ",
    daily_tips_title: "💡 ದೈನಂದಿನ ಆರೋಗ್ಯ ಸಲಹೆಗಳು",
    platform_features: "🚀 ವೈಶಿಷ್ಟ್ಯಗಳು",
    feat_ai_title: "ಎಐ ರೋಗಲಕ್ಷಣ ಪರೀಕ್ಷಕ",
    feat_ai_desc: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ವಿವರಗಳನ್ನು ನೀಡಿ ತುರ್ತು ಸಲಹೆ ಪಡೆಯಿರಿ",
    feat_appt_title: "ವೈದ್ಯರ ಭೇಟಿ",
    feat_appt_desc: "ನಿಮ್ಮ ಹತ್ತಿರದ ವೈದ್ಯರೊಂದಿಗೆ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕಾಯ್ದಿರಿಸಿ",
    feat_emergency_title: "ತುರ್ತು ನೆರವು",
    feat_emergency_desc: "ಆಂಬ್ಯುಲೆನ್ಸ್ ಮತ್ತು ಆಸ್ಪತ್ರೆ ತುರ್ತು ಸಂಪರ್ಕಗಳು",
    feat_medicine_title: "ಔಷಧಿ ಜ್ಞಾಪನೆಗಳು",
    feat_medicine_desc: "ನಿಖರವಾದ ಔಷಧೀಯ ಸಮಯವನ್ನು ಮರೆಯಬೇಡಿ",
    feat_records_title: "ಆರೋಗ್ಯ ದಾಖಲೆಗಳು",
    feat_records_desc: "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ವಿವರಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿರಿಸಿ",
    feat_prescription_title: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಸ್ಕ್ಯಾನರ್",
    feat_prescription_desc: "ಔಷಧಿಯ ವಿವರ ಪಡೆಯಲು ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    welcome_title: "👋 ಸ್ವಾಸ್ಥ್ಯ ಸೇತುಗೆ ಸುಸ್ವಾಗತ",
    welcome_desc: "ಸೇವೆಗಳನ್ನು ಪಡೆಯಲು ನ್ಯಾವಿಗೇಷನ್ ಬಾರ್ ಬಳಸಿ.",
    footer_text: "💙 ಉತ್ತಮ ಆರೋಗ್ಯಕ್ಕಾಗಿ ತಂತ್ರಜ್ಞಾನ",
  },
  "தமிழ்": {
    nav_title: "ஸ்வாஸ்த்ய சேது",
    navigation: "வழிசெலுத்தல்",
    nav_home: "முகப்பு",
    nav_symptom: "அறிகுறி சரிபார்ப்பாளர்",
    nav_appointment: "மருத்துவர் சந்திப்பு",
    nav_medicine: "மருந்து நினைவூட்டல்",
    nav_records: "சுகாதார பதிவுகள்",
    nav_prescription: "மருந்துசீட்டு ஸ்கேனர்",
    nav_emergency: "அவசர உதவி",
    nav_login: "உள்நுழைவு",
    nav_signup: "பதிவுபெறு",
    settings: "அமைப்புகள்",
    theme_label: "தீம்",
    language_label: "மொழி",
    hero_title: "🏥 ஸ்வாஸ்த்ய சேது",
    hero_subtitle: "AI இயங்கும் கிராமப்புற சுகாதார தளம்",
    tag_accessible: "✨ அணுகக்கூடியது",
    tag_ai: "🤖 AI-இயங்கும்",
    tag_fast: "⚡ வேகமானது",
    tag_rural: "🌾 கிராமப்புற நட்பு",
    tag_offline: "📴 ஆஃப்லைன் ஆதரவு",
    daily_tips_title: "💡 தினசரி சுகாதார குறிப்புகள்",
    platform_features: "🚀 தளத்தின் அம்சங்கள்",
    feat_ai_title: "அறிகுறி சரிபார்ப்பாளர்",
    feat_ai_desc: "உங்கள் மொழியில் அறிகுறிகளை விவரிக்கவும்",
    feat_appt_title: "மருத்துவர் சந்திப்பு",
    feat_appt_desc: "மருத்துவர்களுடன் ஆலோசனைகளை பதிவு செய்யுங்கள்",
    feat_emergency_title: "அவசர உதவி",
    feat_emergency_desc: "அவசர ஆம்புலன்ஸ் உதவி",
    feat_medicine_title: "மருந்து நினைவூட்டல்",
    feat_medicine_desc: "மருந்து அளவை தவறவிடாதீர்கள்",
    feat_records_title: "சுகாதார பதிவுகள்",
    feat_records_desc: "உங்கள் மருத்துவ வரலாற்றைப் பாதுகாப்பாக சேமிக்கவும்",
    feat_prescription_title: "மருந்துசீட்டு ஸ்கேனர்",
    feat_prescription_desc: "மருந்து அடையாளத்திற்காக படங்களை பதிவேற்றவும்",
    welcome_title: "👋 ஸ்வாஸ்த்ய சேதுவிற்கு நல்வரவு",
    welcome_desc: "சுகாதார சேவைகளைப் பெற வழிசெலுத்தல் பட்டியைப் பயன்படுத்தவும்.",
    footer_text: "💙 சிறந்த சுகாதாரத்திற்கான தொழில்நுட்பம்",
  },
  "తెలుగు": {
    nav_title: "స్వాస్థ్య సేతు",
    navigation: "నేవిగేషన్",
    nav_home: "హోమ్",
    nav_symptom: "లక్షణ పరీక్షకుడు",
    nav_appointment: "డాక్టర్ అపాయింట్‌మెంట్",
    nav_medicine: "మందు గుర్తుచేపులు",
    nav_records: "ఆరోగ్య రికార్డులు",
    nav_prescription: "ప్రిస్క్రిప్షన్ స్కానర్",
    nav_emergency: "అత్యవసర సహాయం",
    nav_login: "లాగిన్",
    nav_signup: "సైన్ అప్",
    settings: "సెట్టింగ్‌లు",
    theme_label: "టీమ్",
    language_label: "భాష",
    hero_title: "🏥 స్వాస్థ్య సేతు",
    hero_subtitle: "AI-సమర్థవంతమైన గ్రామీణ ఆరోగ్య సంరక్షణ ప్లాట్‌ఫారమ్",
    tag_accessible: "✨ అందుబాటులో ఉంది",
    tag_ai: "🤖 AI-సమర్థవంతమైన",
    tag_fast: "⚡ వేగవంతమైనది",
    tag_rural: "🌾 గ్రామీణ అనుకూల",
    tag_offline: "📴 ఆఫ్‌లైన్ మద్దతు",
    daily_tips_title: "💡 రోజువారీ ఆరోగ్య చిట్కాలు",
    platform_features: "🚀 ప్లాట్‌ఫారమ్ ఫీచర్లు",
    feat_ai_title: "లక్షణ పరీక్షకుడు",
    feat_ai_desc: "మీ భాషలో లక్షణాలను వివరించండి",
    feat_appt_title: "డాక్టర్ అపాయింట్‌మెంట్",
    feat_appt_desc: "డాక్టర్లతో సంప్రదింపులు బుక్ చేయండి",
    feat_emergency_title: "అత్యవసర సహాయం",
    feat_emergency_desc: "ఆంబులెన్స్ సహాయం",
    feat_medicine_title: "మందు గుర్తుచేపులు",
    feat_medicine_desc: "మందుల మోతాదును కోల్పోకండి",
    feat_records_title: "ఆరోగ్య రికార్డులు",
    feat_records_desc: "మీ వైద్య చరిత్రను సురక్షితంగా నిల్వ చేయండి",
    feat_prescription_title: "ప్రిస్క్రిప్షన్ స్కానర్",
    feat_prescription_desc: "మందుల గుర్తింపు కోసం చిత్రాలను అప్‌లోడ్ చేయండి",
    welcome_title: "👋 స్వాస్థ్య సేతుకి సుస్వాగతం",
    welcome_desc: "ఆరోగ్య సేవలను పొందడానికి నేవిగేషన్ బార్‌ను ఉపయోగించండి.",
    footer_text: "💙 మెరుగైన ఆరోగ్య సంరక్షణ కోసం సాంకేతికత",
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('Light');
  const [language, setLanguage] = useState<LanguageCode>('English');

  // Start unauthenticated by default so Login / Signup is prompted immediately upon entering
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<string>('login');

  useEffect(() => {
    if (theme === 'Dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS['English'];
    return langDict[key] || TRANSLATIONS['English'][key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        language,
        setLanguage,
        user,
        setUser,
        activePage,
        setActivePage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
