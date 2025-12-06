import React, { useState, useEffect } from 'react';
import MuscleSelection from '../MuscleSelection/MuscleSelection';
import ExerciseSelection from '../ExerciseSelection/ExerciseSelection';
import ExerciseCreation from '../ExerciseCreation/ExerciseCreation';
import './JadwalBuilder.css';
import { idGenerator } from '../../utils/idGenerator';

const JadwalBuilder = ({ initialCategories = [], onSave, builtInProgram = null, isCustom = true, initialScheduleName = '' }) => {
  // Initialize idGenerator before using it
  const getInitialDays = () => {
    if (builtInProgram) {
      return builtInProgram.days;
    } else {
      idGenerator.reset();
      return [{ id: idGenerator.getDayId(), exercises: [] }];
    }
  };

  const [scheduleName, setScheduleName] = useState(initialScheduleName || '');
  const [shortLabel, setShortLabel] = useState(builtInProgram?.shortLabel || '');
  const [summary, setSummary] = useState(builtInProgram?.summary || '');
  const [description, setDescription] = useState(builtInProgram?.description || '');
  const [durationHint, setDurationHint] = useState(builtInProgram?.durationHint || '');
  const [tags, setTags] = useState(builtInProgram?.tags || []);
  const [isPublic, setIsPublic] = useState(
    typeof builtInProgram?.isPublic === 'boolean' ? builtInProgram.isPublic : true
  );
  const [days, setDays] = useState(getInitialDays);
  const [activeDayId, setActiveDayId] = useState(1);
  const [showMuscleSelection, setShowMuscleSelection] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [dayToDelete, setDayToDelete] = useState(null);
  const [exerciseToEdit, setExerciseToEdit] = useState(null);

  // Set ID generator counters when builtInProgram changes
  useEffect(() => {
    // If we have a builtInProgram, set counters to max existing IDs + 1
    if (builtInProgram?.days) {
      let maxDayId = 0;
      let maxExerciseId = 0;
      let maxSetId = 0;

      builtInProgram.days.forEach(day => {
        if (day.id > maxDayId) maxDayId = day.id;

        day.exercises?.forEach(exercise => {
          if (exercise.id > maxExerciseId) maxExerciseId = exercise.id;

          exercise.sets?.forEach(set => {
            if (set.id > maxSetId) maxSetId = set.id;
          });
        });
      });

      // Set counters to one more than the max
      idGenerator.dayCounter = maxDayId + 1;
      idGenerator.exerciseCounter = maxExerciseId + 1;
      idGenerator.setCounter = maxSetId + 1;
    }
  }, [builtInProgram]);

  // Sync scheduleName when initialScheduleName prop changes
  useEffect(() => {
    // If initialScheduleName is provided, use it; otherwise clear it for new programs
    if (initialScheduleName) {
      setScheduleName(initialScheduleName);
    } else if (!builtInProgram) {
      // For new custom programs (no builtInProgram and no initialScheduleName), start empty
      setScheduleName('');
    }
  }, [initialScheduleName, builtInProgram]);

  const activeDay = days.find(d => d.id === activeDayId);
  const hasExercises = activeDay?.exercises.length > 0;

  const handleTogglePublic = () => {
    setIsPublic(prev => !prev);
  };

  const handleTagToggle = (label) => {
    setTags((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const handleAddDay = () => {
    if (days.length < 7) {
      const newDayId = idGenerator.getDayId();
      setDays([...days, { id: newDayId, exercises: [] }]);
      setActiveDayId(newDayId);
    }
  };

  const handleDeleteDay = (dayId, e) => {
    e.stopPropagation();
    const day = days.find(d => d.id === dayId);

    if (day.exercises.length > 0) {
      setDayToDelete(dayId);
    } else {
      confirmDeleteDay(dayId);
    }
  };

  const confirmDeleteDay = (dayId) => {
    const newDays = days.filter(d => d.id !== dayId);

    // Renumber days sequentially for UI consistency
    const renumberedDays = newDays.map((d, index) => ({ ...d, id: index + 1 }));

    setDays(renumberedDays);

    // Adjust active day
    if (activeDayId === dayId) {
      setActiveDayId(renumberedDays.length > 0 ? renumberedDays[0].id : 1);
    } else if (activeDayId > dayId) {
      setActiveDayId(activeDayId - 1);
    }

    // Reset day counter to account for renumbering
    idGenerator.dayCounter = renumberedDays.length + 1;

    setDayToDelete(null);
  };

  const handleCancelDelete = () => {
    setDayToDelete(null);
  };

  const handleDayClick = (dayId) => {
    setActiveDayId(dayId);
  };

  const handleAddExercise = () => {
    setShowMuscleSelection(true);
  };

  const handleMuscleSelect = (muscle) => {
    setSelectedMuscle(muscle);
    setShowMuscleSelection(false);
    setShowExerciseSelection(true);
  };

  const handleMuscleSelectionClose = () => {
    setShowMuscleSelection(false);
  };

  const handleExerciseSelect = (exercise) => {
    const exerciseId = idGenerator.getExerciseId();
    const newExercise = {
      id: exerciseId,
      name: exercise,
      muscle: selectedMuscle,
      unit: 'KG',
      sets: [
        { id: idGenerator.getSetId(), weight: '', reps: '' },
        { id: idGenerator.getSetId(), weight: '', reps: '' },
        { id: idGenerator.getSetId(), weight: '', reps: '' }
      ],
      notes: ''
    };

    const updatedDays = days.map(day => {
      if (day.id === activeDayId) {
        return {
          ...day,
          exercises: [...day.exercises, newExercise]
        };
      }
      return day;
    });
    setDays(updatedDays);
    setShowExerciseSelection(false);
    setSelectedMuscle(null);
  };

  const handleExerciseSelectionBack = () => {
    setShowExerciseSelection(false);
    setShowMuscleSelection(true);
  };

  const handleExerciseSelectionClose = () => {
    setShowExerciseSelection(false);
    setSelectedMuscle(null);
  };

  const handleExerciseUpdate = (exerciseId, updatedData) => {
    const updatedDays = days.map(day => {
      if (day.id === activeDayId) {
        return {
          ...day,
          exercises: day.exercises.map(ex => {
            if (ex.id === exerciseId) {
              // Create a new exercise object to ensure React detects the change
              // Ensure sets have proper structure and unique IDs
              const updatedExercise = { ...ex, ...updatedData };
              
              // If sets were updated, ensure they have valid unique IDs
              if (updatedData.sets && Array.isArray(updatedData.sets)) {
                const seenIds = new Set();
                updatedExercise.sets = updatedData.sets.map((set) => {
                  let setId = set.id;
                  // Ensure ID is valid number
                  if (!setId || typeof setId !== 'number' || setId <= 0) {
                    setId = idGenerator.getSetId();
                  }
                  // Check for duplicates and fix them
                  while (seenIds.has(setId)) {
                    setId = idGenerator.getSetId();
                  }
                  seenIds.add(setId);
                  return {
                    id: setId,
                    weight: set.weight || '',
                    reps: set.reps || ''
                  };
                });
              }
              
              return updatedExercise;
            }
            return ex;
          })
        };
      }
      return day;
    });
    setDays(updatedDays);
  };

  const handleExerciseEdit = (exerciseId) => {
    const exercise = activeDay.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setExerciseToEdit(exercise);
      setSelectedMuscle(exercise.muscle);
      setShowExerciseSelection(true);
    }
  };

  const handleExerciseDelete = (exerciseId) => {
    const updatedDays = days.map(day => {
      if (day.id === activeDayId) {
        return {
          ...day,
          exercises: day.exercises.filter(ex => ex.id !== exerciseId)
        };
      }
      return day;
    });
    setDays(updatedDays);
  };

  const handleExerciseShare = (exercise) => {
    // Share functionality - can be enhanced later
    console.log('Sharing exercise:', exercise);
  };

  const handleExerciseSelectForEdit = (exercise) => {
    if (exerciseToEdit) {
      const updatedDays = days.map(day => {
        if (day.id === activeDayId) {
          return {
            ...day,
            exercises: day.exercises.map(ex =>
              ex.id === exerciseToEdit.id
                ? { ...ex, name: exercise, muscle: selectedMuscle }
                : ex
            )
          };
        }
        return day;
      });
      setDays(updatedDays);
      setExerciseToEdit(null);
    }
    setShowExerciseSelection(false);
    setSelectedMuscle(null);
  };

  if (showMuscleSelection) {
    return (
      <MuscleSelection
        onSelect={handleMuscleSelect}
        onClose={handleMuscleSelectionClose}
      />
    );
  }

  if (showExerciseSelection && selectedMuscle) {
    return (
      <ExerciseSelection
        muscle={selectedMuscle}
        onSelect={exerciseToEdit ? handleExerciseSelectForEdit : handleExerciseSelect}
        onBack={handleExerciseSelectionBack}
        onClose={handleExerciseSelectionClose}
      />
    );
  }

  return (
    <div className="jadwal-builder">
      <div className="container">
        <div className="jadwal-builder__header">
          <input
            type="text"
            className="jadwal-builder__name-input"
            placeholder="Enter schedule name"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
          />
          <div className="jadwal-builder__meta">
            <div className="jadwal-builder__field">
              <label className="jadwal-builder__label" htmlFor="jadwal-shortlabel">
                Short label
              </label>
              <input
                id="jadwal-shortlabel"
                type="text"
                className="jadwal-builder__text-input"
                placeholder="e.g. 4 days / wk, Push / Pull"
                value={shortLabel}
                onChange={(e) => setShortLabel(e.target.value)}
              />
            </div>

            <div className="jadwal-builder__field">
              <label className="jadwal-builder__label" htmlFor="jadwal-summary">
                Summary
              </label>
              <input
                id="jadwal-summary"
                type="text"
                className="jadwal-builder__text-input"
                placeholder="Brief summary of this program..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            <div className="jadwal-builder__field">
              <label className="jadwal-builder__label" htmlFor="jadwal-description">
                Description
              </label>
              <textarea
                id="jadwal-description"
                className="jadwal-builder__text-input jadwal-builder__textarea"
                placeholder="Describe this schedule..."
                value={description}
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="jadwal-builder__field">
              <label className="jadwal-builder__label" htmlFor="jadwal-tags">
                Categories
              </label>
              <div id="jadwal-tags" className="jadwal-builder__tags-box">
                {initialCategories.map((cat) => {
                  const label = cat.label;
                  const selected = tags.includes(label);
                  return (
                    <label
                      key={cat.id || label}
                      className="jadwal-builder__tag-row"
                    >
                      <span className="jadwal-builder__tag-label">
                        {label}
                      </span>
                      <input
                        type="checkbox"
                        className="jadwal-builder__tag-checkbox"
                        checked={selected}
                        onChange={() => handleTagToggle(label)}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="jadwal-builder__field-row">
              <div className="jadwal-builder__field">
                <label className="jadwal-builder__label" htmlFor="jadwal-duration">
                  Duration hint
                </label>
                <select
                  id="jadwal-duration"
                  className="jadwal-builder__select"
                  value={durationHint}
                  onChange={(e) => setDurationHint(e.target.value)}
                >
                  <option value="">Select duration</option>
                  <option value="2-3 days/wk">2–3 days / week</option>
                  <option value="3-4 days/wk">3–4 days / week</option>
                  <option value="4-5 days/wk">4–5 days / week</option>
                  <option value="Daily">Daily</option>
                </select>
              </div>
              <div className="jadwal-builder__field jadwal-builder__field--toggle">
                <span className="jadwal-builder__label">Visibility</span>
                <button
                  type="button"
                  className={`jadwal-builder__toggle ${isPublic ? 'is-on' : 'is-off'}`}
                  onClick={handleTogglePublic}
                  aria-pressed={isPublic}
                >
                  {isPublic ? 'Public' : 'Private'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="jadwal-builder__toolbar">
          <div className="jadwal-builder__days">
            {days.map((day) => (
              <div key={day.id} className="jadwal-builder__day-wrapper">
                <button
                  type="button"
                  className={`jadwal-builder__day-btn ${activeDayId === day.id ? 'is-active' : ''}`}
                  onClick={() => handleDayClick(day.id)}
                >
                  Day {day.id}
                  <button
                    type="button"
                    className="jadwal-builder__day-delete"
                    onClick={(e) => handleDeleteDay(day.id, e)}
                    aria-label={`Delete Day ${day.id}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </button>
              </div>
            ))}
            {days.length < 7 && (
              <button
                type="button"
                className="jadwal-builder__add-day-btn"
                onClick={handleAddDay}
              >
                + Add Day
              </button>
            )}
          </div>
          <div className="jadwal-builder__actions">
            {!isCustom && (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => {
                  // Already in edit mode when in JadwalBuilder
                  // This button is just for visual consistency
                }}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              >
                Modify
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (onSave) {
                  onSave({
                    name: scheduleName || 'Untitled Schedule',
                    shortLabel,
                    summary,
                    description,
                    durationHint,
                    tags,
                    isPublic,
                    days: days,
                    isCustom: isCustom
                  });
                }
              }}
            >
              Save to Vault
            </button>
          </div>
        </div>

        {dayToDelete && (
          <div className="jadwal-builder__delete-confirm">
            <p>This day contains exercises. Are you sure you want to delete it?</p>
            <div className="jadwal-builder__delete-actions">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => confirmDeleteDay(dayToDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        )}

        <div className="jadwal-builder__content">
          {!hasExercises ? (
            <div className="jadwal-builder__empty">
              <p className="jadwal-builder__empty-message">
                Currently there are no exercises in this day.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddExercise}
              >
                + Add Exercise
              </button>
            </div>
          ) : (
            <div className="jadwal-builder__exercises">
              <div className="jadwal-builder__exercises-header">
                <h3>Exercises</h3>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleAddExercise}
                >
                  + Add Exercise
                </button>
              </div>
              <div className="jadwal-builder__exercise-list">
                {activeDay.exercises.map((exercise) => (
                  <ExerciseCreation
                    key={exercise.id}
                    exercise={exercise}
                    muscle={exercise.muscle}
                    onEdit={() => handleExerciseEdit(exercise.id)}
                    onDelete={() => handleExerciseDelete(exercise.id)}
                    onShare={() => handleExerciseShare(exercise)}
                    onUpdate={(updatedData) => handleExerciseUpdate(exercise.id, updatedData)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JadwalBuilder;