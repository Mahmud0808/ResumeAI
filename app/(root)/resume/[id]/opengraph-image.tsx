import { ImageResponse } from "next/og";
import { fetchResume } from "@/lib/actions/resume.actions";

// Node runtime (not edge): fetchResume uses mongoose, which is not edge-safe.
export const alt = "Resume on ResumeAI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // fetchResume returns null JSON for private resumes viewed by a non-owner
  // (the scraper is unauthenticated), so private resumes fall back to the
  // generic card below — nothing private leaks.
  let resume: any = null;
  try {
    resume = JSON.parse((await fetchResume(id)) || "null");
  } catch {
    resume = null;
  }

  const fullName =
    `${resume?.firstName ?? ""} ${resume?.lastName ?? ""}`.trim();
  const jobTitle = resume?.jobTitle ?? "";
  const accent = resume?.themeColor || "#7c3aed";

  // No public data: render the generic brand card.
  if (!fullName) {
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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: 72,
        }}
      >
        {/* Accent bar in the resume's theme color */}
        <div
          style={{
            width: 120,
            height: 12,
            borderRadius: 9999,
            background: accent,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            {fullName}
          </div>
          {jobTitle ? (
            <div
              style={{
                marginTop: 16,
                fontSize: 40,
                fontWeight: 500,
                color: "#cbd5e1",
              }}
            >
              {jobTitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9999,
              background: accent,
            }}
          />
          ResumeAI
        </div>
      </div>
    ),
    { ...size }
  );
}
