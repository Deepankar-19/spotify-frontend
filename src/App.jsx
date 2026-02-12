import { useState } from "react";
import TargetCursor from "./TargetCursor";
import LaserFlow from "./LaserFlow";
import GridScan from "./GridScan";
import "./App.css";

function App() {
  const [song, setSong] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  const fetchRecommendations = async () => {
    setError("");
    setRecommendations([]);

    try {
      const response = await fetch(
        `https://spotify-backend-eun7.onrender.com/recommend/${encodeURIComponent(song)}`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      setError("Backend not reachable!");
    }
  };

  return (
    <div style={{ height: "100vh", position: "relative", overflow: "hidden" }}>

      {/* 🌌 Base Laser Background */}
      <LaserFlow
        color="#CF9EFF"
        horizontalSizing={0.5}
        verticalSizing={2}
        flowSpeed={0.35}
      />

      {/* 🟣 Grid Overlay (Subtle) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#392e4e"
          gridScale={0.1}
          scanColor="#FF9FFC"
          scanOpacity={0.25}   // reduced opacity
          enablePost
          bloomIntensity={0.4} // reduced bloom
          chromaticAberration={0.001}
          noiseIntensity={0.005}
        />
      </div>

      {/* 🎯 Cursor */}
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
      />

      {/* 💎 Main UI */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          overflowY: "auto",
          color: "white",
          textAlign: "center"
        }}
      >
        <div
          style={{
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 0"
          }}
        >
          <h1>🎵 Spotify ML Recommender</h1>

          <div style={{ marginTop: "30px" }}>
            <input
              className="cursor-target"
              type="text"
              placeholder="Enter song name"
              value={song}
              onChange={(e) => setSong(e.target.value)}
              style={{
                padding: "10px",
                width: "260px",
                borderRadius: "8px",
                border: "none"
              }}
            />

            <button
              className="cursor-target"
              onClick={fetchRecommendations}
              style={{
                marginLeft: "10px",
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                background: "#CF9EFF",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Recommend
            </button>
          </div>

          {error && (
            <p style={{ color: "red", marginTop: "20px" }}>{error}</p>
          )}

          <div style={{ marginTop: "40px", width: "60%" }}>
            {recommendations.map((rec, index) => (
              <div
                className="cursor-target"
                key={index}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "12px",
                  padding: "15px",
                  marginBottom: "20px"
                }}
              >
                <h3 style={{ margin: 0 }}>{rec.song}</h3>
                <p style={{ margin: "4px 0 0", opacity: 0.7 }}>
                  {rec.artist}
                </p>
              </div>

            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
