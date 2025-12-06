import React, { useState, useEffect } from 'react';
import './ExerciseCreation.css';
import { idGenerator } from '../../utils/idGenerator';

const ExerciseCreation = ({
  exercise: exerciseData,
  muscle,
  onEdit,
  onDelete,
  onShare,
  onUpdate,
  isEditable = true
}) => {
  // Initialize state from props
  const getInitialSets = () => {
    if (exerciseData?.sets && Array.isArray(exerciseData.sets) && exerciseData.sets.length > 0) {
      // Ensure all sets have unique IDs - if any set is missing an ID or has duplicate, regenerate
      const seenIds = new Set();
      return exerciseData.sets.map((set, index) => {
        let setId = set.id;
        // If no ID or ID is not a valid positive integer, generate one
        if (!setId || typeof setId !== 'number' || setId <= 0 || !Number.isInteger(setId)) {
          setId = idGenerator.getSetId();
        }
        // If ID is duplicate, generate new one until unique
        while (seenIds.has(setId)) {
          setId = idGenerator.getSetId();
        }
        seenIds.add(setId);
        return {
          id: setId,
          weight: set.weight || '',
          reps: set.reps || '',
          _internalKey: `set-${setId}-${Date.now()}-${index}` // Internal unique key for React
        };
      });
    }
    // Default: 3 empty sets
    const timestamp = Date.now();
    return [
      { id: idGenerator.getSetId(), weight: '', reps: '', _internalKey: `set-new-${timestamp}-0` },
      { id: idGenerator.getSetId(), weight: '', reps: '', _internalKey: `set-new-${timestamp}-1` },
      { id: idGenerator.getSetId(), weight: '', reps: '', _internalKey: `set-new-${timestamp}-2` }
    ];
  };

  const [unit, setUnit] = useState(exerciseData?.unit || 'KG');
  const [sets, setSets] = useState(getInitialSets);
  const [notes, setNotes] = useState(exerciseData?.notes || '');
  const [showExerciseMenu, setShowExerciseMenu] = useState(false);

  const exerciseName = exerciseData?.name || exerciseData || '';

  // Sync state when exerciseData changes (important for when parent updates the exercise)
  useEffect(() => {
    if (!exerciseData) return;

    // Update unit if changed
    const newUnit = exerciseData.unit || 'KG';
    if (newUnit !== unit) {
      setUnit(newUnit);
    }
    
    // Update notes if changed
    const newNotes = exerciseData.notes || '';
    if (newNotes !== notes) {
      setNotes(newNotes);
    }
    
    // Update sets if changed - ensure unique IDs
    if (exerciseData.sets && Array.isArray(exerciseData.sets)) {
      // Create a stable comparison key from current sets
      const currentSetsKey = sets.map(s => `${s.id}:${s.weight}:${s.reps}`).join('|');
      const newSetsKey = exerciseData.sets.map(s => `${s.id || 'new'}:${s.weight || ''}:${s.reps || ''}`).join('|');
      
      // Only update if sets actually changed
      if (currentSetsKey !== newSetsKey) {
        // Ensure all sets have valid unique IDs
        const seenIds = new Set();
        const setsWithUniqueIds = exerciseData.sets.map((set) => {
          let setId = set.id;
          // If no ID or ID is not a valid positive integer, generate one
          if (!setId || typeof setId !== 'number' || setId <= 0 || !Number.isInteger(setId)) {
            setId = idGenerator.getSetId();
          }
          // If ID is duplicate, generate new one until unique
          while (seenIds.has(setId)) {
            setId = idGenerator.getSetId();
          }
          seenIds.add(setId);
          // Preserve existing _internalKey if set already has one, otherwise generate new one
          const existingSet = sets.find(s => s.id === setId);
          const internalKey = existingSet?._internalKey || `set-${setId}-${Date.now()}-${Math.random()}`;
          return {
            id: setId,
            weight: set.weight || '',
            reps: set.reps || '',
            _internalKey: internalKey
          };
        });
        setSets(setsWithUniqueIds);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseData]); // Only depend on exerciseData to avoid infinite loops

  const handleAddSet = () => {
    // Generate a unique ID that's guaranteed to not conflict
    const setId = idGenerator.getSetId();
    const timestamp = Date.now();
    const newSet = {
      id: setId,
      weight: '',
      reps: '',
      _internalKey: `set-${setId}-${timestamp}-${sets.length}` // Unique internal key
    };
    const updatedSets = [...sets, newSet];
    setSets(updatedSets);
    if (onUpdate) {
      // Pass sets without _internalKey (backend doesn't need it)
      const setsForBackend = updatedSets.map(({ _internalKey, ...set }) => set);
      onUpdate({ sets: setsForBackend, unit, notes });
    }
  };

  const handleDeleteSet = (setId) => {
    // Ensure at least one set remains
    if (sets.length <= 1) {
      return; // Don't allow deleting the last set
    }
    
    // Create a new array (filter already creates new array, but be explicit)
    const newSets = sets.filter(s => s.id !== setId);
    setSets(newSets);
    if (onUpdate) {
      // Pass sets without _internalKey (backend doesn't need it)
      const setsForBackend = newSets.map(({ _internalKey, ...set }) => set);
      onUpdate({ sets: setsForBackend, unit, notes });
    }
  };

  const handleSetChange = (setId, field, value) => {
    // Create a completely new array with new objects to ensure React detects the change
    const newSets = sets.map(set => {
      if (set.id === setId) {
        // Create a new object for the changed set, preserving internal key
        return { ...set, [field]: value };
      }
      // Return same reference for unchanged sets (React optimization)
      return set;
    });
    setSets(newSets);
    if (onUpdate) {
      // Pass sets without _internalKey (backend doesn't need it)
      const setsForBackend = newSets.map(({ _internalKey, ...set }) => set);
      onUpdate({ sets: setsForBackend, unit, notes });
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
              disabled={!isEditable}
            >
              KG
            </button>
            <button
              type="button"
              className={`exercise-creation__unit-btn ${unit === 'LBS' ? 'is-active' : ''}`}
              onClick={handleUnitToggle}
              disabled={!isEditable}
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
        </div>
        {sets.map((set, index) => {
          // Use internal key if available, otherwise fall back to set ID
          const stableKey = set._internalKey || `set-${set.id}-${index}`;
          return (
            <div key={stableKey} className="exercise-creation__set-row">
              <span className="exercise-creation__set-number">{index + 1}</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="exercise-creation__set-input"
                placeholder="0"
                value={set.weight || ''}
                onChange={(e) => {
                  if (isEditable) {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    handleSetChange(set.id, 'weight', value);
                  }
                }}
                readOnly={!isEditable}
              />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="exercise-creation__set-input"
                placeholder="0"
                value={set.reps || ''}
                onChange={(e) => {
                  if (isEditable) {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    handleSetChange(set.id, 'reps', value);
                  }
                }}
                readOnly={!isEditable}
              />
              <button
                type="button"
                className="exercise-creation__delete-set-btn"
                onClick={() => {
                  if (isEditable) {
                    handleDeleteSet(set.id);
                  }
                }}
                disabled={!isEditable || sets.length <= 1}
                aria-label={`Delete set ${index + 1}`}
              >
                Delete Set
              </button>
            </div>
          );
        })}
        <div className="exercise-creation__add-set">
          <button
            type="button"
            className="exercise-creation__add-set-btn"
            onClick={handleAddSet}
            disabled={!isEditable}
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
          onChange={(e) => {
            if (isEditable) {
              handleNotesChange(e.target.value);
            }
          }}
          readOnly={!isEditable}
        />
      </div>
    </div>
  );
};

export default ExerciseCreation;

