import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { loginSuccess, logout } from './authActions';

const TOKEN_STORAGE_KEY = "tokens";

// const dispatch = useDispatch()
// const authentication = useSelector(state => state.authentication)

export function configure(store) {
  if (tokensExist()) {
    const tokens = getTokens();
    store.dispatch(loginSuccess(tokens));
  }

  // Add auth token request interceptor
  axios.interceptors.request.use(function (request) {
    if (request.url.indexOf("/authentication/") === -1) {
      if (tokensExist()) {
        request.headers.Authorization = getAuthorizationHeaderValue();
      } else {
        store.dispatch(logout(false));
      }
    }
    request.headers['Expires'] = '-1';
    request.headers['Cache-Control'] = "no-cache,no-store,must-revalidate,max-age=-1,private";
    return request;
  }, function (err) {
    throw err;
  });
}

export function onAuthSuccess(rawTokens) {
  saveTokens(rawTokens)
  return loginSuccess(getTokens())
}

export function getAuthorizationHeaderValue() {
  const tokens = getTokens();
  let headerValue = null;
  if (tokens != null) {
    headerValue = `Bearer ${tokens.accessToken}`;
  }
  return headerValue;
}

/**
 * Logout
 */
export function logoff(userLogout = true) {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  return logout(userLogout)
}

/**
 * Save tokens
 */
function saveTokens(tokens, rememberUser) {
  if (rememberUser) {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  } else {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  }
}

/**
 * Get tokens
 */
export function getTokens() {
  let tokens = JSON.parse(localStorage.getItem(TOKEN_STORAGE_KEY));
  if (!tokens) {
    tokens = JSON.parse(sessionStorage.getItem(TOKEN_STORAGE_KEY));
  }
  if (tokens) {
    let roles = [];
    let decoded = jwt_decode(tokens.accessToken);

    let expiration = new Date(0).setUTCSeconds(decoded.exp);

    if (Date.now() < expiration) {
      if (decoded.role) {
        if (decoded.role.constructor === Array) {
          roles = decoded.role;
        } else {
          roles.push(decoded.role);
        }
      }
      tokens.roles = roles;

      if (decoded.email) {
        tokens.email = decoded.email;
      }

      if (decoded.name) {
        tokens.name = decoded.name;
      }
      if (decoded.PitBoxSessionId) {
        tokens.pitboxSessionId = decoded.PitBoxSessionId;
      }
    } else {
      console.log('asdasdasd')
      tokens = null
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      sessionStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }
  return tokens;
}

/**
 * Access token exists
 */
export function tokensExist() {
  let tokens = getTokens();
  return tokens != null;
}

export function getAccessToken() {
  if (tokensExist()) {
    let tokens = getTokens();
    return tokens.accessToken;
  } else {
    return null;
  }
}

