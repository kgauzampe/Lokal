import React, { useState } from "react";
import "./PreviousProjects.scss";

export default function PreviousProjects({ handyman }) {
  const [modalProject, setModalProject] = useState(null);

  if (!handyman) {
    return <p>Select a handyman to see their projects.</p>;
  }

  // Safety fallbacks 
  const ratings = handyman.ratings || [];
  const projects = handyman.projects || [];

  const avgRating = ratings.length
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : "No ratings yet";

  const openModal = (project) => setModalProject(project);
  const closeModal = () => setModalProject(null);

  return (
    <div className="projects-page">
      <h2>{handyman.name}'s Previous Projects</h2>

      <p>
        Average Rating: {avgRating}
        {ratings.length > 0 && " / 5"}
      </p>

      {projects.length === 0 && <p>No previous projects available.</p>}

      <div className="projects-grid">
        {projects.map((p, idx) => (
          <div key={idx} className="project-card" onClick={() => openModal(p)}>
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

      {modalProject && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>×</button>
            <img src={modalProject.image} alt="Project" />
            <p className="stars">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i}>{i < modalProject.rating ? "★" : "☆"}</span>
              ))}
            </p>
            <p>{modalProject.comment}</p>
          </div>
        </div>
      )}
    </div>
  );
}
