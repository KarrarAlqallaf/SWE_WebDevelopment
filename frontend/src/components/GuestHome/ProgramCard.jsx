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

  const handleProgramSelect = (program) => {
    if (onSelectProgram) {
      onSelectProgram(program);
    } else {
      console.log('Selected built-in program:', program);
    }
  };

  return (
  <button
    key={program.id}
    type="button"
    className="jadwal-program-card"
    onClick={() => handleProgramSelect(program)}
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

