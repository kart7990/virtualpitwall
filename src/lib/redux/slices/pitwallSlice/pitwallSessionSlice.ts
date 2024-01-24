import { DynamicSessionData } from "../sessionSlice/models";
import {
  BaseGameDataProvider,
  PitwallState,
  PitwallSessionResponse,
  GameSession,
  TrackSession,
  BaseGameSession,
  BaseTrackSession,
  DynamicTrackSessionData,
} from "./models";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: PitwallState = {
  session: null,
  gameSession: null,
};

export const pitwallSlice = createSlice({
  name: "pitwallState",
  initialState,
  reducers: {
    init: (state, action: PayloadAction<PitwallSessionResponse>) => {
      state.session = action.payload.pitwallSession;
      if (action.payload.pitwallSession.gameDataProviders.length > 0) {
        state.session.selectedDataProvider =
          action.payload.pitwallSession.gameDataProviders[0];
        var iRacingSessionsCount =
          state.session.selectedDataProvider.gameAssignedSessionIds.length;
        if (iRacingSessionsCount > 0) {
          state.session.selectedIRacingSessionId =
            state.session.selectedDataProvider.currentGameAssignedSessionId;
        }
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
      state.session!!.selectedDataProvider =
        state.session!!.gameDataProviders.find(
          (gdp) => gdp.id === action.payload,
        )!!;
    },
    newGameSession: (state, action: PayloadAction<BaseGameSession>) => {
      state.session!!.selectedIRacingSessionId =
        action.payload.gameAssignedSessionId;
      state.session!!.selectedDataProvider.currentGameAssignedSessionId =
        action.payload.gameAssignedSessionId;
      state.session!!.selectedDataProvider.gameAssignedSessionIds.push(
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
    reset: (state) => {
      //this might not work, had issues in other slices, need to test
      state = initialState;
    },
  },
});
