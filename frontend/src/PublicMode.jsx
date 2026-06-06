import { useState, useEffect, useRef } from "react";

const BACKEND = "https://olinda-unreplaceable-unlarcenously.ngrok-free.dev";

const level1Questions = [
  { question: "Where should plastic bottles go?", options: ["Dry Waste","Wet Waste","Hazardous"], answer: "Dry Waste", explanation: "Plastic bottles are recyclable dry waste." },
  { question: "Where should banana peels go?", options: ["Wet Waste","Dry Waste","E-Waste"], answer: "Wet Waste", explanation: "Banana peels are biodegradable wet waste." },
  { question: "Where should batteries go?", options: ["Hazardous","Wet Waste","Dry Waste"], answer: "Hazardous", explanation: "Batteries contain harmful chemicals." },
  { question: "Where should paper go?", options: ["Dry Waste","Wet Waste","Medical"], answer: "Dry Waste", explanation: "Paper is recyclable dry waste." },
  { question: "Where should leftover food go?", options: ["Wet Waste","Dry Waste","Hazardous"], answer: "Wet Waste", explanation: "Food waste is biodegradable." },
  { question: "Where should glass bottles go?", options: ["Dry Waste","Wet Waste","E-Waste"], answer: "Dry Waste", explanation: "Glass is recyclable." },
  { question: "Where should old medicines go?", options: ["Hazardous","Dry Waste","Wet Waste"], answer: "Hazardous", explanation: "Medicines can be dangerous." },
  { question: "Where should leaves go?", options: ["Wet Waste","Dry Waste","Plastic"], answer: "Wet Waste", explanation: "Leaves decompose naturally." },
  { question: "Where should cardboard go?", options: ["Dry Waste","Wet Waste","Hazardous"], answer: "Dry Waste", explanation: "Cardboard is recyclable." },
  { question: "Where should broken electronics go?", options: ["E-Waste","Wet Waste","Dry Waste"], answer: "E-Waste", explanation: "Electronics are e-waste." },
];

const level2Questions = [
  { question: "How many years does plastic take to decompose?", options: ["50 Years","450 Years","5 Years"], answer: "450 Years", explanation: "Plastic can take around 450 years." },
  { question: "What color bin is used for dry waste?", options: ["Blue","Green","Red"], answer: "Blue", explanation: "Blue bins are used for dry waste." },
  { question: "What color bin is for wet waste?", options: ["Green","Blue","Red"], answer: "Green", explanation: "Green bins are for wet waste." },
  { question: "What gas is released from landfills?", options: ["Methane","Oxygen","Nitrogen"], answer: "Methane", explanation: "Landfills release methane gas." },
  { question: "Which waste can be recycled?", options: ["Plastic","Food","Leaves"], answer: "Plastic", explanation: "Plastic can often be recycled." },
  { question: "How can we reduce waste?", options: ["Reuse","Burn","Throw"], answer: "Reuse", explanation: "Reusing reduces waste." },
  { question: "Which is hazardous?", options: ["Battery","Paper","Food"], answer: "Battery", explanation: "Batteries are hazardous." },
  { question: "What is composting?", options: ["Turning food waste into manure","Burning waste","Throwing plastic"], answer: "Turning food waste into manure", explanation: "Composting creates manure." },
  { question: "What should be avoided?", options: ["Single-use plastic","Cloth bags","Steel bottles"], answer: "Single-use plastic", explanation: "Single-use plastic increases pollution." },
  { question: "Why recycle?", options: ["Save resources","Increase waste","Cause pollution"], answer: "Save resources", explanation: "Recycling saves resources." },
];

