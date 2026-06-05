import { useEffect, useState, useRef } from "react";

const BACKEND = "https://smartwasteproject-2.onrender.com";

function AuthorityMode({ goBack }) {
  const [hotspots, setHotspots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [authority, setAuthority] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    fetch(`${BACKEND}/hotspots`, { headers: { "ngrok-skip-browser-warning": "true" } })
      .then(res => res.json())
      .then(data => { setHotspots(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (view === "map" && selected && mapRef.current) {
      setTimeout(() => loadLeafletMap(selected.Y, selected.X, selected.Name), 300);
    }
  }, [view, selected]);

  const selectHotspot = async (h) => {
    setSelected(h);
    setAuthority(null);
    setView("map");
    try {
      const res = await fetch(
        `${BACKEND}/match?lat=${h.Y}&lon=${h.X}&name=${encodeURIComponent(h.Name)}`,
        { headers: { "ngrok-skip-browser-warning": "true" } }
      );
      setAuthority(await res.json());
    } catch(e) {}
  };

  const loadLeafletMap = (lat, lng, name) => {
    if (!window.L || !mapRef.current) return;
    const latF = parseFloat(lat);
    const lngF = parseFloat(lng);

    // Remove old map
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    // Create new Leaflet map with satellite tiles
    mapInstance.current = window.L.map(mapRef.current).setView([latF, lngF], 17);

    // Satellite tile layer (free, no API key)
    window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri',
      maxZoom: 19
    }).addTo(mapInstance.current);

    // Marker
    const marker = window.L.marker([latF, lngF]).addTo(mapInstance.current);
    marker.bindPopup(`<b>📍 ${name}</b>`).openPopup();
  };

  const openDirections = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  const S = {
    page: { minHeight:"100vh", background:"linear-gradient(160deg,#e8f8ef,#d4f5e2)", fontFamily:"'Poppins',sans-serif" },
    header: { background:"linear-gradient(135deg,#27ae60,#2ecc71)", padding:"1rem 1.5rem", display:"flex", alignItems:"center", gap:"1rem", boxShadow:"0 4px 16px rgba(46,204,113,0.3)" },
    backBtnWhite: { background:"rgba(255,255,255,0.2)", border:"2px solid rgba(255,255,255,0.5)", color:"white", padding:"7px 16px", borderRadius:"10px", cursor:"pointer", fontWeight:700, fontFamily:"'Poppins',sans-serif", fontSize:"0.85rem" },
    card: { background:"white", border:"2px solid #d4f5e2", borderRadius:"16px", padding:"1rem 1.25rem", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 4px 12px rgba(0,0,0,0.06)", transition:"all 0.2s", marginBottom:"0.75rem" },
    badge: { background:"linear-gradient(135deg,#2ecc71,#27ae60)", color:"white", padding:"7px 16px", borderRadius:"50px", fontWeight:700, fontSize:"0.85rem", flexShrink:0 },
  };

  // ── LIST VIEW ──────────────────────────────────────────────
  if (view === "list") {
    return (
      <div style={S.page}>
        <div style={S.header}>
          <button style={S.backBtnWhite} onClick={goBack}>⬅ Home</button>
          <div>
            <h1 style={{fontFamily:"'Baloo 2',cursive", fontSize:"1.4rem", color:"white", margin:0}}>🌍 Authority Dashboard</h1>
            <p style={{color:"rgba(255,255,255,0.85)", fontSize:"0.78rem", fontWeight:600, margin:0}}>Select a hotspot to view satellite map</p>
          </div>
        </div>
        <div style={{padding:"1.25rem", maxWidth:"700px", margin:"0 auto"}}>
          {loading && <p style={{textAlign:"center", color:"#5a7a5e", padding:"2rem", fontWeight:600}}>⏳ Loading hotspots...</p>}
          {hotspots.map((h, i) => (
            <div key={i} style={S.card}
              onClick={() => selectHotspot(h)}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#2ecc71"; e.currentTarget.style.transform="translateX(5px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#d4f5e2"; e.currentTarget.style.transform="none"; }}
            >
              <div>
                <div style={{fontWeight:700, fontSize:"1rem", color:"#1a2e1d"}}>📍 {h.Name}</div>
                <div style={{fontSize:"0.75rem", color:"#5a7a5e", fontWeight:600, marginTop:"2px"}}>
                  {parseFloat(h.Y).toFixed(4)}, {parseFloat(h.X).toFixed(4)}
                </div>
              </div>
              <div style={S.badge}>View →</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── MAP VIEW ───────────────────────────────────────────────
  return (
    <div style={{display:"flex", flexDirection:"column", height:"100vh", fontFamily:"'Poppins',sans-serif", overflow:"hidden"}}>

      {/* Top Bar */}
      <div style={{...S.header, flexShrink:0}}>
        <button style={S.backBtnWhite} onClick={() => { if(mapInstance.current){mapInstance.current.remove(); mapInstance.current=null;} setView("list"); }}>⬅ Back</button>
        <div>
          <div style={{fontFamily:"'Baloo 2',cursive", fontSize:"1.1rem", color:"white", fontWeight:800}}>📍 {selected?.Name}</div>
          <div style={{fontSize:"0.72rem", color:"rgba(255,255,255,0.85)", fontWeight:600}}>
            {parseFloat(selected?.Y).toFixed(4)}, {parseFloat(selected?.X).toFixed(4)}
          </div>
        </div>
      </div>

      {/* Leaflet Satellite Map */}
      <div ref={mapRef} style={{flex:"1 1 0", width:"100%", minHeight:0}} />

      {/* Details Panel */}
      <div style={{
        flexShrink:0, height:"260px",
        background:"white", borderTop:"3px solid #d4f5e2",
        overflowY:"auto", padding:"1rem 1.25rem",
        boxShadow:"0 -4px 16px rgba(46,204,113,0.1)"
      }}>
        {authority ? (
          <>
            <h3 style={{fontFamily:"'Baloo 2',cursive", fontSize:"1rem", color:"#27ae60", marginBottom:"0.6rem"}}>
              🏛️ Responsible Authority
            </h3>
            {[
              { label:"🏙️ Zone",    value: authority["Zone Name"] },
              { label:"🏘️ Ward",    value: authority["Ward Name"] },
              { label:"📞 Phone",   value: authority["Phone"] },
              { label:"📬 Address", value: authority["Address"] },
            ].map((row, i) => (
              <div key={i} style={{
                display:"flex", justifyContent:"space-between", alignItems:"flex-start",
                padding:"0.45rem 0.75rem", marginBottom:"0.35rem",
                background:"#f0faf4", borderRadius:"10px",
                border:"1px solid #d4f5e2", fontSize:"0.82rem"
              }}>
                <span style={{color:"#5a7a5e", fontWeight:700, flexShrink:0, marginRight:"1rem"}}>{row.label}</span>
                <span style={{color:"#1a2e1d", fontWeight:700, textAlign:"right"}}>{row.value}</span>
              </div>
            ))}
            <div style={{display:"flex", gap:"0.6rem", marginTop:"0.6rem"}}>
              <button onClick={() => openDirections(selected.Y, selected.X)} style={{
                flex:1, padding:"0.8rem",
                background:"linear-gradient(135deg,#3498db,#2980b9)",
                border:"none", borderRadius:"12px",
                color:"white", fontWeight:700, fontSize:"0.85rem",
                fontFamily:"'Poppins',sans-serif", cursor:"pointer",
                boxShadow:"0 4px 14px rgba(52,152,219,0.3)"
              }}>🧭 Directions</button>
              <button onClick={() => window.open(`https://www.google.com/maps/@${selected.Y},${selected.X},3a,80y,0h,90t/data=!3m1!1e1`, "_blank")} style={{
                flex:1, padding:"0.8rem",
                background:"linear-gradient(135deg,#e74c3c,#c0392b)",
                border:"none", borderRadius:"12px",
                color:"white", fontWeight:700, fontSize:"0.85rem",
                fontFamily:"'Poppins',sans-serif", cursor:"pointer",
                boxShadow:"0 4px 14px rgba(231,76,60,0.3)"
              }}>🚶 Street View</button>
            </div>
          </>
        ) : (
          <div style={{textAlign:"center", padding:"1.5rem", color:"#5a7a5e", fontWeight:600}}>
            ⏳ Loading authority details...
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthorityMode;
