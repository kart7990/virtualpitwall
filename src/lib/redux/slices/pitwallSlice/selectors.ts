import type { ReduxState } from "@/lib/redux";
import { createSelector } from "@reduxjs/toolkit";
import { LiveTiming, TimingTelemetry } from "./models";

export const getPitwallSession = (state: ReduxState) => state.pitwall.session;

export const getPitwallSessionId = (state: ReduxState) =>
  state.pitwall.session?.id;

export const getSelectedDataProvider = (state: ReduxState) =>
  state.pitwall.session?.selectedDataProvider;

export const getDataProviders = (state: ReduxState) =>
  state.pitwall.session?.gameDataProviders;

export const getSelectedTelemetryProvider = (state: ReduxState) =>
  state.pitwall.session?.selectedTelemetryProvider;

export const getTelemetryProviders = (state: ReduxState) =>
  state.pitwall.session?.telemetryProviders;

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

export const getLiveTiming = (state: ReduxState) =>
  state.pitwall.liveTiming.map((lt) => new LiveTiming(lt));

export const getSelectedCarNumber = (state: ReduxState) =>
  state.pitwall.selectedCarNumber;

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

export const selectDataProvider = createSelector(
  [getSelectedDataProvider, getDataProviders],
  (selectedDataProvider, dataProviders) => {
    if (dataProviders != null && dataProviders.length > 0) {
      return dataProviders.find((gdp) => gdp.id === selectedDataProvider);
    }
  },
);

export const selectTelemetryProvider = createSelector(
  [getSelectedTelemetryProvider, getTelemetryProviders],
  (selectedTelemetryProvider, telemetryProviders) => {
    if (telemetryProviders != null && telemetryProviders.length > 0) {
      return telemetryProviders.find(
        (tp) => tp.id === selectedTelemetryProvider,
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

export const selectCurrentTrack = createSelector(
  [selectCurrentTrackSession],
  (currentSession) => {
    return currentSession?.track;
  },
);

export const selectTelemetry = (state: ReduxState) => {
  return {
    car: state.pitwall.telemetry?.car,
    timing: new TimingTelemetry(state.pitwall.telemetry?.timing),
    laps: state.pitwall.telemetry?.laps,
  };
};

export const selectCurrentCar = createSelector(
  [getLiveTiming, selectTelemetryProvider],
  (liveTiming, telemetryProvider) => {
    return liveTiming.find(
      (lt) => lt.carNumber === telemetryProvider?.carNumber,
    );
  },
);
