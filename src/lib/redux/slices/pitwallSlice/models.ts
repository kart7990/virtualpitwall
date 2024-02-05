import { N_A } from "@/components/utils/constants";
import {
  convertMsToDisplay,
  convertToDelta,
} from "@/components/utils/formatter/TimeConversion";

export interface PitwallState {
  session: PitwallSession | null;
  gameSession: GameSession | null;
  liveTiming: LiveTiming[];
  selectedCarNumber: String | null;
  telemetry: Telemetry | null;
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
  selectedDataProvider: string;
  selectedTelemetryProvider: string;
  gameDataProviders: BaseGameDataProvider[];
  telemetryProviders: BaseTelemetryProvider[];
  webSocketEndpoints: WebSocketEndpoints;
}

export interface WebSocketEndpoints {
  session: string;
  standings: string;
  laps: string;
  telemetry: string;
  v2PitwallSession: string;
  v2GameDataSubscriber: string;
  v2TelemetrySubscriber: string;
}

export interface BaseGameDataProvider {
  id: string;
  pitwallSessionId: string;
  userId: string;
  name: string;
  currentGameAssignedSessionId: string;
  gameAssignedSessionIds: string[];
}

export interface BaseTelemetryProvider {
  id: string;
  pitwallSessionId: string;
  userId: string;
  name: string;
  carNumber: string;
  gameUserId: string;
  gameUserName: string;
  isOnTrack: boolean;
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

export interface DynamicTrackSessionData {
  sessionState: string;
  flags: string;
  lapsRemaining: number;
  serverTime: number;
  gameDateTime: number;
  raceTimeRemaining: number;
  estimatedRaceLaps: number;
  estimatedWholeRaceLaps: number;
  leaderLapsRemaining: number;
  leaderWholeLapsRemaining: number;
  conditions: Conditions;
}

export interface LiveTimingDto {
  p: number;
  cp: number;
  sp: number;
  scp: number;
  cn: string;
  cln: string;
  ci: number;
  cc: string;
  crn: string;
  cd: boolean;
  ir: number;
  sr: string;
  dn: string;
  dns: string;
  d: number;
  t: string;
  ld: string;
  nd: string;
  lt: number;
  bt: number;
  ln: number;
  pc: number;
  sl: number;
}

export class LiveTiming {
  bestLaptime: number;
  carName: string;
  carNumber: string;
  classColor: string;
  classId: number;
  className: string;
  classPosition: number;
  driverName: string;
  driverShortName: string;
  iRating: number;
  isCurrentDriver: boolean;
  lap: number;
  lapDistancePercent: number;
  lastLaptime: number;
  leaderDelta: string;
  nextCarDelta: string;
  pitStopCount: number;
  position: number;
  safetyRating: string;
  standingClassPosition: number;
  standingPosition: number;
  stintLapCount: number;
  teamName: string;

  constructor(s: LiveTimingDto) {
    this.position = s.p;
    this.classPosition = s.cp;
    this.standingPosition = s.sp;
    this.standingClassPosition = s.scp;
    this.carNumber = s.cn;
    this.className = s.cln;
    this.classId = s.ci;
    this.classColor = s.cc;
    this.carName = s.crn;
    this.isCurrentDriver = s.cd;
    this.iRating = s.ir;
    this.safetyRating = s.sr;
    this.driverName = s.dn;
    this.driverShortName = s.dns;
    this.lapDistancePercent = s.d;
    this.teamName = s.t;
    this.leaderDelta = s.ld;
    this.nextCarDelta = s.nd;
    this.lastLaptime = s.lt;
    this.bestLaptime = s.bt;
    this.lap = s.ln;
    this.pitStopCount = s.pc;
    this.stintLapCount = s.sl;
  }

  getBestLapTime = (): string => {
    let res = N_A;
    if (this.bestLaptime !== undefined) {
      res = convertMsToDisplay(this.bestLaptime);
    }
    return res;
  };

  getLastLapTime = (): string => {
    let res = N_A;
    if (this.lastLaptime !== undefined) {
      res = convertMsToDisplay(this.lastLaptime);
    }
    return res;
  };
}

export interface Telemetry {
  car: CarTelemetry | null;
  timing: TimingTelemetry | null;
  laps: CompletedLapDetails[];
}

export interface CarTelemetry {
  throttle: number;
  brake: number;
  clutch: number;
  steeringAngle: number;
  rPM: number;
  speed: number;
  fuelQuantity: number;
  fuelPercent: number;
  fuelConsumedLap: number | null;
  fuelPressure: number;
  oilTemp: number;
  oilPressure: number;
  waterTemp: number;
  voltage: number;
}

export interface TimingTelemetry {
  driverCurrentLap: number;
  incidents: number;
  driverLapsComplete: number;
  currentLapTime: number;
  lapDeltaToSessionBestLap: number;
  lapDistancePercentage: number;
}

export class TimingTelemetryClass {
  currentLap!: number;
  incidents!: number;
  completeLaps!: number;
  currentLapTime!: number;
  deltaToSessionBest!: number;
  lapDistancePercentage!: number;

  constructor(timingTelemetry: TimingTelemetry | null | undefined) {
    if (timingTelemetry) {
      this.currentLap = timingTelemetry.currentLapTime;
      this.incidents = timingTelemetry.incidents;
      this.completeLaps = timingTelemetry.driverLapsComplete;
      this.currentLapTime = timingTelemetry.currentLapTime;
      this.deltaToSessionBest = timingTelemetry.lapDeltaToSessionBestLap;
      this.lapDistancePercentage = timingTelemetry.lapDeltaToSessionBestLap;
    }
  }

  getCurrentLap = (): string => {
    let res = N_A;
    if (this.currentLap !== undefined) {
      res = convertToDelta(this.currentLap);
    }

    return res;
  };

  getCarDelta = (): string => {
    return this.isDeltaNegative()
      ? "- " + convertToDelta(Math.abs(this.deltaToSessionBest))
      : this.isDeltaPositive()
        ? "+ " + convertToDelta(this.deltaToSessionBest)
        : "\u00B1 " + convertToDelta(this.deltaToSessionBest);
  };

  isDeltaNegative = (): boolean => {
    return this.deltaToSessionBest < 0;
  };

  isDeltaPositive = (): boolean => {
    return this.deltaToSessionBest > 0;
  };

  getIncidents = (): string => {
    return "" + this.incidents;
  };
}

export interface CompletedTelemetryLaps {
  laps: CompletedLapDetails[];
  lastUpdate: number;
}

export interface CompletedLapDetails {
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
