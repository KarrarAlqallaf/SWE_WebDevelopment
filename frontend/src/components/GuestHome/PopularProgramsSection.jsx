import React from 'react';
import ProgramCard from './ProgramCard';
import './PopularProgramsSection.css';

const PopularProgramsSection = ({ programs = [], onOpenProgram, heading = "Popular Programs", onViewAll }) => (
  <section className="popular-programs-section" aria-labelledby="popular-programs-heading">
    <div className="popular-programs-section__header">
      <h2 id="popular-programs-heading" className="popular-programs-section__heading">
        {heading}
      </h2>
      {heading === "Popular Programs" && onViewAll && (
        <button 
          className="popular-programs-section__view-all-btn"
          onClick={onViewAll}
          type="button"
        >
          View All Programs
        </button>
      )}
    </div>
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
      {programs.length > 0 ? (
        programs.map((program) => (
          <div key={program.id} className="col">
            <ProgramCard
              program={program}
              onClick={onOpenProgram}
            />
          </div>
        ))
      ) : (
        <div className="col-12">
          <p>No programs found matching your search.</p>
        </div>
      )}
    </div>
  </section>
);

export default PopularProgramsSection;



