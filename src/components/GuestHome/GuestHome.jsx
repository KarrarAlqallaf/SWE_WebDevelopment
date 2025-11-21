import React, { useState, useMemo } from 'react';
import SearchRow from './SearchRow';
import PopularProgramsSection from './PopularProgramsSection';
import CategoriesSection from './CategoriesSection';
import './GuestHome.css';

const GuestHome = ({
  popularPrograms = [],
  categories = [],
  onSearch,
  onOpenProgram,
  onCategoryClick,
  onThemeToggle,
  currentTheme = 'dark',
  onLoginClick,
  onSignUpClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter programs based on search query
  const filteredPrograms = useMemo(() => {
    if (!searchQuery.trim()) {
      return popularPrograms;
    }
    const query = searchQuery.toLowerCase().trim();
    return popularPrograms.filter(program => 
      program.title.toLowerCase().includes(query) ||
      program.author.toLowerCase().includes(query) ||
      program.summary.toLowerCase().includes(query)
    );
  }, [popularPrograms, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Real-time search - filter happens automatically via useMemo
  };

  return (
    <section className="guest-home">
      <div className="container">
        <SearchRow
          searchQuery={searchQuery}
          onSearchSubmit={handleSearchSubmit}
          onSearchChange={handleSearchChange}
          onThemeToggle={onThemeToggle}
          currentTheme={currentTheme}
          onLoginClick={onLoginClick}
          onSignUpClick={onSignUpClick}
        />

        <PopularProgramsSection
          programs={filteredPrograms}
          onOpenProgram={onOpenProgram}
        />

        <CategoriesSection
          categories={categories}
          onCategoryClick={onCategoryClick}
        />
      </div>
    </section>
  );
};

export default GuestHome;

