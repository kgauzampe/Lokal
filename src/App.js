import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import RequestService from "./pages/RequestService";
import PreviousProjects from "./pages/PreviousProjects";

const HANDYMEN = [
  { id: "1", name: "John the Plumber", skill: "Plumbing", lat: -27.78, lng: 30.82 },
  { id: "2", name: "Sipho Electric", skill: "Electrical", lat: -28.32, lng: 31.4 },
  { id: "3", name: "Mike Handyman", skill: "General Repairs", lat: -28.45, lng: 31.5 }
];

// Haversine distance in KM
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function App() {
  const [nearbyHandymen, setNearbyHandymen] = useState([]);
  const [selectedHandyman, setSelectedHandyman] = useState(null); // ✅ REQUIRED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        const filtered = HANDYMEN.filter(h =>
          getDistance(userLat, userLng, h.lat, h.lng) <= 20
        );

        setNearbyHandymen(filtered);
        setLoading(false);
      },
      () => {
        setError("Unable to access location");
        setLoading(false);
      }
    );
  }, []);

  return (
    <>
      <NavBar />

      <main className="app-content">
        {loading && <p>Detecting your location...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <Routes>
            <Route
              path="/"
              element={
                <RequestService
                  handymen={nearbyHandymen}
                  setSelectedHandyman={setSelectedHandyman}
                />
              }
            />

            <Route
              path="/projects"
              element={<PreviousProjects handyman={selectedHandyman} />}
            />
          </Routes>
        )}
      </main>

      <Footer />
    </>
  );
}
