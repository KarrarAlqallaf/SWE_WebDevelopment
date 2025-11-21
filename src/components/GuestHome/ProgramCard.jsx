import React from 'react';
import './ProgramCard.css';

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
      className="program-card program-card--popular"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Open ${program.title}${program.author ? ` by ${program.author}` : ''}`}
    >
      <div className="program-card__meta">
        {program.shortLabel && (
          <span className="program-card__label">{program.shortLabel}</span>
        )}
        {program.durationHint && (
          <span className="program-card__duration">{program.durationHint}</span>
        )}
      </div>
      <h3 className="program-card__title">{program.title}</h3>
      <p className="program-card__description">{program.description || program.summary}</p>
      {program.tags && program.tags.length > 0 && (
        <ul className="program-card__tags">
          {program.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
    </button>
  );
};

export default ProgramCard;

