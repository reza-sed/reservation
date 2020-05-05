import * as types from "./actionTypes";
export function requestAuthenticateUser(key) {
  return { type: types.REQUEST_AUTHENTICATE_USER, key };
}

export function processAuthenticateUser(
  status = types.AUTHENTICATING,
  session = null
) {
  return {
    type: types.PROCESS_AUTHENTICATE_USER,
    authenticated: status,
    session,
  };
}

export function setState(state = {}) {
  return { type: types.SET_STATE, state };
}
