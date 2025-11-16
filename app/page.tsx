import { SolarWingCanvas } from "../components/SolarWingCanvas";

export default function Page() {
  return (
    <main style={{ display: "flex", minHeight: "100vh" }}>
      <section
        style={{
          margin: "auto",
          width: "min(1100px, 92vw)",
          aspectRatio: "16 / 10",
          position: "relative",
          borderRadius: "28px",
          overflow: "hidden",
          boxShadow:
            "0 40px 80px rgba(3, 7, 18, 0.65), inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
          background: "radial-gradient(circle at top, rgba(31,57,119,0.8), rgba(4,8,14,0.95))",
        }}
      >
        <SolarWingCanvas />
        <div
          style={{
            position: "absolute",
            inset: "0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "32px 36px",
            pointerEvents: "none",
            background:
              "linear-gradient(0deg, rgba(3, 7, 18, 0.7) 0%, rgba(3, 7, 18, 0.05) 32%, rgba(3, 7, 18, 0) 48%)",
          }}
        >
          <header style={{ maxWidth: "420px" }}>
            <p
              style={{
                fontSize: "0.95rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                opacity: 0.65,
              }}
            >
              Solar Flight Concept
            </p>
            <h1
              style={{
                margin: "14px 0 16px",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                lineHeight: 1.1,
                fontWeight: 600,
              }}
            >
              Flying wing sustained by the sun
            </h1>
            <p style={{ fontSize: "1.05rem", opacity: 0.7, lineHeight: 1.6 }}>
              A solar-electric wing glides in silence through the upper atmosphere,
              its skin lined with prismatic cells harvesting daylight for endless
              endurance.
            </p>
          </header>
          <footer
            style={{
              display: "flex",
              gap: "18px",
              alignItems: "center",
              fontSize: "0.9rem",
              opacity: 0.55,
            }}
          >
            <span>Energy yield: 1.4 kW/m²</span>
            <span aria-hidden="true">•</span>
            <span>Glide ratio: 35:1</span>
            <span aria-hidden="true">•</span>
            <span>Altitude: 18 km</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
