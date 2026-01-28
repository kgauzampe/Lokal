import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './RequestService.scss';

// TEMP – later comes from backend
const HANDYMEN = [
  { 
    id: "1", 
    name: "John the Plumber", 
    skill: "Plumbing",
    profile: "../../public/img/Niso.jpeg", // profile image
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
    profile: "/img/Niso.jpeg",
    ratings: [4, 3, 5],
    projects: [
      { image: "/projects/e1.jpg", comment: "Installed lights neatly", rating: 5 }
    ]
  }
];

// Sample time slots per day
const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM"
];

// Helper to calculate average rating
const getAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  return sum / ratings.length;
};

export default function RequestService({ handymen = [], setSelectedHandyman }) {
  const navigate = useNavigate();
  const [selectedHandymanLocal, setSelectedHandymanLocal] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookings, setBookings] = useState(
    JSON.parse(localStorage.getItem("bookings") || "[]")
  );
  const [success, setSuccess] = useState(false);

  if (!handymen) return null;

  // Get available slots for selected handyman and date
  const getAvailableSlots = () => {
    if (!selectedHandymanLocal || !selectedDate) return [];

    const booked = bookings
      .filter(
        (b) =>
          b.handymanId === selectedHandymanLocal.id && b.date === selectedDate
      )
      .map((b) => b.time);

    return TIME_SLOTS.filter((slot) => !booked.includes(slot));
  };

  const bookSlot = () => {
    if (!selectedHandymanLocal || !selectedDate || !selectedTime) return;

    const newBooking = {
      handymanId: selectedHandymanLocal.id,
      handymanName: selectedHandymanLocal.name,
      date: selectedDate,
      time: selectedTime,
      createdAt: new Date().toISOString()
    };

    const updatedBookings = [...bookings, newBooking];
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
    setSuccess(true);

    // Reset selection for next booking
    setSelectedTime("");
    setSelectedDate("");
    setSelectedHandymanLocal(null);
  };

  const viewProjects = (handyman) => {
    setSelectedHandyman(handyman); // pass to App.js state
    navigate("/projects"); // navigate to projects page
  };
  

  return (
    <div className="request-service">
      <h2>Handymen within 20km</h2>

      {handymen.length === 0 && <p>No handymen found near your location.</p>}

      {!selectedHandymanLocal && (
        <div className="handyman-list">
          {handymen.map((h) => (
            <div key={h.id} className="handyman-card">
              <img src={h.profile} alt={h.name} className="handyman-profile" />
              <div className="handyman-info">
                <strong>{h.name}</strong>
                <p>{h.skill}</p>
                <p>
                  Rating: {getAverageRating(h.ratings).toFixed(1)} / 5{" "}
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>{i < Math.round(getAverageRating(h.ratings)) ? "★" : "☆"}</span>
                  ))}
                </p>
              </div>
              <div className="handyman-actions">
                <button onClick={() => setSelectedHandymanLocal(h)}>
                  Book
                </button>
                <button onClick={() => viewProjects(h)}>
                  View Projects
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedHandymanLocal && (
        <div className="booking-panel">
          <img src={selectedHandymanLocal.profile} alt={selectedHandymanLocal.name} className="handyman-profile-large"/>
          <h3>Booking for {selectedHandymanLocal.name}</h3>

          <label>
            Select a date:{" "}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </label>

          {selectedDate && (
            <div className="time-slots">
              {getAvailableSlots().length === 0 && (
                <p>All slots are booked for this day.</p>
              )}

              {getAvailableSlots().map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={selectedTime === slot ? "selected" : ""}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}

          {selectedTime && (
            <div className="confirm-section">
              <p>
                Booking {selectedHandymanLocal.name} on {selectedDate} at {selectedTime}?
              </p>
              <button onClick={bookSlot}>Confirm Booking</button>
              <button
                onClick={() => {
                  setSelectedHandymanLocal(null);
                  setSelectedDate("");
                  setSelectedTime("");
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {success && <div className="success-msg">Booking successful!</div>}
        </div>
      )}
    </div>
  );
}
