import * as types from "./../actions/actionTypes";

export default function reservationReducer(state = [], action) {
  switch (action.type) {
    case types.SET_STATE:
      return action.state.reservations;
    case types.CREATE_RESERVATION:
      return [
        ...state,
        {
          roomId: action.roomId,
          sectionName: action.sectionName,
          description: action.description,
          reserveFromDate: action.reserveFromDate,
          reserveToDate: action.reserveToDate,
          id: action.id,
        },
      ];
    case types.REQUEST_RESERVATION:
      return state;
    case types.SET_RESERVATION_STATUS:
      return state.map((r) => {
        return r.id === action.id ? { ...r, status: action.status } : r;
      });
    case types.DELETE_RESERVATION:
      return state.filter((r) => r.id !== action.id);
    default:
      return state;
  }
}
