import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const STORAGE_KEY: string = "auth_oauthToken"

export interface JWT {
    accessToken: string,
    expires: number
    refreshToken: string
}

export interface AuthSliceState {
    oAuthToken: JWT | null
}

const initialState: AuthSliceState = {
    oAuthToken: (typeof window !== 'undefined' && window.localStorage) ? localStorage.getItem(STORAGE_KEY) ? JSON.parse(localStorage.getItem(STORAGE_KEY)!!) : null : null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authSuccess: (state, action: PayloadAction<JWT>) => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload))
            state.oAuthToken = action.payload
        },
        logoff: (state) => {
            localStorage.removeItem(STORAGE_KEY)
            state.oAuthToken = null
        }
    }
})
