
import { LanguageCode, GameLevel } from './types';

export const COLORS = {
  primary: '#9A7B4F', // Golden Brown
  primaryDark: '#7A5F3B',
  secondary: '#D4AF37', // Gold accent
  accent: '#E6C9A8', // Light Tan
  danger: '#A63D40',
  neutral: '#8C8C8C',
  bg: '#FDFBF7', // Light Cream
  white: '#FFFFFF',
  text: '#3E362E', // Dark Espresso
};

export const APP_LOGO = "https://i.pinimg.com/736x/8c/8e/76/8c8e76fdc894e4ada7cae39c8d712d96.jpg"; 

/* Added missing language properties to satisfy Record<LanguageCode, any> */
export const TRANSLATIONS: Record<LanguageCode, any> = {
  en: {
    dashboard: "Home",
    tracker: "Daily Log",
    insights: "Insights",
    reports: "Reports",
    chat: "Coach",
    profile: "Profile",
    diet: "Diet & Routine",
    game: "Calcium Quest",
    sync: "Wearable",
    hi: "Hi",
    streak: "Day Streak",
    points: "Points",
    dailyGoal: "Daily Progress",
    tasks: "Bone Tasks",
    boneInsight: "Bone Insight AI",
    analyzeTrends: "Analyze My Trends",
    comingSoon: "Coming Soon",
    sunlight: "Sunlight",
    hydration: "Hydration",
    protein: "Protein",
    sleepQuality: "Sleep Quality",
    stress: "Stress Level",
    mindfulness: "Mindfulness",
    macros: "Macros Distribution",
    indianFoods: "Indian Bone Builders"
  },
  ta: {
    dashboard: "முகப்பு",
    tracker: "தினசரி பதிவு",
    insights: "நுண்ணறிவு",
    reports: "அறிக்கைகள்",
    chat: "பയிற்சியாளர்",
    profile: "சுயவிவரம்",
    diet: "உணவு & பழக்கம்",
    game: "எலும்பு விளையாட்டு",
    sync: "வாட்ச் இணைப்பு",
    hi: "வணக்கம்",
    streak: "நாள் தொடர்ச்சி",
    points: "புள்ளிகள்",
    dailyGoal: "தினசரி முன்னேற்றம்",
    tasks: "எலும்பு பணிகள்",
    boneInsight: "எலும்பு நுண்ணறிவு AI",
    analyzeTrends: "எனது போக்குகளை ஆராயுங்கள்",
    comingSoon: "விரைவில்",
    sunlight: "சூரிய ஒளி",
    hydration: "நீரேற்றம்",
    protein: "புரதம்",
    sleepQuality: "தூக்க தரம்",
    stress: "மன அழுத்தம்",
    mindfulness: "மனம்",
    macros: "மேக்రోக்கள்"
  },
  ml: {
    dashboard: "ഹോം",
    tracker: "ഡെയ്‌ലി ലോഗ്",
    insights: "ഇൻസൈറ്റ്സ്",
    reports: "റിപ്പോർട്ടുകൾ",
    chat: "കോച്ച്",
    profile: "പ്രൊഫൈൽ",
    diet: "ഡയറ്റ് & റുട്ടീൻ",
    game: "കാൽസ്യം ക്വസ്റ്റ്",
    sync: "വെയറബിൾ",
    hi: "ഹായ്",
    streak: "ദിവസത്തെ സ്ട്രീക്ക്",
    points: "പോയിന്റുകൾ",
    dailyGoal: "പ്രോഗ്രസ്",
    tasks: "ടാസ്ക്കുകൾ",
    boneInsight: "ബോൺ ഇൻസൈറ്റ് AI",
    analyzeTrends: "ട്രെൻഡ്സ് വിശകലനം",
    comingSoon: "ഉടൻ വരുന്നു",
    sunlight: "സൂര്യപ്രകാശം",
    hydration: "ഹൈഡ്രേഷൻ",
    protein: "പ്രോട്ടീൻ",
    sleepQuality: "ഉറക്ക നിലവാരം",
    stress: "സ്ട്രെസ്",
    mindfulness: "മൈൻഡ്ഫുൾനെസ്",
    macros: "മാക്രോസ്",
    indianFoods: "ഇന്ത്യൻ ബോൺ ബിൽഡേഴ്സ്"
  },
  kn: {
    dashboard: "ಮುಖಪುಟ",
    tracker: "ದೈನಂದಿನ ದಾಖಲೆ",
    insights: "ಒಳನೋಟಗಳು",
    reports: "ವರದಿಗಳು",
    chat: "ತರಬೇತುದಾರ",
    profile: "ಪ್ರೊಫೈಲ್",
    diet: "ಆಹಾರ ಮತ್ತು ದಿನಚರಿ",
    game: "ಕ್ಯಾಲ್ಸಿಯಂ ಅನ್ವೇಷಣೆ",
    sync: "ವೇರಬಲ್",
    hi: "ಹಾಯ್",
    streak: "ದಿನದ ಸ್ಟ್ರೀಕ್",
    points: "ಪಾಯಿಂಟ್ಗಳು",
    dailyGoal: "ಪ್ರಗತಿ",
    tasks: "ಕೆಲಸಗಳು",
    boneInsight: "ಮೂಳೆ ಒಳನೋಟ AI",
    analyzeTrends: "ಪ್ರವೃತ್ತಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
    comingSoon: "ಶೀಘ್ರದಲ್ಲೇ",
    sunlight: "ಸೂರ್ಯನ ಬೆಳಕು",
    hydration: "ಹೈಡ್ರೇಶನ್",
    protein: "ಪ್ರೋಟೀನ್",
    sleepQuality: "ನಿದ್ರೆಯ ಗುಣಮಟ್ಟ",
    stress: "ಒತ್ತಡ",
    mindfulness: "ಮೈಂಡ್ಫುಲ್ನೆಸ್",
    macros: "ಮ್ಯಾಕ್ರೋಗಳು",
    indianFoods: "ಭಾರತೀಯ ಮೂಳೆ ಬಿಲ್ಡರ್ಸ್"
  },
  te: {
    dashboard: "హోమ్",
    tracker: "డైలీ లాగ్",
    insights: "అంతర్దృష్టులు",
    reports: "నివేదికలు",
    chat: "కోచ్",
    profile: "ప్రొఫైల్",
    diet: "డైట్ & రొటీన్",
    game: "కాల్షియం క్వెస్ట్",
    sync: "వేరబుల్",
    hi: "హాయ్",
    streak: "డే స్ట్రీక్",
    points: "పాయింట్లు",
    dailyGoal: "ప్రగతి",
    tasks: "టాస్క్లు",
    boneInsight: "బోన్ ఇన్సైట్ AI",
    analyzeTrends: "ట్రెండ్స్ విశ్లేషించండి",
    comingSoon: "త్వరలో",
    sunlight: "సూర్యరశ్మి",
    hydration: "హైడ్రేషన్",
    protein: "ప్రోటీన్",
    sleepQuality: "నిద్ర నాణ్యత",
    stress: "ఒత్తిడి",
    mindfulness: "మైండ్ఫుల్నెస్",
    macros: "మాక్రోలు"
  }
};

