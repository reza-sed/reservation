import { combineReducers } from "redux";
import reservations from "./reservationReducer";
import rooms from "./roomReducer";
import session from "./sessionReducer";

const rootReducer = combineReducers({ reservations, rooms, session });
export default rootReducer;
