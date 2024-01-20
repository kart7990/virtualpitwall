import { BaseGameDataProvider } from "./models";
import type { ReduxState } from "@/lib/redux";

export const getPitwallSession = (state: ReduxState) => state.pitwall.session;

export const getSelectedDataProvider = (state: ReduxState) =>
  state.pitwall.session?.selectedDataProvider;

export const getSelectedIRacingSessionId = (state: ReduxState) =>
  state.pitwall.session?.selectedIRacingSessionId;

export const getGameSession = (state: ReduxState) => state.pitwall.gameSession;

export const getCurrentTrackSessionNumber = (state: ReduxState) =>
  state.pitwall.gameSession?.currentTrackSession;
