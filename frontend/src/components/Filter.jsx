import React, { useState } from 'react';
import './Filter.css';

const Filter = ({ onApply }) => {
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Pass the selected category and difficulty to the parent component
        onApply(category, difficulty);
    };

    return (
        <>
            <div className="row filter-container">
                <form onSubmit={handleSubmit} className='p-5'>
                    <div className="form-group my-2">
                        <label htmlFor="category">Category:</label>
                        <select
                            id="category"
                            className="form-control"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            <option value="History">History</option>
                            <option value="Software Development">Software Development</option>
                            <option value="Science">Science</option>
                        </select>
                    </div>
                    <div className="form-group my-2">
                        <label htmlFor="difficulty">Difficulty:</label>
                        <select
                            id="difficulty"
                            className="form-control"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                        >
                            <option value="">Select Difficulty</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                            {/* Add more options as needed */}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Apply</button>
                </form>
            </div>
        </>
    )
}

export default Filter;