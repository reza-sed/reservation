import * as types from "./actionTypes";

export function requestReservation(
  roomId,
  sectionName,
  description,
  reserveFromDate,
  reserveToDate
) {
  return {
    type: types.REQUEST_RESERVATION,
    roomId,
    sectionName,
    description,
    reserveFromDate,
    reserveToDate,
  };
}

export function createReservation(
  roomId,
  sectionName,
  description,
  reserveFromDate,
  reserveToDate,
  id
) {
  return {
    type: types.CREATE_RESERVATION,
    roomId,
    sectionName,
    description,
    reserveFromDate,
    reserveToDate,
    id,
  };
}
