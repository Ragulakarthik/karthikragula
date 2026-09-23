import { OG_SIZE, renderOgImage } from "@/lib/ogImage";
import { getAllVideos } from "@/lib/videos";

export const alt = "Karthik Ragula — interview prep, DSA in Java, resume & career videos";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    tag: "The Karthik Ragula Archive",
    title: "Everything you need to prep, in one place.",
    subtitle: `${getAllVideos().length} videos · Interview prep, DSA in Java, resume & career tips`,
  });
}
