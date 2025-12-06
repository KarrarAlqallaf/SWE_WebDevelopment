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
        <span className="jadwal-program-card__label">{program.shortLabel || '\u00a0'}</span>
        <span className="jadwal-program-card__duration">{program.durationHint || '\u00a0'}</span>
      </div>
      <h3>{program.title || 'Untitled Program'}</h3>
      <p>{program.description || '\u00a0'}</p>
      <ul className="jadwal-program-card__tags">
        {program.tags?.length > 0 ? (
          program.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))
        ) : null}
      </ul>
      {program.author && (
        <p className="jadwal-program-card__author">By {program.author}</p>
      )}
      <p className="jadwal-program-card__rating">
        {(program.rating || 0).toFixed(1)}/5 ({(program.ratingCount || 0)})
      </p>
    </button>
  );
};

export default ProgramCard;
