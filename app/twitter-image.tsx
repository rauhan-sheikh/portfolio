import { ImageResponse } from "next/og";

export const alt = "Rauhan Sheikh — Software Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0b1220",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 700 }}>Rauhan Sheikh</div>
        <div style={{ fontSize: 40, marginTop: 20, color: "#7DBEFA" }}>Software Developer</div>
        <div style={{ fontSize: 30, marginTop: 36, color: "#cbd5e1" }}>
          Backend reliability, database architecture, and resilient web software.
        </div>
        <div style={{ fontSize: 26, marginTop: 60, color: "#94a3b8" }}>rauhansheikh.com</div>
      </div>
    ),
    size
  );
}
