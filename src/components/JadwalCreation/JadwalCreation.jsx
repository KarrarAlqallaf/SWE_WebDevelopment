import React, { useMemo, useState } from 'react';
import './JadwalCreation.css';

const JadwalCreationPage = ({
  programs = [],
  categories = [],
  onSelectProgram,
  onCreateCustom
}) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleProgramSelect = (program) => {
    if (onSelectProgram) {
      onSelectProgram(program);
    } else {
      console.log('Selected built-in program:', program);
    }
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const handleResetCategories = () => {
    setSelectedCategories([]);
  };

  const handleCreateCustom = () => {
    if (onCreateCustom) {
      onCreateCustom(selectedCategories);
    } else {
      console.log('Creating custom Jadwal with categories:', selectedCategories);
    }
  };

  const selectedLabels = useMemo(() => {
    if (!selectedCategories.length) {
      return 'No categories selected yet.';
    }
    return categories
      .filter((category) => selectedCategories.includes(category.id))
      .map((category) => category.label)
      .join(', ');
  }, [categories, selectedCategories]);

  return (
    <section className="jadwal-creation">
      <div className="container">
        <header className="jadwal-creation__intro">
          <p className="jadwal-creation__eyebrow">Create Jadwal</p>
          <h1>Kickstart a new Jadwal in seconds</h1>
          <p>
            Choose one of the popular built-in programs to auto-fill a proven training split, or stitch together your
            own plan by tagging the categories that describe your focus.
          </p>
        </header>

        <section className="jadwal-creation__section" aria-labelledby="built-in-heading">
          <div className="jadwal-creation__section-heading">
            <div>
              <p className="jadwal-creation__eyebrow">Popular blueprints</p>
              <h2 id="built-in-heading">Built-in programs</h2>
            </div>
            <p>
              Selecting a program will take you to the builder with its structure pre-loaded.
            </p>
          </div>

          <div className="jadwal-creation__program-grid">
            {programs.map((program) => (
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
            ))}
          </div>
        </section>

        <section className="jadwal-creation__section" aria-labelledby="category-heading">
          <div className="jadwal-creation__section-heading">
            <div>
              <p className="jadwal-creation__eyebrow">Dial in the vibe</p>
              <h2 id="category-heading">Categories</h2>
            </div>
            <p>
              Tag your custom Jadwal with as many categories as you like—these will surface it in discovery later.
            </p>
          </div>

          <div className="jadwal-creation__categories-wrapper">
            <div className="jadwal-creation__categories">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    className={`jadwal-category ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => toggleCategory(category.id)}
                    aria-pressed={isSelected}
                  >
                    <span>{category.label}</span>
                    {isSelected && <span className="jadwal-category__indicator" aria-hidden="true">✓</span>}
                  </button>
                );
              })}
            </div>
            {selectedCategories.length > 0 && (
              <button
                type="button"
                className="jadwal-creation__reset-btn"
                onClick={handleResetCategories}
                aria-label="Clear all selected categories"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Reset
              </button>
            )}
          </div>

          <div className="jadwal-creation__actions">
            <div className="jadwal-creation__selection-summary">
              <p>Selected categories</p>
              <p>{selectedLabels}</p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleCreateCustom}
            >
              Create Custom Jadwal
            </button>
          </div>
        </section>
      </div>
    </section>
  );
};

export default JadwalCreationPage;


