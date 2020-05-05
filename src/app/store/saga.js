import { take, put, select } from "redux-saga/effects";
import { v1 as uuidv1 } from "uuid";
import axios from "axios";
import { history } from "./history";
import * as types from "../store/actions/actionTypes";
import { createReservation } from "./actions/reserveAction";
import {
  processAuthenticateUser,
  setState,
} from "./actions/authenticationAction";
import { URL } from "./../../utils/constants";

const getSession = (state) => state.session;

export function* reservationCreationSaga() {
  while (true) {
    let {
      roomId,
      sectionName,
      description,
      reserveFromDate,
      reserveToDate,
    } = yield take(types.REQUEST_RESERVATION);
    // reserveFromDate = new Date(reserveFromDate * 1000);
    // reserveToDate = new Date(reserveToDate * 1000);
    const id = uuidv1();
    yield put(
      createReservation(
        roomId,
        sectionName,
        description,
        reserveFromDate,
        reserveToDate,
        id
      )
    );

    const session = yield select(getSession);
    const { res } = yield axios.post(`${URL}/reserve/new`, {
      reservation: {
        id: id,
        sectionName: sectionName,
        description: description,
        reserveFromDate: reserveFromDate,
        reserveToDate: reserveToDate,
        roomId: roomId,
        infPerId: session.id,
      },
    });

    console.log(res);
  }
}

export function* reservationModificationSaga() {
  while (true) {
    const reservation = yield take([
      types.DELETE_RESERVATION,
      types.SET_RESERVATION_STATUS,
    ]);

    const { res } = yield axios.put(`${URL}/reserve/update`, {
      reservation: {
        id: reservation.id,
        status: reservation.status,
        isDeleted: reservation.isDeleted,
      },
    });
  }
}

export function* userAuhtenticationSaga() {
  while (true) {
    const { key } = yield take(types.REQUEST_AUTHENTICATE_USER);
    try {
      const { data } = yield axios.post(`${URL}/authenticate`, { id: key });
      if (!data) {
        throw new Error("unable to establish connection");
      }

      yield put(setState(data.state));
      yield put(
        processAuthenticateUser(types.AUTHENTICATED, data.state.session)
      );

      history.push("/dashboard");
    } catch (e) {
      yield put(processAuthenticateUser(types.NOT_AUTHENTICATED));
      console.log("cannot authenticate", e);
    }
  }
}
