import type { ReduxState } from "@/lib/redux";
import { createSelector } from "@reduxjs/toolkit";

export const getPitwallSession = (state: ReduxState) => state.pitwall.session;

export const getPitwallSessionId = (state: ReduxState) =>
  state.pitwall.session?.id;

export const getSelectedDataProvider = (state: ReduxState) =>
  state.pitwall.session?.selectedDataProvider;

export const getSelectedIRacingSessionId = (state: ReduxState) =>
  state.pitwall.session?.selectedIRacingSessionId;

export const getGameSession = (state: ReduxState) => state.pitwall.gameSession;

export const getCurrentTrackSessionNumber = (state: ReduxState) =>
  state.pitwall.gameSession?.currentTrackSession;

export const getTrackSessions = (state: ReduxState) =>
  state.pitwall.gameSession?.trackSessions;

export const getCurrentConditions = (state: ReduxState) =>
  state.pitwall.gameSession?.trackSessions.find(
    (ts) => ts.number === getCurrentTrackSessionNumber(state),
  );

export const selectCurrentTrackSession = createSelector(
  [getCurrentTrackSessionNumber, getTrackSessions],
  (currentTrackSessionNumber, trackSessions) => {
    if (trackSessions != null && trackSessions.length > 0) {
      return trackSessions.find(
        (ts) => ts.number === currentTrackSessionNumber,
      );
    }
  },
);

export const selectCurrentConditions = createSelector(
  [selectCurrentTrackSession],
  (currentSession) => {
    return currentSession?.currentConditions;
  },
);
