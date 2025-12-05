import React, { useState } from 'react';
import './ExerciseCreation.css';
import { idGenerator } from '../../utils/idGenerator';

const ExerciseCreation = ({
  exercise: exerciseData,
  muscle,
  onEdit,
  onDelete,
  onUpdate
}) => {
  const [unit, setUnit] = useState(exerciseData?.unit || 'KG');
  const [sets, setSets] = useState(exerciseData?.sets || [
    { id: idGenerator.getSetId(), weight: '', reps: '' },
    { id: idGenerator.getSetId(), weight: '', reps: '' },
    { id: idGenerator.getSetId(), weight: '', reps: '' }
  ]);
  const [notes, setNotes] = useState(exerciseData?.notes || '');
  const [showExerciseMenu, setShowExerciseMenu] = useState(false);
  const [showSetMenu, setShowSetMenu] = useState(null);

  const exerciseName = exerciseData?.name || exerciseData || '';

  const handleAddSet = () => {
    const newSet = {
      id: idGenerator.getSetId(),
      weight: '',
      reps: ''
    };
    const updatedSets = [...sets, newSet];
    setSets(updatedSets);
    if (onUpdate) {
      onUpdate({ sets: updatedSets, unit, notes });
    }
  };

  const handleDeleteSet = (setId) => {
    const newSets = sets.filter(s => s.id !== setId);
    setSets(newSets);
    setShowSetMenu(null);
    if (onUpdate) {
      onUpdate({ sets: newSets, unit, notes });
    }
  };

  const handleSetChange = (setId, field, value) => {
    const newSets = sets.map(set =>
      set.id === setId ? { ...set, [field]: value } : set
    );
    setSets(newSets);
    if (onUpdate) {
      onUpdate({ sets: newSets, unit, notes });
    }
  };

  const handleUnitToggle = () => {
    const newUnit = unit === 'KG' ? 'LBS' : 'KG';
    setUnit(newUnit);
    if (onUpdate) {
      onUpdate({ sets, unit: newUnit, notes });
    }
  };

  const handleNotesChange = (value) => {
    setNotes(value);
    if (onUpdate) {
      onUpdate({ sets, unit, notes: value });
    }
  };

  const handleEdit = () => {
    setShowExerciseMenu(false);
    if (onEdit) {
      onEdit();
    }
  };

  const handleDelete = () => {
    setShowExerciseMenu(false);
    if (onDelete) {
      onDelete();
    }
  };


  return (
    <div className="exercise-creation">
      <div className="exercise-creation__header">
        <div className="exercise-creation__title-section">
          <h2 className="exercise-creation__title">{exerciseName}</h2>
          <p className="exercise-creation__subtitle">{sets.length} sets 6-8 reps</p>
        </div>
        <div className="exercise-creation__controls">
          <div className="exercise-creation__unit-toggle">
            <button
              type="button"
              className={`exercise-creation__unit-btn ${unit === 'KG' ? 'is-active' : ''}`}
              onClick={handleUnitToggle}
            >
              KG
            </button>
            <button
              type="button"
              className={`exercise-creation__unit-btn ${unit === 'LBS' ? 'is-active' : ''}`}
              onClick={handleUnitToggle}
            >
              LBS
            </button>
          </div>
          <div className="exercise-creation__menu-wrapper">
            <button
              type="button"
              className="exercise-creation__menu-btn"
              onClick={() => setShowExerciseMenu(!showExerciseMenu)}
              aria-label="Exercise options"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
            {showExerciseMenu && (
              <>
                <div
                  className="exercise-creation__menu-backdrop"
                  onClick={() => setShowExerciseMenu(false)}
                />
                <div className="exercise-creation__menu">
                  <button
                    type="button"
                    className="exercise-creation__menu-item"
                    onClick={handleEdit}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit Exercise
                  </button>
                  <button
                    type="button"
                    className="exercise-creation__menu-item"
                    onClick={handleDelete}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="exercise-creation__sets">
        <div className="exercise-creation__sets-header">
          <span className="exercise-creation__header-weight">Weight</span>
          <span className="exercise-creation__header-reps">Reps</span>
          <span className="exercise-creation__header-video">Video</span>
        </div>
        {sets.map((set, index) => (
          <div key={set.id} className="exercise-creation__set-row">
            <span className="exercise-creation__set-number">{index + 1}</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="exercise-creation__set-input"
              placeholder="0"
              value={set.weight}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                handleSetChange(set.id, 'weight', value);
              }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="exercise-creation__set-input"
              placeholder="0"
              value={set.reps}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                handleSetChange(set.id, 'reps', value);
              }}
            />
            <div className="exercise-creation__set-qr">
              <div className="exercise-creation__qr-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <path d="M14 14h7v7"></path>
                  <path d="M14 17h7"></path>
                </svg>
              </div>
            </div>
            <div className="exercise-creation__set-menu-wrapper">
              <button
                type="button"
                className="exercise-creation__set-menu-btn"
                onClick={() => setShowSetMenu(showSetMenu === set.id ? null : set.id)}
                aria-label={`Options for set ${index + 1}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
              {showSetMenu === set.id && (
                <>
                  <div
                    className="exercise-creation__menu-backdrop"
                    onClick={() => setShowSetMenu(null)}
                  />
                  <div className="exercise-creation__menu exercise-creation__menu--set">
                    <button
                      type="button"
                      className="exercise-creation__menu-item"
                      onClick={() => handleDeleteSet(set.id)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Delete Set
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        <div className="exercise-creation__add-set">
          <button
            type="button"
            className="exercise-creation__add-set-btn"
            onClick={handleAddSet}
          >
            Add Set
          </button>
        </div>
      </div>

      <div className="exercise-creation__notes">
        <textarea
          className="exercise-creation__notes-input"
          placeholder="Add notes here..."
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ExerciseCreation;

