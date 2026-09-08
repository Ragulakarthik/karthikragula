import videos from "@/data/videos.json";

export function getAllVideos() {
  return videos;
}

export function getVideosByCategory(categoryId) {
  return videos.filter((v) => v.category === categoryId);
}

export function getCategoryCounts() {
  const counts = {};
  for (const v of videos) {
    counts[v.category] = (counts[v.category] || 0) + 1;
  }
  return counts;
}

export function groupVideosBy(videoList, field) {
  const map = new Map();
  for (const v of videoList) {
    const key = v[field];
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(v);
  }
  return map;
}

export function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) return null;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatViewCount(count) {
  if (count === null || count === undefined) return null;
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K views`;
  return `${count} view${count === 1 ? "" : "s"}`;
}

export function extractProblemNumber(title) {
  const match = title.match(/^#(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}
