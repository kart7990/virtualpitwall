import {
  BaseGameDataProvider,
  PitwallState,
  PitwallSessionResponse,
} from "./models";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: PitwallState = {
  session: null,
};

export const pitwallSessionSlice = createSlice({
  name: "pitwallState",
  initialState,
  reducers: {
    init: (state, action: PayloadAction<PitwallSessionResponse>) => {
      console.log("init");
      state.session = action.payload.pitwallSession;
      if (action.payload.pitwallSession.gameDataProviders.length > 0) {
        state.session.selectedDataProvider =
          action.payload.pitwallSession.gameDataProviders[0];
        var iRacingSessionsCount =
          state.session.selectedDataProvider.gameAssignedSessionIds.length;
        if (iRacingSessionsCount > 0) {
          //Select latest session (simply select last session in collection, might not be accurate, need to test)
          state.session.selectedIRacingSessionId =
            state.session.selectedDataProvider.gameAssignedSessionIds[
              iRacingSessionsCount - 1
            ];
        }
      }
      state.session.webSocketEndpoints = action.payload.webSocketEndpoints;
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
