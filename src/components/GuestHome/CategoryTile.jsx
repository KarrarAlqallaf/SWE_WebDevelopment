import React from 'react';
import './CategoryTile.css';

const CategoryTile = ({ category, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(category.id);
    }
  };

  return (
    <button
      className="card category-tile"
      onClick={handleClick}
      aria-label={`Browse ${category.label} programs`}
      aria-pressed="false"
    >
      <div className="category-tile__content">
        {category.icon && (
          <div className="category-tile__icon" aria-hidden="true">
            {category.icon}
          </div>
        )}
        <span className="category-tile__label">{category.label}</span>
      </div>
    </button>
  );
};

export default CategoryTile;

