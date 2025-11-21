import React from 'react';
import CategoryTile from './CategoryTile';
import './CategoriesSection.css';

const CategoriesSection = ({ categories = [], onCategoryClick }) => (
  <section className="categories-section" aria-labelledby="categories-heading">
    <h2 id="categories-heading" className="categories-section__heading">
      Categories
    </h2>
    <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3">
      {categories.map((category) => (
        <div key={category.id} className="col">
          <CategoryTile
            category={category}
            onClick={onCategoryClick}
          />
        </div>
      ))}
    </div>
  </section>
);

export default CategoriesSection;

