export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';

export const loginSuccess = (tokens) => {
    return { type: LOGIN_SUCCESS, roles: tokens.roles, name: tokens.name, email: tokens.email, pitboxSessionId: tokens.pitboxSessionId };
}

export const logout = (userLogout = true) => {
    return { type: LOGOUT, userLogout: userLogout };
}