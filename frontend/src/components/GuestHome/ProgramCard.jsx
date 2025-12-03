import React from 'react';
import './ProgramCard.css';

// Reusable program card used on Home (Popular Programs) and in the Vault.
// It forwards clicks up via the `onClick` prop with the program's id,
// which matches how `App.jsx` expects to open program details.
const ProgramCard = ({ program, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(program.id);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      className="jadwal-program-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Select ${program.title}`}
    >
      <div className="jadwal-program-card__meta">
        <span className="jadwal-program-card__label">{program.shortLabel}</span>
        <span className="jadwal-program-card__duration">{program.durationHint}</span>
      </div>
      <h3>{program.title}</h3>
      <p>{program.description}</p>
      {program.tags?.length > 0 && (
        <ul className="jadwal-program-card__tags">
          {program.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
    </button>
  );
};

export default ProgramCard;
