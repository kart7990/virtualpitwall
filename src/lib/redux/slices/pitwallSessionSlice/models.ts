export interface PitwallState {
  session: PitwallSession | null;
  gameSession: GameSession | null;
}

export interface PitwallSessionResponse {
  pitwallSession: PitwallSession;
  webSocketEndpoints: WebSocketEndpoints;
}

export interface PitwallSession {
  id: string;
  teamId: string;
  accessCode: string;
  creatorUserId: string;
  selectedIRacingSessionId: string;
  selectedDataProvider: BaseGameDataProvider;
  selectedTelemetryProvider: TelemetryProvider;
  gameDataProviders: BaseGameDataProvider[];
  telemetryProviders: TelemetryProvider[];
  webSocketEndpoints: WebSocketEndpoints;
}

export interface WebSocketEndpoints {
  session: string;
  standings: string;
  laps: string;
  telemetry: string;
  v2PitwallSession: string;
  v2GameDataPublisher: string;
  v2GameDataSubscriber: string;
}

export interface BaseGameDataProvider {
  id: string;
  pitwallSessionId: string;
  userId: string;
  name: string;
  currentGameAssignedSessionId: string;
  gameAssignedSessionIds: string[];
}

export interface TelemetryProvider {
  id: string;
  pitwallSessionId: string;
  userId: string;
  name: string;
  carNumber: string;
  gameUserId: string;
  gameUserName: string;
}

export enum HubEndpoint {
  Session,
  Standings,
  Laps,
  Telemetry,
  v2PitwallSession,
  v2GameDataPublisher,
  v2GameDataSubscriber,
}

export interface GameSession extends BaseGameSession {
  trackSessions: TrackSession[];
}

export interface BaseGameSession {
  id: string;
  gameAssignedSessionId: string;
  type: string;
  currentTrackSession: number;
}

export interface BaseTrackSession {
  number: number;
  type: string;
  name: string;
  state: string;
  raceLaps: string;
  flags: string;
  raceTime: number;
  isTimed: boolean;
  isFixedLaps: boolean;
  isMulticlass: boolean;
  lapsRemaining: number;
  isActive: boolean;
  serverTime: number;
  gameDateTime: number;
  raceTimeRemaining: number;
  estimatedRaceLaps: number;
  estimatedWholeRaceLaps: number;
  leaderLapsRemaining: number;
  leaderWholeLapsRemaining: number;
  track: Track;
}

export interface TrackSession extends BaseTrackSession {
  currentConditions: Conditions | null;
  completedLaps: CompletedLaps | null;
  conditionHistory: Conditions[];
}

export interface Conditions {
  id: string;
  gameDateTime: number;
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

export interface CompletedLaps {
  laps: CompletedLap[];
  lastUpdate: number;
}

export interface CompletedLap {
  lapNumber: number;
  lapTime: number;
  stint: number;
  position: number;
  classPosition: number;
  driverName: string;
  carNumber: string;
  driverCustId: number;
  trackSessionNumber: number;
  raceTimeRemaining: number;
  inPitLane: boolean;
  pitStopCount: number;
  gameDateTimeLapStart: number;
  sessionTimeLapStart: number;
  sessionTimeLapEnd: number;
  conditionsIdLapStart: string;
  conditionsIdLapEnd: string;
}

export interface Track {
  id: number;
  name: string;
  codeName: string;
  length: number;
}
