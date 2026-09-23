import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

const avatarSrc = readFile(join(process.cwd(), "public/karthik-avatar.jpg")).then(
  (buf) => `data:image/jpeg;base64,${buf.toString("base64")}`
);

const fontsLoaded = Promise.all(
  [500, 700].map(async (weight) => ({
    name: "Space Grotesk",
    data: await readFile(join(process.cwd(), `src/assets/fonts/SpaceGrotesk-${weight}.woff`)),
    weight,
    style: "normal",
  }))
);

// Shared share-preview card in the site's brutalist style: a colored tag, big headline,
// a supporting line and the avatar + name footer.
export async function renderOgImage({ tag, title, subtitle, color = "#2b59ff" }) {
  const [avatar, fonts] = await Promise.all([avatarSrc, fontsLoaded]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f4f1e8",
          padding: 40,
          fontFamily: "Space Grotesk",
          fontWeight: 500,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#ffffff",
            border: "6px solid #111111",
            boxShadow: "14px 14px 0 0 #111111",
            borderRadius: 24,
            padding: "52px 60px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  background: color,
                  color: "#ffffff",
                  border: "4px solid #111111",
                  borderRadius: 10,
                  padding: "8px 20px",
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                }}
              >
                {tag}
              </div>
            </div>
            <div
              style={{
                marginTop: 34,
                fontSize: 76,
                fontWeight: 700,
                lineHeight: 1.05,
                color: "#111111",
                letterSpacing: -2,
              }}
            >
              {title}
            </div>
            <div style={{ marginTop: 22, fontSize: 34, color: "#555555", lineHeight: 1.3 }}>
              {subtitle}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img
              src={avatar}
              width={72}
              height={72}
              style={{ borderRadius: 999, border: "4px solid #111111" }}
            />
            <div style={{ marginLeft: 20, fontSize: 32, fontWeight: 700, color: "#111111" }}>
              Karthik Ragula
            </div>
            <div style={{ marginLeft: 16, fontSize: 28, color: "#555555" }}>
              · Telugu tech & career videos
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts }
  );
}
