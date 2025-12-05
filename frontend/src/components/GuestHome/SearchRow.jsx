import React from 'react';
import './SearchRow.css';

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const SearchRow = ({
  searchQuery,
  onSearchSubmit,
  onSearchChange,
  onThemeToggle,
  currentTheme = 'dark',
  onLoginClick,
  onSignUpClick,
  isAuthenticated = false,
  currentUser = null,
  onSignOut
}) => (
  <div className="search-row">
    <form
      className="search-form"
      role="search"
      onSubmit={onSearchSubmit}
      aria-label="Search programs"
    >
      <label htmlFor="program-search" className="visually-hidden">
        Search for workout programs
      </label>
      <div className="input-group guest-home__search-input-group">
        <span className="input-group-text guest-home__search-icon" aria-hidden="true">
          <SearchIcon />
        </span>
        <input
          type="search"
          id="program-search"
          className="form-control form-control-lg guest-home__search-input"
          placeholder="Search programs..."
          value={searchQuery}
          onChange={onSearchChange}
          aria-label="Search for workout programs"
        />
      </div>
    </form>
    <div className="guest-home__auth-buttons">
      <button
        type="button"
        className="guest-home__button guest-home__button--outline guest-home__theme-toggle"
        onClick={onThemeToggle}
        aria-label="Toggle theme"
        title="Toggle dark/light mode"
      >
        {currentTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
      {!isAuthenticated ? (
        <>
          <button
            type="button"
            className="guest-home__button guest-home__button--outline guest-home__auth-btn"
            aria-label="Login to your account"
            onClick={onLoginClick}
          >
            Login
          </button>
          <button
            type="button"
            className="guest-home__button guest-home__button--solid guest-home__auth-btn"
            aria-label="Sign up for a new account"
            onClick={onSignUpClick}
          >
            Sign Up
          </button>
        </>
      ) : (
        <>
          {currentUser && (
            <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '10px' }}>
              {currentUser.profilePicture ? (
                <img 
                  src={currentUser.profilePicture} 
                  alt={currentUser.username}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '20px' }}>👤</span>
              )}
              <span>{currentUser.username}</span>
            </div>
          )}
          <button
            type="button"
            className="guest-home__button guest-home__button--outline guest-home__auth-btn"
            aria-label="Log out"
            onClick={onSignOut}
          >
            Log Out
          </button>
        </>
      )}
    </div>
  </div>
);

export default SearchRow;