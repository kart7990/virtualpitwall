export const CLEAR_LAPS = 'CLEAR_LAPS';
export const ADD_LAPS = 'ADD_LAPS';

export const lapsClear = () => {
    return {
        type: CLEAR_LAPS,
        laps: [],
    };
}

export const addLaps = (sessionNumber, newLaps) => {
    return {
        type: ADD_LAPS,
        sessionNumber: sessionNumber,
        newLaps: newLaps
    };
}

