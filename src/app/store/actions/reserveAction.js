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

export function modifyReservationStatus(reservationId, status) {
  return { type: types.SET_RESERVATION_STATUS, reservationId, status };
}

export function deleteReservation(reservationId) {
  return { type: types.DELETE_RESERVATION, reservationId };
}
