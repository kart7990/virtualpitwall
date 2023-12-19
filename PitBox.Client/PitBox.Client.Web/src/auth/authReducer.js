import { LOGIN_SUCCESS, LOGOUT } from "./authActions";

export default function (state = {isAuthenticated: false}, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state, isAuthenticated: true, isUserLogout: false, roles: action.roles, email: action.email, name: action.name, pitboxSessionId: action.pitboxSessionId }
        case LOGOUT:
            return { ...state, isAuthenticated: false, roles: [], isUserLogout: action.userLogout, email: null, name: null };
        default:
            return state;
    }
}