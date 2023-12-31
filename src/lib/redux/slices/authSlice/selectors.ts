import type { ReduxState, } from '@/lib/redux'
import { createSelector } from '@reduxjs/toolkit'

export const selectOAuthToken = (state: ReduxState) => state.auth.oAuthToken

export const selectIsAuthenticated = createSelector(
    [selectOAuthToken], (oAuthToken) => {
        return (oAuthToken != undefined && oAuthToken != null)
    }
)