export const CATEGORIES = [
  {
    id: "companies",
    label: "Companies",
    emoji: "🏢",
    description: "Interview experiences, training process & prep, company-wise.",
    inNav: true,
    color: "#3b82f6",
  },
  {
    id: "dsa",
    label: "DSA",
    emoji: "🧩",
    description: "LeetCode problems solved in Java, explained in Telugu.",
    inNav: true,
    color: "#10b981",
  },
  {
    id: "resume",
    label: "Resume",
    emoji: "📄",
    description: "Resume building tips for freshers.",
    inNav: true,
    color: "#f59e0b",
  },
  {
    id: "career-tips",
    label: "Career Tips",
    emoji: "🎯",
    description: "Roadmaps, certifications & internship advice.",
    inNav: true,
    color: "#8b5cf6",
  },
  {
    id: "miscellaneous",
    label: "Miscellaneous",
    emoji: "🎬",
    description: "Vlogs and other videos that don't fit elsewhere.",
    inNav: true,
    color: "#ec4899",
  },
];

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id);
}