export const CALCIUM_QUEST_LEVELS: GameLevel[] = [
  { id: 1, scrambled: "AIMSNDL", answer: "ALMONDS", hint: "A crunchy nut high in calcium.", calciumMg: 76, funFact: "One ounce of almonds contains 8% of the DV for calcium!" },
  { id: 2, scrambled: "HCISNAP", answer: "SPINACH", hint: "Popeye's favorite leafy green.", calciumMg: 99, funFact: "One cup of cooked spinach has as much calcium as a cup of milk!" },
  { id: 3, scrambled: "TRYOGU", answer: "YOGURT", hint: "A fermented dairy product.", calciumMg: 300, funFact: "Yogurt is easier to digest for many than milk and has more calcium per cup." },
  { id: 4, scrambled: "DINESRAS", answer: "SARDINES", hint: "Small fish often in tins.", calciumMg: 325, funFact: "Because you eat the soft bones, they are incredible calcium boosters!" },
  { id: 5, scrambled: "EUCHESE", answer: "CHEESE", hint: "Most dairy products start here.", calciumMg: 200, funFact: "Hard cheeses like Parmesan have the highest calcium content." }
];

export const SPRING_CONFIG = {
  type: "spring",
  stiffness: 260,
  damping: 20
} as const;

export const FADE_UP = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
} as const;

/* Exporting DIET_ROUTINE and ABSORPTION_TIPS used in DietRoutine component */
export const DIET_ROUTINE = [
  {
    title: "Indian Calcium Rich Foods",
    color: "bg-amber-50",
    items: ["Ragi (Finger Millet)", "Paneer", "Curd (Dahi)", "Sesame Seeds (Til)", "Drumstick Leaves (Moringa)"]
  },
  {
    title: "Vitamin D & Indian Sources",
    color: "bg-blue-50",
    items: ["Fortified Milk", "Mushrooms", "Egg Yolks", "Sunlight (11am-1pm)", "Fortified Soya Milk"]
  },
  {
    title: "Indian Synergy Micronutrients",
    color: "bg-emerald-50",
    items: ["Magnesium (Amaranth/Rajgira)", "Vitamin K2 (Fermented Idli/Dosa)", "Zinc (Chickpeas/Chana)", "Boron (Almonds/Badam)"]
  },
  {
    title: "Indian Grains & Veggies",
    color: "bg-orange-50",
    items: ["Bajra (Pearl Millet)", "Jowar (Sorghum)", "Brown Rice", "Okra (Bhindi)", "Broccoli (Indian variant)"]
  },
  {
    title: "Weight-Bearing Activities",
    color: "bg-purple-50",
    items: ["Brisk Walking", "Yoga (Surya Namaskar)", "Resistance Training", "Classical Dancing"]
  }
];

export const ABSORPTION_TIPS = [
  {
    title: "Small Doses",
    desc: "Body absorbs calcium better in doses of 500mg or less at a time."
  },
  {
    title: "Avoid Caffeine with Meals",
    desc: "Caffeine can slightly interfere with calcium absorption."
  },
  {
    title: "The K2 Key",
    desc: "Vitamin K2 helps direct calcium into the bones and away from arteries."
  }
];
