// FilterButtons.js
import React from 'react';
import '../styles/buttons.css';

const FilterButtons = ({ setFilter, activeFilter }) => {
    return (
        <div className="filter-buttons">
            <button
                onClick={() => setFilter('all')}
                className={activeFilter === 'all' ? 'active' : ''}
            >
                Все
            </button>
            <button
                onClick={() => setFilter('completed')}
                className={activeFilter === 'completed' ? 'active' : ''}
            >
                Выполненные
            </button>
            <button
                onClick={() => setFilter('incomplete')}
                className={activeFilter === 'incomplete' ? 'active' : ''}
            >
                Невыполненные
            </button>
        </div>
    );
};

export default FilterButtons;
