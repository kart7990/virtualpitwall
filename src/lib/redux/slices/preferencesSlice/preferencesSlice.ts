import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const STORAGE_KEY: string = "pref_measurementSystem"

export enum MeasurementSystem {
    Imperial,
    Metric
}

export interface PreferencesSliceState {
    measurementSystem: MeasurementSystem
}

const initialState: PreferencesSliceState = {
    measurementSystem: localStorage.getItem(STORAGE_KEY) ?
        MeasurementSystem[localStorage.getItem(STORAGE_KEY) as keyof typeof MeasurementSystem]
        : MeasurementSystem.Metric,
}

export const preferencesSlice = createSlice({
    name: 'preferences',
    initialState,
    reducers: {
        updateMeasurementSystem: (state, action: PayloadAction<MeasurementSystem>) => {
            localStorage.setItem(STORAGE_KEY, MeasurementSystem[action.payload])
            state.measurementSystem = action.payload
        },
        reset: (state) => {
            state = initialState
        }
    }
})
