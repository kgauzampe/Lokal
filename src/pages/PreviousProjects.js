import React from "react";
import "./PreviousProjects.scss";

export default function PreviousProjects({ handyman }) {
  if (!handyman) {
    return <p>Select a handyman to see their projects.</p>;
  }

  // ✅ SAFETY FALLBACKS
  const ratings = handyman.ratings || [];
  const projects = handyman.projects || [];

  const avgRating = ratings.length
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : "No ratings yet";

  return (
    <div className="projects-page">
      <h2>{handyman.name}'s Previous Projects</h2>

      <p>
        Average Rating: {avgRating}
        {ratings.length > 0 && " / 5"}
      </p>

      {projects.length === 0 && (
        <p>No previous projects available.</p>
      )}

      <div className="projects-grid">
        {projects.map((p, idx) => (
          <div key={idx} className="project-card">
            <img src={p.image} alt={`Project ${idx + 1}`} />
            <p>{p.comment}</p>

            <p className="stars">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i}>{i < p.rating ? "★" : "☆"}</span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