function QuizSection() {
  const [page, setPage] = useState("welcome");
  const [level, setLevel] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showAnswerOptions, setShowAnswerOptions] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [level1Score, setLevel1Score] = useState(0);
  const [level2Score, setLevel2Score] = useState(0);

  const currentQuestions = level===1 ? level1Questions : level2Questions;
  const currentQuestion = currentQuestions[questionIndex];
  const progress = level===1 ? ((questionIndex+1)/10)*50 : 50+((questionIndex+1)/10)*50;

  const handleAnswer = (option) => {
    if (answered) return;
    setAnswered(true);
    if (option === currentQuestion.answer) {
      if (level===1) setLevel1Score(s=>s+1); else setLevel2Score(s=>s+1);
      setFeedback(`✅ Correct! ${currentQuestion.explanation}`);
    } else {
      setFeedback(`❌ Wrong! Correct: ${currentQuestion.answer}. ${currentQuestion.explanation}`);
    }
  };

  const nextQuestion = () => {
    setFeedback(""); setShowAnswerOptions(false); setAnswered(false);
    if (questionIndex+1 < currentQuestions.length) setQuestionIndex(questionIndex+1);
    else setPage(level===1 ? "level1Complete" : "final");
  };

  if (page==="welcome") return (
    <div className="quiz-welcome">
      <div className="quiz-icon">🎮</div>
      <h2>Eco Warrior Challenge</h2>
      <p>Test your waste management knowledge across 2 fun levels! 🌿</p>
      <button className="quiz-start-btn" onClick={() => setPage("game")}>🚀 Start Quiz!</button>
    </div>
  );

  if (page==="level1Complete") return (
    <div className="quiz-complete">
      <div style={{fontSize:"5rem"}}>🎉</div>
      <h2>Level 1 Complete!</h2>
      <div className="score-badge" style={{fontSize:"1.4rem",padding:"10px 24px",margin:"1rem auto",display:"inline-block"}}>{level1Score}/10</div>
      <br/>
      <button className="quiz-start-btn" onClick={() => { setLevel(2); setQuestionIndex(0); setPage("game"); }}>🧠 Start Level 2!</button>
    </div>
  );

  if (page==="final") return (
    <div className="quiz-complete">
      <div style={{fontSize:"5rem"}}>🏆</div>
      <h2>Challenge Complete!</h2>
      <div className="score-row"><span>🎯 Level 1</span><span className="score-badge">{level1Score}/10</span></div>
      <div className="score-row"><span>🧠 Level 2</span><span className="score-badge">{level2Score}/10</span></div>
      <div className="score-row total"><span>⭐ Total</span><span className="score-badge gold">{level1Score+level2Score}/20</span></div>
      <button className="quiz-start-btn" onClick={() => { setPage("welcome"); setLevel(1); setQuestionIndex(0); setLevel1Score(0); setLevel2Score(0); }}>🔄 Play Again!</button>
    </div>
  );

  return (
    <div className="quiz-game">
      <div className="quiz-header">
        <span className="level-tag">{level===1 ? "🎯 Level 1" : "🧠 Level 2"}</span>
        <span className="q-count">Q{questionIndex+1} / 10</span>
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{width:`${progress}%`}}/>
        <span className="progress-label">{Math.floor(progress)}%</span>
      </div>
      <h3 className="quiz-question">❓ {currentQuestion.question}</h3>
      {level===2 && !showAnswerOptions && !feedback && (
        <div className="hint-row">
          <button className="hint-btn" onClick={() => setShowAnswerOptions(true)}>💡 I have an idea!</button>
          <button className="hint-btn" onClick={() => { setAnswered(true); setFeedback(`ℹ️ Answer: ${currentQuestion.answer}. ${currentQuestion.explanation}`); }}>🤔 I don't know</button>
        </div>
      )}
      {(level===1 || showAnswerOptions) && !answered && (
        <div className="options-grid">
          {currentQuestion.options.map((opt,i) => (
            <button key={i} className="option-btn" onClick={() => handleAnswer(opt)}>
              {["🅐","🅑","🅒"][i]} {opt}
            </button>
          ))}
        </div>
      )}
      {feedback && (
        <div className={`feedback-box ${feedback.startsWith("✅")?"correct":feedback.startsWith("ℹ")?"info":"wrong"}`}>
          <p>{feedback}</p>
          <button className="next-btn" onClick={nextQuestion}>Next Question →</button>
        </div>
      )}
    </div>
  );
}

