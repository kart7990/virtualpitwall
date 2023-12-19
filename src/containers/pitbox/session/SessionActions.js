export const SESSION_JOIN = 'PITBOX_SESSION_JOIN';
export const SESSION_RESET = 'PITBOX_SESSION_RESET';
export const TRACK_SESSION_CHANGE = 'TRACK_SESSION_CHANGE';
export const TRACK_SESSION_UPDATE = 'TRACK_SESSION_UPDATE';

export const pitboxSessionJoin = (sessionState) => {
    return { 
        type: SESSION_JOIN,
        pitBoxSession: sessionState.pitBoxSession,
        completedLaps: sessionState.completedLaps,
        completedTelemetryLaps: sessionState.telemetryLaps,
        isActive: sessionState.isActive,
        isAvailable: sessionState.isAvailable,
        webSocketEndpoints: sessionState.webSocketEndpoints
    };
}

export const pitboxSessionReset = (pitBoxSession) => {
    return { 
        type: SESSION_RESET, 
        pitBoxSession: pitBoxSession
    };
}

export const trackSessionChange = (trackSession) => {
    return { type: TRACK_SESSION_CHANGE, newTrackSession: trackSession };
}

export const trackSessionUpdate = (dynamicSessionData) => {
    return { type: TRACK_SESSION_UPDATE, dynamicSessionData: dynamicSessionData };
}
