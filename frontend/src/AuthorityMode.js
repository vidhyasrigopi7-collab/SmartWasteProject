import { useEffect, useState, useRef } from "react";
import "./App.css";

function AuthorityMode() {
  const [hotspots, setHotspots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [authority, setAuthority] = useState(null);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  // LOAD HOTSPOTS
  useEffect(() => {
    fetch("http://localhost:5000/hotspots")
      .then(res => res.json())
      .then(data => setHotspots(data))
      .catch(err => console.log(err));
  }, []);

  // SELECT HOTSPOT
  const selectHotspot = async (h) => {
    setSelected(h);

    const res = await fetch(
      `http://localhost:5000/match?lat=${h.Y}&lon=${h.X}&name=${h.Name}`
    );

    const data = await res.json();
    setAuthority(data);

    setTimeout(() => {
      loadSatellite(h.Y, h.X, h.Name);
    }, 300);
  };

  // SATELLITE MAP
  const loadSatellite = (lat, lng, name) => {
    if (!window.google || !mapRef.current) return;

    const position = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };

    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: position,
        zoom: 18,
        mapTypeId: "satellite",
      });
    } else {
      mapInstance.current.setCenter(position);
    }

    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    markerRef.current = new window.google.maps.Marker({
      position,
      map: mapInstance.current,
      title: name,
      label: {
        text: name,
        color: "white",
        fontSize: "14px",
        fontWeight: "bold",
      },
      animation: window.google.maps.Animation.DROP,
    });
  };

  // DIRECTIONS
  const openDirections = (lat, lng) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <div className="app-container">

      {/* LEFT PANEL */}
      <div className="left-panel">

        <div className="header-panel">
          <h1>🌍 Smart Waste Dashboard</h1>
          <p>Satellite + Street Monitoring System</p>
        </div>

        {hotspots.map((h, i) => (
          <div
            key={i}
            className={`card ${selected?.Name === h.Name ? "active" : ""}`}
            onClick={() => selectHotspot(h)}
          >
            <h3>{h.Name}</h3>
            <p>{h.Y}, {h.X}</p>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">

        <h2>Satellite View Panel</h2>

        {/* MAP */}
        <div ref={mapRef} className="map-box"></div>

        {/* INFO */}
        {selected && (
          <div className="info-panel">

            <h3>{selected.Name}</h3>

            {authority && (
              <>
                <p><b>Zone:</b> {authority["Zone Name"]}</p>
                <p><b>Ward:</b> {authority["Ward Name"]}</p>
                <p><b>Phone:</b> {authority["Phone"]}</p>
                <p><b>Address:</b> {authority["Address"]}</p>
              </>
            )}

            <div className="btn-group">
              <button onClick={() => openDirections(selected.Y, selected.X)}>
                Directions
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default AuthorityMode;