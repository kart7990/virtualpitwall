import {
  BaseGameDataProvider,
  PitwallState,
  PitwallSessionResponse,
  GameSession,
  TrackSession,
  BaseGameSession,
  BaseTrackSession,
} from "./models";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: PitwallState = {
  session: null,
  gameSession: null,
};

export const pitwallSessionSlice = createSlice({
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
    newGameSession: (state, action: PayloadAction<BaseGameSession>) => {
      state.session!!.selectedIRacingSessionId =
        action.payload.gameAssignedSessionId;
      state.session!!.selectedDataProvider.currentGameAssignedSessionId =
        action.payload.gameAssignedSessionId;
    },
    addGameDataProvider: (
      state,
      action: PayloadAction<BaseGameDataProvider>,
    ) => {
      if (state.session != null) {
        state.session.gameDataProviders = [
          ...state.session.gameDataProviders,
          action.payload,
        ];
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
        state.session.gameDataProviders =
          state.session.gameDataProviders.filter(
            (gdp) => gdp.id !== action.payload.id,
          );
      } else {
        throw Error(
          "PitwallSession is null, unable to remove game data provider.",
        );
      }
    },
    reset: (state) => {
      //this might not work, had issues in other slices, need to test
      state = initialState;
    },
  },
});
