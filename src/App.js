import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import RequestService from "./pages/RequestService";
import PreviousProjects from "./pages/PreviousProjects";

// Mock handyman data (replace later with API/db)
const HANDYMEN = [
  { 
    id: "1", 
    name: "John the Plumber", 
    skill: "Plumbing", 
    lat: -27.78, 
    lng: 30.82, 
    ratings: [5, 4, 4, 5],
    projects: [
      { image: "/projects/p1.jpg", comment: "Fixed my leaking pipe perfectly!", rating: 5 },
      { image: "/projects/p2.jpg", comment: "Very fast and reliable", rating: 4 }
    ]
  },
  { 
    id: "2", 
    name: "Sipho Electric", 
    skill: "Electrical", 
    lat: -28.32, 
    lng: 31.4,
    ratings: [4, 3, 5],
    projects: [
      { image: "/projects/e1.jpg", comment: "Installed lights neatly", rating: 5 }
    ]
  },
  { 
    id: "3", 
    name: "Mike Handyman", 
    skill: "General Repairs", 
    lat: -28.45, 
    lng: 31.5,
    ratings: [5, 5, 4],
    projects: [
      { image: "/projects/m1.jpg", comment: "Repaired my door", rating: 5 }
    ]
  }
];

// Haversine formula (distance in KM)
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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedHandyman, setSelectedHandyman] = useState(null);

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

  if (loading) return <p>Detecting your location...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
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
  );
}
