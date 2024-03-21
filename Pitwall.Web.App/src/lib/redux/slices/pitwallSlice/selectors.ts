import { ReduxState } from "@/lib/redux";
import { createSelector } from "@reduxjs/toolkit";
import { Measurement, MeasurementSystem } from "../preferencesSlice/models";
import {
  CarTelemetry,
  CompletedLap,
  LapTelemetry,
  LiveTiming,
  TimingTelemetry,
} from "./models";

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

export const getLiveTiming = (state: ReduxState) => {
  return state.pitwall.liveTiming;
};

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

export const selectLiveTiming = createSelector(
  [getLiveTiming, selectCurrentTrackSession],
  (liveTiming, currentTrackSession) => {
    const session = currentTrackSession;
    return liveTiming.map((lt) => new LiveTiming(lt, session));
  },
);

export const getSelectedCar = createSelector(
  [getSelectedCarNumber, selectLiveTiming],
  (selectedCarNumber, liveTiming) => {
    return liveTiming.find((x) => x.carNumber == selectedCarNumber);
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

export const getCarTelemetry = (state: ReduxState) => {
  return state.pitwall.telemetry?.car;
};

export const getTimingTelemetry = (state: ReduxState) => {
  return state.pitwall.telemetry?.timing;
};

export const getTelemetryLaps = (state: ReduxState) => {
  return state.pitwall.telemetry?.laps;
};

// Hack - Unable to import the selector from the preferences selector because importing selectors has issues: https://github.com/reduxjs/reselect/issues/169
const getMeasurementSystem = (state: ReduxState) =>
  state.preferences.measurementSystem;

const selectMeasurementSystem = createSelector(
  [getMeasurementSystem],
  (measurementSystem: MeasurementSystem) => {
    return new Measurement(measurementSystem);
  },
);

export const selectTelemetry = createSelector(
  [
    getCarTelemetry,
    getTimingTelemetry,
    getTelemetryLaps,
    selectMeasurementSystem,
  ],
  (carTelemetry, timingTelemetry, telemetryLaps, measurementSystem) => {
    return {
      car: new CarTelemetry(carTelemetry, measurementSystem),
      timing: new TimingTelemetry(timingTelemetry),
      laps: telemetryLaps
        ? telemetryLaps.map((lap) => new LapTelemetry(lap, measurementSystem))
        : [],
    };
  },
);

export const selectCurrentCar = createSelector(
  [selectLiveTiming, selectTelemetryProvider],
  (liveTiming, telemetryProvider) => {
    return liveTiming.find(
      (lt) => lt.carNumber === telemetryProvider?.carNumber,
    );
  },
);

export const selectCompletedLapsBySessionNumber = (number: number) => {
  return createSelector(
    [getTrackSessions, selectMeasurementSystem],
    (trackSessions, measurement) => {
      if (trackSessions) {
        const s = trackSessions.find((ts) => ts.number === number);
        return {
          laps: s?.completedLaps?.laps.map(
            (lap) => new CompletedLap(lap, measurement),
          ),
          lastUpdate: s?.completedLaps?.lastUpdate,
        };
      }
    },
  );
};
