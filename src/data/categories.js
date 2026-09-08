export const CATEGORIES = [
  {
    id: "companies",
    label: "Companies",
    emoji: "🏢",
    description: "Interview experiences, training process & prep, company-wise.",
    inNav: true,
    color: "#2b59ff",
  },
  {
    id: "dsa",
    label: "DSA",
    emoji: "🧩",
    description: "LeetCode problems solved in Java, explained in Telugu.",
    inNav: true,
    color: "#16a34a",
  },
  {
    id: "resume",
    label: "Resume",
    emoji: "📄",
    description: "Resume building tips for freshers.",
    inNav: true,
    color: "#ff6a00",
  },
  {
    id: "career-tips",
    label: "Career Tips",
    emoji: "🎯",
    description: "Roadmaps, certifications & internship advice.",
    inNav: true,
    color: "#7c3aed",
  },
  {
    id: "miscellaneous",
    label: "Miscellaneous",
    emoji: "🎬",
    description: "Vlogs and other videos that don't fit elsewhere.",
    inNav: true,
    color: "#ff2d78",
  },
];

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id);
}
