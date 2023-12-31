import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const STORAGE_KEY: string = "auth_oauthToken"

export interface JWT {
    accessToken: string,
    expires: number
    refreshToken: string
}

export interface AuthSliceState {
    oAuthToken?: JWT
}

const initialState: AuthSliceState = {
    oAuthToken: (typeof window !== 'undefined' && window.localStorage) ? localStorage.getItem(STORAGE_KEY) ? JSON.parse(localStorage.getItem(STORAGE_KEY)!!) : undefined : undefined
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setJwt: (state, action: PayloadAction<JWT>) => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload))
            state.oAuthToken = action.payload
        },
        clearJwt: (state) => {
            localStorage.removeItem(STORAGE_KEY)
            state = { oAuthToken: undefined }
        }
    }
})
