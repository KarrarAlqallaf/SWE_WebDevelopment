import React, { useState, useEffect } from 'react';
import './Rating.css';

// Star Icon Component
const StarIcon = ({ filled = false, size = 'md' }) => {
  const sizeMap = {
    sm: 20,
    md: 32,
    lg: 48
  };
  const starSize = sizeMap[size] || 32;

  if (filled) {
    return (
      <svg width={starSize} height={starSize} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    );
  }
  return (
    <svg width={starSize} height={starSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
};

const Rating = ({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  onSubmit,
  size = 'md',
  label = 'What is your opinion on this workout?'
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState(0);
  const [isControlled, setIsControlled] = useState(controlledValue !== undefined);

  // Use controlled value if provided, otherwise use internal state
  const currentValue = isControlled ? (controlledValue || 0) : internalValue;
  // Show hover value when hovering, otherwise show current selected value
  const displayValue = hoverValue > 0 ? hoverValue : currentValue;

  useEffect(() => {
    setIsControlled(controlledValue !== undefined);
  }, [controlledValue]);

  const handleStarClick = (rating) => {
    const newValue = rating;
    // Clear hover value to show the selected rating immediately
    setHoverValue(0);
    if (!isControlled) {
      setInternalValue(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleStarHover = (rating) => {
    setHoverValue(rating);
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  const handleKeyDown = (e, rating) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStarClick(rating);
    } else if (e.key === 'ArrowRight' && rating < 5) {
      e.preventDefault();
      const nextRating = rating + 1;
      handleStarClick(nextRating);
      // Focus next star
      const nextButton = e.target.parentElement?.querySelector(`[data-rating="${nextRating}"]`);
      if (nextButton) {
        nextButton.focus();
      }
    } else if (e.key === 'ArrowLeft' && rating > 1) {
      e.preventDefault();
      const prevRating = rating - 1;
      handleStarClick(prevRating);
      // Focus previous star
      const prevButton = e.target.parentElement?.querySelector(`[data-rating="${prevRating}"]`);
      if (prevButton) {
        prevButton.focus();
      }
    }
  };

  const handleSubmit = () => {
    if (currentValue > 0 && onSubmit) {
      onSubmit(currentValue);
    }
  };

  const sizeClasses = {
    sm: 'rating--sm',
    md: 'rating--md',
    lg: 'rating--lg'
  };

  // Size variants are handled via CSS classes on the rating container

  return (
    <section className={`rating ${sizeClasses[size]}`} aria-labelledby="rating-label">
      <h3 id="rating-label" className="rating__label">
        {label}
      </h3>
      <div
        className="rating__stars"
        role="radiogroup"
        aria-labelledby="rating-label"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((rating) => {
          const isFilled = rating <= displayValue;
          const isSelected = rating === currentValue;
          return (
            <button
              key={rating}
              type="button"
              className={`rating__star ${isFilled ? 'rating__star--filled' : ''} ${isSelected ? 'rating__star--selected' : ''}`}
              role="radio"
              aria-checked={isSelected}
              aria-label={`Rate ${rating} out of 5 stars`}
              data-rating={rating}
              onClick={() => handleStarClick(rating)}
              onMouseEnter={() => handleStarHover(rating)}
              onKeyDown={(e) => handleKeyDown(e, rating)}
              tabIndex={rating === 1 ? 0 : isSelected ? 0 : -1}
            >
              <StarIcon filled={isFilled} size={size} />
            </button>
          );
        })}
      </div>
      <div>
        <button
          type="button"
          className="primary-btn"
          onClick={handleSubmit}
          disabled={currentValue === 0}
          aria-disabled={currentValue === 0}
          aria-label="Submit rating"
        >
          Rate
        </button>
      </div>
    </section>
  );
};

export default Rating;

