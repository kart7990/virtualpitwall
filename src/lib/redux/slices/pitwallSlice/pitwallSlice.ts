import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  BaseGameDataProvider,
  BaseGameSession,
  BaseTelemetryProvider,
  BaseTrackSession,
  CompletedLaps,
  CompletedTelemetryLaps,
  DynamicTrackSessionData,
  GameSession,
  LiveTimingDto,
  PitwallSessionResponse,
  PitwallState,
  Telemetry,
} from "./models";

const initialState: PitwallState = {
  session: null,
  gameSession: null,
  liveTiming: [],
  selectedCarNumber: null,
  telemetry: null,
};

export const pitwallSlice = createSlice({
  name: "pitwallState",
  initialState,
  reducers: {
    init: (state, action: PayloadAction<PitwallSessionResponse>) => {
      state.session = action.payload.pitwallSession;
      if (action.payload.pitwallSession.gameDataProviders.length > 0) {
        state.session.selectedDataProvider =
          action.payload.pitwallSession.gameDataProviders[0].id;
        var iRacingSessionsCount =
          state.session.gameDataProviders[0].gameAssignedSessionIds.length;
        if (iRacingSessionsCount > 0) {
          state.session.selectedIRacingSessionId =
            state.session.gameDataProviders[0].currentGameAssignedSessionId;
        }
      }
      if (action.payload.pitwallSession.telemetryProviders.length > 0) {
        state.session.selectedTelemetryProvider =
          action.payload.pitwallSession.telemetryProviders[0].id;
      }
      state.session.webSocketEndpoints = action.payload.webSocketEndpoints;
    },
    setGameSession: (state, action: PayloadAction<GameSession>) => {
      state.gameSession = action.payload;
    },
    changeTrackSession: (state, action: PayloadAction<BaseTrackSession>) => {
      let sessions = state.gameSession!!.trackSessions.filter(
        (ts) => ts.number !== action.payload.number,
      );
      sessions.push({
        ...action.payload,
        completedLaps: null,
        currentConditions: null,
        conditionHistory: [],
      });
      state.gameSession!!.trackSessions = sessions;
      state.gameSession!!.currentTrackSession = action.payload.number;
    },
    changeDataProvider: (state, action: PayloadAction<string>) => {
      state.session!!.selectedDataProvider = action.payload;
    },
    changeTelemetryProvider: (state, action: PayloadAction<string>) => {
      state.session!!.selectedTelemetryProvider = action.payload;
    },
    newGameSession: (state, action: PayloadAction<BaseGameSession>) => {
      state.session!!.selectedIRacingSessionId =
        action.payload.gameAssignedSessionId;

      var gameDataProvider = state.session!!.gameDataProviders.find(
        (gdp) => gdp.id == state.session!!.selectedDataProvider,
      )!!;

      gameDataProvider.currentGameAssignedSessionId =
        action.payload.gameAssignedSessionId;
      gameDataProvider.gameAssignedSessionIds.push(
        action.payload.gameAssignedSessionId,
      );
    },
    addGameDataProvider: (
      state,
      action: PayloadAction<BaseGameDataProvider>,
    ) => {
      if (state.session != null) {
        state.session.gameDataProviders.push(action.payload);
      } else {
        throw Error(
          "PitwallSession is null, unable to add game data provider.",
        );
      }
    },
    addTelemetryProvider: (
      state,
      action: PayloadAction<BaseTelemetryProvider>,
    ) => {
      if (state.session != null) {
        state.session.telemetryProviders.push(action.payload);
      } else {
        throw Error(
          "PitwallSession is null, unable to add telemetry provider.",
        );
      }
    },
    updateTelemetryProvider: (
      state,
      action: PayloadAction<BaseTelemetryProvider>,
    ) => {
      if (state.session != null) {
        var telemetryProvider = state.session.telemetryProviders.find(
          (tp) => tp.id == action.payload.id,
        )!!;
        telemetryProvider.carNumber = action.payload.carNumber;
        telemetryProvider.gameUserId = action.payload.gameUserId;
        telemetryProvider.gameUserName = action.payload.gameUserName;
        telemetryProvider.isOnTrack = action.payload.isOnTrack;
      } else {
        throw Error(
          "PitwallSession is null, unable to add telemetry provider.",
        );
      }
    },
    removeGameDataProvider: (
      state,
      action: PayloadAction<BaseGameDataProvider>,
    ) => {
      if (state.session != null) {
        state.session.gameDataProviders.splice(
          state.session.gameDataProviders.findIndex(
            (gdp) => gdp.id !== action.payload.id,
          ),
          1,
        );
      } else {
        throw Error(
          "PitwallSession is null, unable to remove game data provider.",
        );
      }
    },
    setDynamicTrackSessionData: (
      state,
      action: PayloadAction<DynamicTrackSessionData>,
    ) => {
      const session = state.gameSession!!.trackSessions.find(
        (ts) => ts.number === state.gameSession!!.currentTrackSession,
      )!!;
      session.state = action.payload.sessionState;
      session.flags = action.payload.flags;
      session.lapsRemaining = action.payload.lapsRemaining;
      session.serverTime = action.payload.serverTime;
      session.gameDateTime = action.payload.gameDateTime;
      session.raceTimeRemaining = action.payload.raceTimeRemaining;
      session.estimatedRaceLaps = action.payload.estimatedRaceLaps;
      session.estimatedWholeRaceLaps = action.payload.estimatedWholeRaceLaps;
      session.leaderLapsRemaining = action.payload.leaderLapsRemaining;
      session.leaderWholeLapsRemaining =
        action.payload.leaderWholeLapsRemaining;
      session.currentConditions = action.payload.conditions;
    },
    setStandings: (state, action: PayloadAction<LiveTimingDto[]>) => {
      state.liveTiming = action.payload;
    },
    addLaps: (state, action: PayloadAction<CompletedLaps>) => {
      const session = state.gameSession!!.trackSessions.find(
        (ts) => ts.number === state.gameSession!!.currentTrackSession,
      )!!;
      action.payload.laps.forEach((lap) => {
        session.completedLaps?.laps.push(lap);
      });
      session.completedLaps!!.lastUpdate = action.payload.lastUpdate;
    },
    setSelectedCar: (state, action: PayloadAction<String | null>) => {
      state.selectedCarNumber = action.payload;
    },
    setTelemetry: (state, action: PayloadAction<Telemetry>) => {
      if (state.telemetry == null) {
        state.telemetry = {
          car: action.payload.car,
          timing: action.payload.timing,
          laps: [],
        };
      } else {
        state.telemetry.car = action.payload.car;
        state.telemetry.timing = action.payload.timing;
      }
    },
    addTelemetryLaps: (
      state,
      action: PayloadAction<CompletedTelemetryLaps>,
    ) => {
      action.payload.laps.forEach((lap) => {
        state.telemetry?.laps.push(lap);
      });
    },
    reset: (state) => {
      //this might not work, had issues in other slices, need to test
      state = initialState;
    },
  },
});
