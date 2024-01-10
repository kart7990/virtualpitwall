import type { ReduxState, } from '@/lib/redux'
import { createSelector } from '@reduxjs/toolkit'
import { jwtDecode } from "jwt-decode"
import { JwtPayload, User } from './models'

export const selectOAuthToken = (state: ReduxState) => state.auth.oAuthToken

export const selectIsAuthenticated = createSelector(
    [selectOAuthToken], (oAuthToken) => {
        return (oAuthToken != undefined && oAuthToken != null)
    }
)

export const selectUser = createSelector(
    [selectOAuthToken], (oAuthToken) => {
        if (oAuthToken == null) {
            throw Error("oAuthToken null, unable to retrieve user")
        }

        const decoded = jwtDecode<JwtPayload>(oAuthToken.accessToken)
        const user: User = { email: decoded.sub, name: decoded.name, pitBoxSessionId: decoded.PitBoxSessionId}
        return user
    }
)
