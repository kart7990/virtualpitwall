export interface SessionState {
    pitBoxSession: PitBoxSession | undefined;
    isActive: boolean;
    isAvailable: boolean;
    timingProviders: TimingProvider[];
    completedLaps: Lap[];
    telemetryLaps: LapTelemetry[];
    webSocketEndpoints: { [id in HubEndpoint] : string; } | undefined;
}

export interface PitBoxSession {
    id: string;
    teamId: string;
    creatorUserId: string;
    eventDetails: EventDetails;
}

export interface EventDetails {
    subSessionId: number;
    currentTrackSessionNumber: number;
    type: string;
    isActive: boolean,
    isAvailable: boolean,
    isCarTelemetryActive: boolean,
    trackSessions: TrackSession[];
}

export interface TrackSession {
    sessionNumber: number;
    sessionType: string;
    sessionName: string;
    raceLaps: string;
    flags: string;
    raceTime: number;
    isTimed: boolean;
    isRace: boolean;
    isQualify: boolean;
    isPractice: boolean;
    isFixedLaps: boolean;
    isMulticlass: boolean;
    playerCustId: number | null;
    isSpectator: boolean;
    track: Track;
}

export interface Track {
    id: number;
    name: string;
    codeName: string;
    length: number;
}

export interface TimingProvider {
    pitboxSessionId: string;
    id: string;
    name: string;
}

export interface Lap {
    lapNumber: number;
    lapTime: number;
    stint: number;
    simTimeOfDay: number;
    conditions: Conditions;
    position: number;
    classPosition: number;
    driverName: string;
    carNumber: string;
    driverCustId: number;
    sessionNumber: number;
    raceTimeRemaining: number;
    inPitLane: boolean;
    pitStopCount: number;
    sessionTimeLapStart: number;
    sessionTimeLapEnd: number;
}

export interface LapTelemetry {
    lapNumber: number;
    stintLapNumber: number;
    sessionNumber: number;
    lapTime: LapTime;
    raceTimeRemaining: number;
    fuelLapStart: number;
    fuelLapEnd: number;
    fuelConsumed: number;
    maxSpeed: number;
    minSpeed: number;
    maxRpm: number;
    minRpm: number;
    incidentCountLapStart: number;
    incidentCountLapEnd: number;
    inPitLane: boolean;
    greenFlagFullLap: boolean;
    incidentCount: number;
}

export interface LapTime {
    value: number;
    lapNumber: number;
    display: string;
    diffDisplay: string;
    displayShort: string;
}

export interface Conditions {
    airDensity: number;
    airPressure: number;
    airTemp: number;
    fogLevel: number;
    skies: string;
    weatherType: number;
    trackTemp: number;
    trackUsage: string;
    relativeHumidity: number;
    windDirection: string;
    windSpeed: number;
}

export enum HubEndpoint {
    Session,
    Standings,
    Laps,
    Telemetry
}

export interface DynamicSessionData {
    sessionNumber: number;
    sessionState: string;
    flags: string;
    sessionLapsRemaining: number;
    isActive: boolean;
    isAvailable: boolean;
    isCarTelemetryActive: boolean;
    timing: SessionTiming;
    conditions: Conditions;
}

export interface SessionTiming {
    sessionTime: number;
    raceTimeRemaining: number;
    estimatedRaceLaps: number;
    estimatedWholeRaceLaps: number;
    leaderLapsRemaining: number;
    leaderWholeLapsRemaining: number;
    simTimeOfDay: number;
    simDate: string;
}