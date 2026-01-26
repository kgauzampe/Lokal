import React from "react";
import './PreviousProjects.scss'; // Optional, for styling

export default function PreviousProjects({ handyman }) {
  if (!handyman) return <p>Select a handyman to see their projects.</p>;

  const avgRating = handyman.ratings.length
    ? (handyman.ratings.reduce((a, b) => a + b, 0) / handyman.ratings.length).toFixed(1)
    : 0;

  return (
    <div className="projects-page">
      <h2>{handyman.name}'s Previous Projects</h2>
      <p>Average Rating: {avgRating} / 5</p>

      <div className="projects-grid">
        {handyman.projects.map((p, idx) => (
          <div key={idx} className="project-card">
            <img src={p.image} alt={`Project ${idx + 1}`} />
            <p>{p.comment}</p>
            <p>
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
