import React from 'react';
import ExerciseCreation from '../ExerciseCreation/ExerciseCreation';
import './ProgramDetail.css';

const ProgramDetail = ({ programData, scheduleName, isEditable = false, onModify, onSave }) => {
  const [days, setDays] = React.useState(programData?.days || []);
  const [activeDayId, setActiveDayId] = React.useState(days.length > 0 ? days[0].id : 1);
  const [name, setName] = React.useState(scheduleName || '');

  // Keep local state in sync when programData changes (e.g., switching via sidebar quicklinks)
  React.useEffect(() => {
    const nextDays = programData?.days || [];
    setDays(nextDays);
    setActiveDayId(nextDays.length > 0 ? nextDays[0].id : 1);
    setName(scheduleName || '');
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
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              Save to Vault
            </button>
          </div>
        </div>

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

