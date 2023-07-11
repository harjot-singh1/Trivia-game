import React from 'react'
import './GameCard.css'

const GameCard = ({ title, category, timeFrameinMin, difficuly }) => {

    let borderColor;

    switch (difficuly) {
        case "high": borderColor = "#FF0000"; break;
        case "medium": borderColor = "#FFFF00"; break;
        case "low": borderColor = "#0000FF"; break;
        default: borderColor = "#000";
    }

    return (
        <section className={`card_${title} col-md-3 col-xs-2 p-3 m-3`} style={{ border: '1px solid' + borderColor, boxShadow: 'rgba(0, 0, 0, 0.35)  0px 5px 15px', borderRadius: '10px' }}>
            <div className='row'>
                <div className='col-7'>
                    <span className='category'>{category}</span>
                </div>
                <div className="col-4 offset-1">
                    <span className='timeFrame d-flex justify-content-end'>{timeFrameinMin}</span>
                </div>
            </div>
            <div className="row mt-2 mb-4">
                <div className="col-12">
                    <span className='title'>{title}</span>
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <button className='btn btn-outline-secondary details-btn'>Details</button>
                </div>
                <div className="col-2 offset-3">
                    <button className='btn btn-outline-success join-btn  d-flex justify-content-end'>Join</button>
                </div>
            </div>
        </section>
    )
}

export default GameCard