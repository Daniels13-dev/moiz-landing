import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Möiz - Arena y Productos para Gatos";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(to bottom right, #FAFAF8, #E2EFCD)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          width: 120,
          height: 120,
          backgroundColor: "#6A8E2A",
          borderRadius: "50%",
          opacity: 0.1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -50,
          right: -50,
          width: 300,
          height: 300,
          backgroundColor: "#C2185B",
          borderRadius: "50%",
          opacity: 0.05,
        }}
      />

      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        {/* Un placeholder para el logo (en SVG) */}
        <svg
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6A8E2A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3.1-9-7.56c0-1.25.43-2.4 1-3.44 0 0-1.82-6.42-.42-7 1.39-.58 4.64.27 6.42 2.26.65-.17 1.33-.26 2-.26z"></path>
        </svg>
      </div>

      <h1
        style={{
          fontSize: 90,
          fontWeight: 900,
          color: "#6A8E2A",
          letterSpacing: "-0.05em",
          margin: "0 0 20px 0",
          textAlign: "center",
        }}
      >
        Möiz
      </h1>

      <p
        style={{
          fontSize: 40,
          color: "#2A2A2A",
          fontWeight: 500,
          textAlign: "center",
          maxWidth: "80%",
          margin: 0,
        }}
      >
        La mejor arena, accesorios y distillates para tu gato.
      </p>

      <div
        style={{
          display: "flex",
          marginTop: 60,
          padding: "20px 40px",
          backgroundColor: "#6A8E2A",
          color: "white",
          borderRadius: 40,
          fontSize: 30,
          fontWeight: "bold",
        }}
      >
        Visita la tienda oficial
      </div>
    </div>,
    {
      ...size,
    },
  );
}
