import { useEffect, useState, useRef } from "react";

function Dashboard() {
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
  try {
    setSelected(h);

    const res = await fetch(
      `http://localhost:5000/match?lat=${h.Y}&lon=${h.X}&name=${h.Name}`
    );

    const data = await res.json();
    setAuthority(data);

    if (window.google) {
      setTimeout(() => {
        loadMap(h.Y, h.X, h.Name);
      }, 200);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

  // GOOGLE SATELLITE MAP
  const loadMap = (lat, lng, name) => {
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

    // REMOVE OLD MARKER
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // NEW MARKER WITH LABEL (IMPORTANT FIX)
    markerRef.current = new window.google.maps.Marker({
      position,
      map: mapInstance.current,
      title: name,
      label: {
        text: name,          // 🔥 HOTSPOT NAME FIX
        color: "white",
        fontSize: "12px",
        fontWeight: "bold",
      },
      animation: window.google.maps.Animation.DROP,
    });
  };

  // STREET VIEW
  const openStreetView = (lat, lng) => {
    window.open(
      `https://www.google.com/maps?q=&layer=c&cbll=${lat},${lng}`,
      "_blank"
    );
  };

  // DIRECTIONS
  const openDirections = (lat, lng) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <div className="container">

      {/* LEFT PANEL */}
      <div className="left">

        <h2>🔥 Hotspots</h2>

        {hotspots.map((h, i) => (
          <div
            key={i}
            className={`card ${selected?.Name === h.Name ? "active" : ""}`}
            onClick={() => selectHotspot(h)}
          >
            <h4>{h.Name}</h4>
            <p>{h.Y}, {h.X}</p>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL */}
      <div className="right">

        <div ref={mapRef} className="map"></div>

        {selected && (
          <div className="info">

            <h3>📍 {selected.Name}</h3>

            {authority && (
              <>
                <p><b>Zone:</b> {authority["Zone Name"]}</p>
                <p><b>Ward:</b> {authority["Ward Name"]}</p>
                <p><b>Phone:</b> {authority["Phone"]}</p>
                <p><b>Address:</b> {authority["Address"]}</p>
              </>
            )}

            <button onClick={() => openStreetView(selected.Y, selected.X)}>
              Street View
            </button>

            <button onClick={() => openDirections(selected.Y, selected.X)}>
              Directions
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;