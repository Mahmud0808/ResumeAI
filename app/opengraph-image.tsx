import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ResumeAI - Professional AI Resume Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -2 }}>
          ResumeAI
        </div>
        <div style={{ marginTop: 20, fontSize: 36, opacity: 0.9 }}>
          Build your resume with AI
        </div>
      </div>
    ),
    { ...size }
  );
}
