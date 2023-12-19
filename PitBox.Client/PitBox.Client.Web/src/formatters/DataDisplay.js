import React from 'react'

const DataDisplay = (props) => {

    return (
        <div>
            <div>
                <span className="text-muted small text-uppercase">{props.title}</span>
            </div>
            <div>
                <span className="text-uppercase font-weight-bold" style={{ color: props.color }}>{props.content}</span>
            </div>
        </div>
    )
}

export default DataDisplay
