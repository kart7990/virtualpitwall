import './VerticalBarFill.css'

import React from 'react'


const VerticalBarFill = (props) => {
    return (
        <>
            <div className="progress-bar-container">
                <div className="progress progress-bar-vertical">
                    <div className={`progress-bar ${props.className}`} role="progressbar" aria-valuenow={props.percent} aria-valuemin="0" aria-valuemax="100" style={{ height: `${props.percent}%` }}>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    {props.percent}
                </div>
            </div>
        </>
    )
}

export default VerticalBarFill
