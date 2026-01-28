import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './RequestService.scss';

// TEMP – later comes from backend
const HANDYMEN = [
  { 
    id: "1", 
    name: "John the Plumber", 
    skill: "Plumbing",
    experience: 6, // in years
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
    experience: 3,
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
  
  // Filters
  const [disciplineFilter, setDisciplineFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");

  const [selectedHandymanLocal, setSelectedHandymanLocal] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookings, setBookings] = useState(
    JSON.parse(localStorage.getItem("bookings") || "[]")
  );
  const [success, setSuccess] = useState(false);

  if (!handymen) return null;

  // Derived filtered list based on discipline and experience
  const filteredHandymen = handymen.filter((h) => {
    const disciplineMatch = disciplineFilter === "all" || h.skill === disciplineFilter;
    const experienceMatch = experienceFilter === "all" || h.experience >= Number(experienceFilter);
    return disciplineMatch && experienceMatch;
  });

  // Available time slots
  const getAvailableSlots = () => {
    if (!selectedHandymanLocal || !selectedDate) return [];

    const booked = bookings
      .filter(b => b.handymanId === selectedHandymanLocal.id && b.date === selectedDate)
      .map(b => b.time);

    return TIME_SLOTS.filter(slot => !booked.includes(slot));
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

    // Reset selection
    setSelectedTime("");
    setSelectedDate("");
    setSelectedHandymanLocal(null);
  };

  const viewProjects = (handyman) => {
    setSelectedHandyman(handyman); // pass to App.js state
    navigate("/projects");
  };

  return (
    <div className="request-service">
      <h2>Handymen within 100km</h2>

      {/* Filters */}
      {!selectedHandymanLocal && (
       <div className="filters">
  <select
    value={disciplineFilter}
    onChange={(e) => setDisciplineFilter(e.target.value)}
  >
    <option value="all">All Disciplines</option>
    <option value="Plumbing">Plumbing</option>
    <option value="Electrical">Electrical</option>
    <option value="General Repairs">General Repairs</option>
  </select>

  <select
    value={experienceFilter}
    onChange={(e) => setExperienceFilter(e.target.value)}
  >
    <option value="all">All Experience</option>
    <option value="1">1+ years</option>
    <option value="3">3+ years</option>
    <option value="5">5+ years</option>
    <option value="10">10+ years</option>
  </select>
</div>

      )}

      {/* Handyman List */}
      {!selectedHandymanLocal && (
        <div className="handyman-list">
          {filteredHandymen.length === 0 && <p>No handymen match your filters.</p>}
          {filteredHandymen.map((h) => (
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
                <p>Experience: {h.experience} {h.experience === 1 ? "year" : "years"}</p>
              </div>
              <div className="handyman-actions">
                <button onClick={() => setSelectedHandymanLocal(h)}>Book</button>
                <button onClick={() => viewProjects(h)}>View Projects</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Panel */}
      {selectedHandymanLocal && (
        <div className="booking-panel">
          
          <img src={selectedHandymanLocal.profile} 
          style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }} 
          alt={selectedHandymanLocal.name} className="handyman-profile-large"/>
          
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
              {getAvailableSlots().length === 0 && <p>All slots are booked for this day.</p>}
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
              <button onClick={() => {
                setSelectedHandymanLocal(null);
                setSelectedDate("");
                setSelectedTime("");
              }}>Cancel</button>
            </div>
          )}

          {success && <div className="success-msg">Booking successful!</div>}
        </div>
      )}
    </div>
  );
}
