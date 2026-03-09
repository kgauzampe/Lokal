import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import RequestService from "./pages/RequestService";
import PreviousProjects from "./pages/PreviousProjects";
import { supabase } from "./lib/supabase";
import Auth from "./pages/Auth";

// Full handyman data including profile, ratings, and projects
const HANDYMEN = [
  {
    id: "1",
    name: "John the Plumber",
    skill: "Plumbing",
    experience: 6,
    lat: -27.78,
    lng: 30.82,
    profile: "/img/1.jpeg",
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
    experience: 3,
    lat: -28.32,
    lng: 31.4,
    profile: "/img/2.jpeg",
    ratings: [4, 3, 5],
    projects: [
      { image: "/projects/e1.jpg", comment: "Installed lights neatly", rating: 5 }
    ]
  },
  {
    id: "3",
    name: "Mike Handyman",
    skill: "General Repairs",
    experience: 1,
    lat: -28.45,
    lng: 31.5,
    profile: "/img/3.jpeg",
    ratings: [3, 4],
    projects: [
      { image: "/projects/g1.jpg", comment: "Handled all minor repairs", rating: 4 }
    ]
  },
  {
    id: "4",
    name: "John Grass",
    skill: "Landscaper",
    experience: 6,
    lat: -27.42,
    lng: 30.81,
    profile: "/img/1.jpeg",
    ratings: [5, 4, 4, 5],
    projects: [
      { image: "/projects/p1.jpg", comment: "Fixed my leaking pipe perfectly!", rating: 5 },
      { image: "/projects/p2.jpg", comment: "Very fast and reliable", rating: 4 }
    ]
  },
];

// Haversine formula to calculate distance in KM
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
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  // Check Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.subscription.unsubscribe();
  }, []);

  // Get user's location and filter handymen within 100km
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
          getDistance(userLat, userLng, h.lat, h.lng) <= 100
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
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <NavBar session={session} />

      <main className="app-content">
        <Routes>
          {/* Default route */}
          <Route
            path="/"
            element={session ? <Navigate to="/request-service" /> : <Navigate to="/auth" />}
          />

          {/* Auth route */}
          <Route path="/auth" element={<Auth />} />

          {/* Protected routes (only show if logged in) */}
          {session && (
            <>
              <Route
                path="/request-service"
                element={
                  <RequestService
                    handymen={nearbyHandymen}
                    setSelectedHandyman={setSelectedHandyman}
                  />
                }
              />
              <Route
                path="/projects"
                element={
                  selectedHandyman ? (
                    <PreviousProjects handyman={selectedHandyman} />
                  ) : (
                    <p>Please select a handyman first.</p>
                  )
                }
              />
            </>
          )}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}