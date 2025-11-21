import React from 'react';
import ProgramCard from './ProgramCard';
import './PopularProgramsSection.css';

const PopularProgramsSection = ({ programs = [], onOpenProgram }) => (
  <section className="popular-programs-section" aria-labelledby="popular-programs-heading">
    <h2 id="popular-programs-heading" className="popular-programs-section__heading">
      Popular Programs
    </h2>
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