function CitizenReport() {
  const [gpsStatus, setGpsStatus] = useState("capturing");
  const [userLat, setUserLat] = useState(null);
  const [userLon, setUserLon] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewBase64, setPreviewBase64] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [result, setResult] = useState(null);
  const [authority, setAuthority] = useState(null);
  const [saveMsg, setSaveMsg] = useState("");
  const galleryRef = useRef();
  const cameraRef = useRef();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setUserLat(pos.coords.latitude); setUserLon(pos.coords.longitude); setGpsStatus("ready"); },
        () => setGpsStatus("error"),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else { setGpsStatus("error"); }
  }, []);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setPreview(ev.target.result); setPreviewBase64(ev.target.result); };
    reader.readAsDataURL(file);
    setResult(null); setAuthority(null); setSaveMsg("");
  };

  const detect = async () => {
    const file = galleryRef.current?.files[0] || cameraRef.current?.files[0];
    if (!file) { alert("📸 Please select a photo first!"); return; }
    if (!userLat || !userLon) { alert("📍 GPS not ready. Please allow location access!"); return; }
    setDetecting(true); setResult(null); setAuthority(null); setSaveMsg("");
    try {
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("lat", userLat);
      formData.append("lon", userLon);
      const res = await fetch(`${BACKEND}/detect`, { 
        method:"POST", 
        body:formData,
        signal: AbortSignal.timeout(120000)
      });
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Backend starting up! Please wait 60 seconds and try again!");
      }
      const data = await res.json();
      setResult(data);
      let auth = null;
      if (data.level !== "success") {
        const matchRes = await fetch(`${BACKEND}/match?lat=${userLat}&lon=${userLon}&name=`, {signal: AbortSignal.timeout(30000)});
        auth = await matchRes.json();
        setAuthority(auth);
        const saveRes = await fetch(`${BACKEND}/save_report`, {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ lat:userLat, lon:userLon, confidence:data.confidence, status:data.status, level:data.level, authority:auth, photo:previewBase64 })
        });
        const saveData = await saveRes.json();
        setSaveMsg(saveData.saved ? "✅ Report saved to dashboard!" : "ℹ️ " + saveData.reason);
      }
    } catch(err) {
      alert("❌ Error: " + err.message + " | " + err.name);
    } finally { setDetecting(false); }
  };

  // ── CORRECT URLS ──────────────────────────────────────────
  const mapsUrl = userLat && userLon
    ? `https://www.google.com/maps/search/?api=1&query=${userLat},${userLon}`
    : "#";
  const streetUrl = userLat && userLon
    ? `https://www.google.com/maps/@${userLat},${userLon},3a,75y,90h,90t/data=!3m1!1e1`
    : "#";

  return (
    <div className="citizen-report">
      <h2>🗑️ Report Garbage</h2>
      <p className="citizen-sub">Take a photo — AI detects garbage and saves to dashboard!</p>
      <div className={`gps-badge ${gpsStatus}`}>
        {gpsStatus==="capturing" && "📍 Capturing GPS..."}
        {gpsStatus==="ready" && `📍 GPS Ready! ${userLat?.toFixed(4)}, ${userLon?.toFixed(4)}`}
        {gpsStatus==="error" && "❌ GPS Error — Please allow location access"}
      </div>
      {preview && <img src={preview} alt="preview" style={{maxWidth:"280px",maxHeight:"200px",objectFit:"cover",borderRadius:"16px",display:"block",margin:"0 auto 1rem",boxShadow:"0 8px 24px rgba(0,0,0,0.15)"}}/>}
      <div style={{display:"flex",gap:"12px",justifyContent:"center",marginBottom:"1.25rem"}}>
        <label style={{background:"linear-gradient(135deg,#27ae60,#2ecc71)",color:"white",padding:"13px 22px",borderRadius:"14px",cursor:"pointer",fontWeight:700,fontSize:"0.92rem",fontFamily:"'Poppins',sans-serif",boxShadow:"0 4px 14px rgba(46,204,113,0.35)",display:"flex",alignItems:"center",gap:"8px"}}>
          📁 Gallery
          <input ref={galleryRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
        </label>
        <label style={{background:"linear-gradient(135deg,#3498db,#2980b9)",color:"white",padding:"13px 22px",borderRadius:"14px",cursor:"pointer",fontWeight:700,fontSize:"0.92rem",fontFamily:"'Poppins',sans-serif",boxShadow:"0 4px 14px rgba(52,152,219,0.35)",display:"flex",alignItems:"center",gap:"8px"}}>
          📷 Camera
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{display:"none"}}/>
        </label>
      </div>
      <button className="detect-btn" onClick={detect} disabled={detecting}>
        {detecting ? "⏳ Detecting..." : "🔍 Detect Garbage"}
      </button>
      {saveMsg && (
        <div style={{padding:"0.75rem 1rem",borderRadius:"12px",marginBottom:"1rem",fontWeight:700,fontSize:"0.88rem",background:saveMsg.startsWith("✅")?"#d4edda":"#dbeafe",border:saveMsg.startsWith("✅")?"2px solid #2ecc71":"2px solid #3498db",color:saveMsg.startsWith("✅")?"#155724":"#1a3a5c"}}>
          {saveMsg}
        </div>
      )}
      {result && (
        <div className={`result-card ${result.level}`}>
          <div className="result-status">{result.level==="danger"&&"🚨 "}{result.level==="warning"&&"⚠️ "}{result.level==="success"&&"✅ "}{result.status}</div>
          <div className="result-confidence">📊 Confidence: {result.confidence}%</div>
          {result.level !== "success" && (
            <>
              <div style={{fontSize:"0.82rem",color:"#555",margin:"6px 0",fontWeight:600}}>
                📍 {parseFloat(result.latitude).toFixed(5)}, {parseFloat(result.longitude).toFixed(5)}
              </div>
              <div className="map-links">
                <a href={streetUrl} target="_blank" rel="noreferrer" className="street-btn" style={{flex:1}}>🚶 Street View</a>
              </div>
              {authority && (
                <div className="authority-box">
                  <h4>🏛️ Responsible Authority</h4>
                  <div className="auth-row"><span>Zone</span><strong>{authority["Zone Name"]}</strong></div>
                  <div className="auth-row"><span>Ward</span><strong>{authority["Ward Name"]}</strong></div>
                  <div className="auth-row"><span>Phone</span><strong>{authority["Phone"]}</strong></div>
                  <div className="auth-row"><span>Address</span><strong>{authority["Address"]}</strong></div>
                </div>
              )}
            </>
          )}
          {result.level==="success" && <div className="clean-msg">🌿 Clean Area — No Action Needed!</div>}
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND}/reports`)
      .then(res => res.json())
      .then(data => { setReports(data.reverse()); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{textAlign:"center",padding:"3rem",color:"#5a7a5e",fontWeight:600}}>⏳ Loading reports...</div>;

  if (reports.length === 0) return (
    <div style={{textAlign:"center",padding:"3rem"}}>
      <div style={{fontSize:"4rem"}}>📋</div>
      <p style={{color:"#5a7a5e",fontWeight:600,marginTop:"1rem"}}>No reports yet!</p>
      <p style={{color:"#90a890",fontSize:"0.88rem"}}>Reports appear here after garbage is detected.</p>
    </div>
  );

  return (
    <div style={{paddingBottom:"1rem"}}>
      <h2 style={{fontFamily:"'Baloo 2',cursive",color:"#27ae60",marginBottom:"0.5rem",fontSize:"1.5rem"}}>📋 Garbage Reports</h2>
      <p style={{color:"#5a7a5e",fontSize:"0.85rem",marginBottom:"1.25rem",fontWeight:600}}>{reports.length} report{reports.length>1?"s":""} found</p>
      {reports.map((r, i) => {
        // ── CORRECT URLS FOR DASHBOARD ────────────────────
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lon}`;
        const streetUrl = `https://www.google.com/maps/@${r.lat},${r.lon},3a,75y,90h,90t/data=!3m1!1e1`;
        return (
          <div key={i} style={{background:"white",borderRadius:"18px",marginBottom:"1rem",border:`2px solid ${r.level==="danger"?"#e74c3c":r.level==="warning"?"#f39c12":"#2ecc71"}`,overflow:"hidden",boxShadow:"0 4px 16px rgba(0,0,0,0.08)"}}>
            {r.photo && <img src={r.photo} alt="garbage" style={{width:"100%",height:"180px",objectFit:"cover",display:"block"}}/>}
            <div style={{padding:"1rem"}}>
              <div style={{fontFamily:"'Baloo 2',cursive",fontSize:"1.05rem",fontWeight:800,color:r.level==="danger"?"#c0392b":r.level==="warning"?"#e67e22":"#27ae60",marginBottom:"0.4rem"}}>
                {r.level==="danger"&&"🚨 "}{r.level==="warning"&&"⚠️ "}{r.status}
              </div>
              <div style={{fontSize:"0.82rem",color:"#5a7a5e",fontWeight:600,marginBottom:"0.2rem"}}>📊 Confidence: {r.confidence}%</div>
              <div style={{fontSize:"0.82rem",color:"#5a7a5e",fontWeight:600,marginBottom:"0.2rem"}}>📍 {r.lat?.toFixed(5)}, {r.lon?.toFixed(5)}</div>
              <div style={{fontSize:"0.78rem",color:"#90a890",marginBottom:"0.75rem"}}>🕐 {r.timestamp}</div>
              {r.authority && (
                <div style={{background:"#f0faf4",borderRadius:"10px",padding:"0.6rem 0.75rem",marginBottom:"0.75rem",border:"1px solid #d4f5e2"}}>
                  <div style={{fontSize:"0.82rem",fontWeight:700,color:"#27ae60",marginBottom:"0.3rem"}}>🏛️ Authority</div>
                  <div style={{fontSize:"0.8rem",color:"#1a2e1d",fontWeight:600}}>{r.authority["Zone Name"]} — {r.authority["Ward Name"]}</div>
                  <div style={{fontSize:"0.78rem",color:"#5a7a5e"}}>📞 {r.authority["Phone"]}</div>
                </div>
              )}
              <div style={{display:"flex",gap:"0.6rem"}}>
                <a href={mapsUrl} target="_blank" rel="noreferrer" style={{flex:1,padding:"0.7rem",borderRadius:"10px",background:"linear-gradient(135deg,#e74c3c,#c0392b)",color:"white",textAlign:"center",fontWeight:700,fontSize:"0.82rem",textDecoration:"none"}}>🗺️ Location</a>
                <a href={streetUrl} target="_blank" rel="noreferrer" style={{flex:1,padding:"0.7rem",borderRadius:"10px",background:"linear-gradient(135deg,#3498db,#2980b9)",color:"white",textAlign:"center",fontWeight:700,fontSize:"0.82rem",textDecoration:"none"}}>🚶 Street View</a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PublicMode({ goBack }) {
  const [tab, setTab] = useState("quiz");
  return (
    <div className="public-page">
      <div className="public-header">
        <button className="back-btn" onClick={goBack}>⬅ Home</button>
        <h1>🌍 Public Mode</h1>
      </div>
      <div className="tab-bar">
        <button className={`tab-btn ${tab==="quiz"?"active":""}`} onClick={() => setTab("quiz")}>🎮 Quiz</button>
        <button className={`tab-btn ${tab==="report"?"active":""}`} onClick={() => setTab("report")}>📸 Report</button>
        <button className={`tab-btn ${tab==="dashboard"?"active":""}`} onClick={() => setTab("dashboard")}>📋 Dashboard</button>
      </div>
      <div className="tab-content">
        {tab==="quiz" && <QuizSection />}
        {tab==="report" && <CitizenReport />}
        {tab==="dashboard" && <Dashboard />}
      </div>
    </div>
  );
}

export default PublicMode;
