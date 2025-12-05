import React from 'react';
import ExerciseCreation from '../ExerciseCreation/ExerciseCreation';
import Rating from '../Rating/Rating';
import './ProgramDetail.css';

const ProgramDetail = ({ programData, scheduleName, isEditable = false, onModify, onSave, programId, onRatingSubmit }) => {
  const [days, setDays] = React.useState(programData?.days || []);
  const [activeDayId, setActiveDayId] = React.useState(days.length > 0 ? days[0].id : 1);
  const [name, setName] = React.useState(scheduleName || '');
  const [showRating, setShowRating] = React.useState(false);

  // Keep local state in sync when programData changes (e.g., switching via sidebar quicklinks)
  React.useEffect(() => {
    const nextDays = programData?.days || [];
    setDays(nextDays);
    setActiveDayId(nextDays.length > 0 ? nextDays[0].id : 1);
    setName(scheduleName || '');
    // Reset rating visibility when switching programs
    setShowRating(false);
  }, [programData, scheduleName]);

  const activeDay = days.find(d => d.id === activeDayId);

  const handleDayClick = (dayId) => {
    setActiveDayId(dayId);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        name: name || 'Untitled Schedule',
        days: days,
        isBuiltIn: !isEditable
      });
    }
  };

  const handleModify = () => {
    if (onModify) {
      onModify();
    }
  };

  const handleRatingToggle = () => {
    setShowRating(!showRating);
  };

  const handleRatingSubmit = (ratingValue) => {
    if (onRatingSubmit && programId) {
      onRatingSubmit(programId, ratingValue);
      setShowRating(false);
    }
  };

  const handleShareSchedule = () => {
    // Share the entire schedule
    const scheduleData = {
      name: name || scheduleName || 'Untitled Schedule',
      days: days,
    };

    // Create share text
    const shareText = `Check out my workout schedule: ${scheduleData.name}\n\n${scheduleData.days.length} day${scheduleData.days.length > 1 ? 's' : ''} program`;

    // Try native share API first
    if (navigator.share) {
      navigator.share({
        title: scheduleData.name,
        text: shareText,
        url: window.location.href
      }).catch((err) => {
        // If share fails, fallback to clipboard
        console.log('Share cancelled or failed, copying to clipboard');
        navigator.clipboard.writeText(shareText).then(() => {
          alert('Schedule details copied to clipboard!');
        }).catch(() => {
          alert('Failed to share schedule. Please try again.');
        });
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Schedule details copied to clipboard!');
      }).catch(() => {
        alert('Failed to copy schedule. Please try again.');
      });
    }
  };

  return (
    <div className="program-detail">
      <div className="container">
        <div className="program-detail__header">
          <input
            type="text"
            className="program-detail__name-input"
            placeholder="Enter schedule name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            readOnly={!isEditable}
          />
        </div>

        <div className="program-detail__toolbar">
          <div className="program-detail__days">
            {days.map((day) => (
              <button
                key={day.id}
                type="button"
                className={`program-detail__day-btn ${activeDayId === day.id ? 'is-active' : ''}`}
                onClick={() => handleDayClick(day.id)}
              >
                Day {day.id}
              </button>
            ))}
          </div>
          <div className="program-detail__actions">
            {!isEditable && (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleModify}
              >
                Modify
              </button>
            )}
            {programId && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleRatingToggle}
              >
                {showRating ? 'Hide Rating' : 'Rate this Program'}
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleShareSchedule}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              Share
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              Save to Vault
            </button>
          </div>
        </div>

        {showRating && programId && (
          <div className="program-detail__rating-section">
            <Rating
              defaultValue={0}
              onChange={(value) => console.log('Rating changed:', value)}
              onSubmit={handleRatingSubmit}
              size="md"
              label="What is your opinion on this workout?"
            />
          </div>
        )}

        <div className="program-detail__content">
          {activeDay && activeDay.exercises.length > 0 ? (
            <div className="program-detail__exercises">
              <div className="program-detail__exercise-list">
                {activeDay.exercises.map((exercise) => (
                  <ExerciseCreation
                    key={exercise.id}
                    exercise={exercise}
                    muscle={exercise.muscle}
                    onEdit={undefined}
                    onDelete={undefined}
                    onShare={undefined}
                    onUpdate={undefined}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="program-detail__empty">
              <p>No exercises in this day.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;

