import { take, put, select } from "redux-saga/effects";
import * as types from "./actions/actionTypes";
import uuid from "uuid";
import { createReservation } from "./actions/reserveAction";

export function* reservationSaga() {
  while (true) {
    const { roomId } = yield take(types.REQUEST_RESERVATION);
    const ownerId = 123;
    const reservationId = "123213312";
    yield put(createReservation(roomId, ownerId, reservationId));
  }
}
