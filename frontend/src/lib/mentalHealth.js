export const motivationalQuotes = [
  "You are stronger than you think.",
  "This too shall pass.",
  "You are not alone.",
  "Progress, not perfection.",
]

export const suggestionMap = {
  Anxiety: "You may be experiencing anxiety. Try slowing your breathing, grounding yourself, and talking to someone you trust.",
  Bipolar: "Your response may reflect a more intense emotional pattern. Reaching out to a mental health professional would be a helpful next step.",
  Depression: "You may be experiencing symptoms of depression. Gentle routines, support from loved ones, and professional care can help.",
  Normal: "Your response appears emotionally steady right now. Keep supporting yourself with rest, routine, and healthy connections.",
  "Personality disorder":
    "Your response may benefit from professional follow-up. A licensed mental health expert can give more personalized guidance.",
  Stress: "You may be experiencing stress. Short breaks, better sleep, and talking with someone supportive may help ease the pressure.",
  Suicidal: "This looks critical. Please contact emergency support, a local crisis helpline, or a trusted person immediately.",
}

export const moodThemeMap = {
  Normal: {
    color: "#34d399",
    surface: "border-emerald-400/30 bg-emerald-500/10",
    badge: "border-emerald-300/30 bg-emerald-500/15 text-emerald-100",
    dot: "bg-emerald-400",
  },
  Stress: {
    color: "#facc15",
    surface: "border-yellow-300/35 bg-yellow-500/10",
    badge: "border-yellow-200/30 bg-yellow-500/15 text-yellow-100",
    dot: "bg-yellow-300",
  },
  Anxiety: {
    color: "#f59e0b",
    surface: "border-amber-300/35 bg-amber-500/10",
    badge: "border-amber-200/30 bg-amber-500/15 text-amber-100",
    dot: "bg-amber-300",
  },
  Depression: {
    color: "#fb7185",
    surface: "border-rose-300/35 bg-rose-500/10",
    badge: "border-rose-200/30 bg-rose-500/15 text-rose-100",
    dot: "bg-rose-300",
  },
  Bipolar: {
    color: "#f43f5e",
    surface: "border-rose-300/35 bg-rose-500/10",
    badge: "border-rose-200/30 bg-rose-500/15 text-rose-100",
    dot: "bg-rose-300",
  },
  "Personality disorder": {
    color: "#ef4444",
    surface: "border-red-300/35 bg-red-500/10",
    badge: "border-red-200/30 bg-red-500/15 text-red-100",
    dot: "bg-red-300",
  },
  Suicidal: {
    color: "#dc2626",
    surface: "border-red-300/40 bg-red-500/10",
    badge: "border-red-200/35 bg-red-500/15 text-red-100",
    dot: "bg-red-400",
  },
}

export const chartPalette = [
  "#34d399",
  "#facc15",
  "#f59e0b",
  "#fb7185",
  "#f43f5e",
  "#ef4444",
  "#dc2626",
]

export const dailyCheckInOptions = [
  { emoji: "😊", label: "Good", prediction: "Normal", confidence: 0.92 },
  { emoji: "😐", label: "Okay", prediction: "Stress", confidence: 0.68 },
  { emoji: "😔", label: "Bad", prediction: "Depression", confidence: 0.74 },
]

export const disclaimerText = "This is not a medical diagnosis. Please consult a professional."

export const getMoodTheme = (prediction) => moodThemeMap[prediction] || moodThemeMap.Depression

export const getMoodForRecommendations = ({ currentMood, monthlyTopMood }) => {
  if (currentMood?.prediction) return currentMood.prediction
  if (monthlyTopMood && monthlyTopMood !== 'No entries yet') return monthlyTopMood
  return 'Normal'
}
