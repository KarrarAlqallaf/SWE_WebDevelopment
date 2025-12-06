import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProgramDetail from './ProgramDetail';

/**
 * Public/Shareable program view.
 * Fetches program by id and renders readonly detail without requiring auth.
 */
const SharedProgramPage = ({
  apiBaseUrl,
  onProgramLoaded,
  onSaveToVault,
  onRatingSubmit,
  onModify,
}) => {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgram = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${apiBaseUrl}/programs/${id}`);
        if (!res.ok) {
          throw new Error('Unable to load shared program.');
        }
        const data = await res.json();
        const programInfo = data?.programInfo || { days: [] };

        setProgram({
          id: data?._id || id,
          title: data?.title || 'Shared Program',
          programInfo,
        });

        if (onProgramLoaded) {
          onProgramLoaded(data?._id || id, programInfo);
        }
      } catch (err) {
        setError(err.message || 'Failed to load program.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [apiBaseUrl, id, onProgramLoaded]);

  if (loading) {
    return (
      <div className="container py-5">
        <p>Loading program...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <p>{error}</p>
      </div>
    );
  }

  if (!program?.programInfo) {
    return (
      <div className="container py-5">
        <p>Program data is unavailable.</p>
      </div>
    );
  }

  const handleSave = (schedule) => {
    if (onSaveToVault) {
      onSaveToVault({
        ...schedule,
        name: schedule?.name || program.title,
        programId: program.id,
      });
    } else {
      alert('Login to save this program to your vault.');
    }
  };

  return (
    <ProgramDetail
      programData={program.programInfo}
      scheduleName={program.title}
      isEditable={false}
      programId={program.id}
      onModify={onModify ? () => onModify(program.programInfo, program.id) : undefined}
      onSave={handleSave}
      onRatingSubmit={onRatingSubmit}
    />
  );
};

export default SharedProgramPage;

