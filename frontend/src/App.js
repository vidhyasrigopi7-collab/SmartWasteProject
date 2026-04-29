import { useState } from "react";
import "./App.css";
import PublicMode from "./PublicMode";
import AuthorityMode from "./AuthorityMode";

function App() {
  const [mode, setMode] = useState("");

  if (mode === "public") {
    return <PublicMode goBack={() => setMode("")} />;
  }

  if (mode === "authority") {
    return <AuthorityMode />;
  }

  return (
    <div className="home-screen">
      <h1>♻ Smart Waste Management</h1>
      <p>Select Your Mode</p>

      <div className="mode-buttons">
        <button onClick={() => setMode("public")}>🌍 Public Mode</button>
        <button onClick={() => setMode("authority")}>🏢 Authority Mode</button>
      </div>
    </div>
  );
}

export default App;