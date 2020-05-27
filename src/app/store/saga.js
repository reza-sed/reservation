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
import { authenticateUser, setHeader } from "../service/authenticateService";
import { toast } from "react-toastify";
import {
  addReservation,
  updateReservation,
} from "./../service/reservationService";

const getSession = state => state.session;

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

    const session = yield select(getSession);
    const res = yield addReservation({
      id: id,
      sectionName: sectionName,
      description: description,
      reserveFromDate: reserveFromDate,
      reserveToDate: reserveToDate,
      roomId: roomId,
      //infPerId: session.id,
    });

    if (!res) {
      return toast.info("بازه انتخاب شده قبلا رزرو شده است");
    }

    yield put(
      createReservation(
        roomId,
        sectionName,
        description,
        new Date(reserveFromDate * 1000).toISOString(),
        new Date(reserveToDate * 1000).toISOString(),
        id,
      ),
    );

    history.replace("/dashboard");
  }
}

export function* reservationModificationSaga() {
  while (true) {
    const params = yield take([
      types.DELETE_RESERVATION,
      types.SET_RESERVATION_STATUS,
    ]);

    let reservation = { id: params.reservationId };
    if (params.status) {
      reservation = { ...reservation, status: params.status };
    } else {
      reservation = { ...reservation, isDeleted: true };
    }

    const res = yield updateReservation(reservation);
    if (res) toast.info(res);
  }
}

export function* userAuhtenticationSaga() {
  while (true) {
    const { key } = yield take(types.REQUEST_AUTHENTICATE_USER);
    try {
      const { data } = yield authenticateUser(key);
      if (!data) {
        toast.error("پاسخی از سمت سرور در یافت نشد.");
      }

      yield put(setState(data.state));
      yield put(
        processAuthenticateUser(types.AUTHENTICATED, data.state.session),
      );
      setHeader();

      history.push("/dashboard");
    } catch (e) {
      yield put(processAuthenticateUser(types.NOT_AUTHENTICATED));
      toast.error("could not authenticate", e);
    }
  }
}
