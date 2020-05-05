import defaultState from "../../../server/defaultState";
import * as types from "../actions/actionTypes";

export default function sessionReducer(
  state = defaultState.session || {},
  action
) {
  let { type, authenticated, session } = action;
  switch (type) {
    case types.REQUEST_AUTHENTICATE_USER:
      return { ...state, authenticated: types.AUTHENTICATING };
    case types.PROCESS_AUTHENTICATE_USER:
      return { ...state, authenticated, ...session };
    default:
      return state;
  }
}
