export interface PitwallState {
  session: PitwallSession | null;
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
