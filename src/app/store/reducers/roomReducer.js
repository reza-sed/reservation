import * as types from "./../actions/actionTypes";
import defaultState from "../../../server/defaultState";

export default function roomReducer(state = [], action) {
  switch (action.type) {
    case types.SET_STATE:
      return action.state.rooms;
    default:
      return state;
  }
}
