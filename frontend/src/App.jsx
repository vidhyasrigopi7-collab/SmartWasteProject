import { useState } from "react";
import PublicMode from "./PublicMode";
import AuthorityMode from "./AuthorityMode";
import "./App.css";

function App() {
  const [mode, setMode] = useState("");

  if (mode === "public") return <PublicMode goBack={() => setMode("")} />;
  if (mode === "authority") return <AuthorityMode goBack={() => setMode("")} />;

  return (
    <div className="home-screen">
      <div className="home-logo">♻️</div>
      <h1>Smart Waste Management</h1>
      <p className="home-subtitle">🌿 Chennai Smart City Project</p>

      <div className="mode-buttons">
        <button className="mode-btn public-btn" onClick={() => setMode("public")}>
          <span className="mode-icon">🌍</span>
          <span className="mode-label">Public Mode</span>
          <span className="mode-desc">Quiz & Report Garbage</span>
        </button>

        <button className="mode-btn authority-btn" onClick={() => setMode("authority")}>
          <span className="mode-icon">🏢</span>
          <span className="mode-label">Authority Mode</span>
          <span className="mode-desc">Satellite Dashboard</span>
        </button>
      </div>
    </div>
  );
}

export default App;
