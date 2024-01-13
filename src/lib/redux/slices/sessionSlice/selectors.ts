import type { ReduxState } from "@/lib/redux";
import { createSelector } from "@reduxjs/toolkit";

const getCurrentTrackSessionNumber = (state: ReduxState) =>
  state.session.pitBoxSession!!.eventDetails.currentTrackSessionNumber;

const getEventDetails = (state: ReduxState) =>
  state.session.pitBoxSession?.eventDetails;

const getTrackSessions = (state: ReduxState) =>
  state.session.pitBoxSession!!.eventDetails.trackSessions;

export const selectTelemetryActive = (state: ReduxState) =>
  state.session.pitBoxSession?.eventDetails.isCarTelemetryActive;

export const selectCurrentTrackSessionNumber = (state: ReduxState) =>
  state.session.pitBoxSession?.eventDetails.currentTrackSessionNumber;

export const isEventSessionActive = createSelector(
  [getEventDetails],
  (currentEvent) => {
    return currentEvent?.isActive && currentEvent.isAvailable;
  },
);

export const selectCurrentSession = createSelector(
  [getCurrentTrackSessionNumber, getTrackSessions],
  (currentTrackSessionNumber, trackSessions) => {
    if (trackSessions?.length > 0) {
      return trackSessions.find(
        (ts) => ts.sessionNumber === currentTrackSessionNumber,
      );
    }
  },
);

export const selectCurrentSessionConditions = createSelector(
  [selectCurrentSession],
  (currentSession) => {
    return currentSession?.conditions;
  },
);

export const selectCurrentSessionTiming = createSelector(
  [selectCurrentSession],
  (currentSession) => {
    return currentSession?.timing;
  },
);

export const selectCurrentTrack = createSelector(
  [selectCurrentSession],
  (currentSession) => {
    return currentSession?.track;
  },
);
