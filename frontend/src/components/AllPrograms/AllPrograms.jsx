import React, { useState, useMemo } from 'react';
import ProgramCard from '../GuestHome/ProgramCard';
import './AllPrograms.css';

const AllPrograms = ({
  programs = [],
  onOpenProgram,
  onThemeToggle,
  currentTheme = 'dark',
  onLoginClick,
  onSignUpClick,
  isAuthenticated = false,
  currentUser = null,
  onSignOut
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter programs based on search query
  const filteredPrograms = useMemo(() => {
    if (!searchQuery.trim()) {
      return programs;
    }
    const query = searchQuery.toLowerCase().trim();
    return programs.filter(program => 
      program.title.toLowerCase().includes(query) ||
      program.author.toLowerCase().includes(query) ||
      (program.summary && program.summary.toLowerCase().includes(query)) ||
      (program.description && program.description.toLowerCase().includes(query))
    );
  }, [programs, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <section className="all-programs">
      <div className="container">
        <div className="all-programs__header">
          <h1 className="all-programs__title">All Programs</h1>
          <div className="all-programs__search">
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={handleSearchChange}
              onSubmit={handleSearchSubmit}
              className="all-programs__search-input"
            />
          </div>
        </div>

        <div className="all-programs__count">
          {filteredPrograms.length} {filteredPrograms.length === 1 ? 'program' : 'programs'} found
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program) => (
              <div key={program.id} className="col">
                <ProgramCard
                  program={program}
                  onClick={onOpenProgram}
                />
              </div>
            ))
          ) : (
            <div className="col-12">
              <p className="all-programs__empty">No programs found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AllPrograms;

