import { BaseGameDataProvider } from "./models";
import type { ReduxState } from "@/lib/redux";

export const getPitwallSession = (state: ReduxState) => state.pitwall.session;

export const getSelectedDataProvider = (state: ReduxState) =>
  state.pitwall.session?.selectedDataProvider;

export const getSelectedIRacingSessionId = (state: ReduxState) =>
  state.pitwall.session?.selectedIRacingSessionId;
