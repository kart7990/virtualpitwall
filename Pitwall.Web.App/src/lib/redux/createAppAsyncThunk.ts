import type { ReduxDispatch, ReduxState } from "./store";
import { createAsyncThunk } from "@reduxjs/toolkit";

/**
 * ? A utility function to create a typed Async Thunk Actions.
 */
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: ReduxState;
  dispatch: ReduxDispatch;
  rejectValue: string;
}>();
