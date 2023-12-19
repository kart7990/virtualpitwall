export const SET_TELEMETRY = 'SET_TELEMETRY';
export const CLEAR_LAPS = 'CLEAR_LAPS';
export const ADD_TELEMETRY_LAPS = 'ADD_TELEMETRY_LAPS';

export const addTelemetryLaps = (sessionNumber, newLaps) => {
    return {
        type: ADD_TELEMETRY_LAPS,
        sessionNumber: sessionNumber,
        newLaps: newLaps
    };
}

export const telemetryClear = () => {
    return {
        type: SET_TELEMETRY,
        telemetry: null,
    };
}

export const telemetryUpdate = (telemetry) => {
    return {
        type: SET_TELEMETRY,
        telemetry: telemetry
    };
}