import axiosWrapper from "./httpService";
import { store } from "./../store";
const authEndPoint = "/authenticate";

export function authenticateUser(key) {
  return axiosWrapper.post(authEndPoint, { id: key });
}

export function getJWT() {
  const state = store.getState();
  return state.session && state.session.token;
}

export function setHeader() {
  axiosWrapper.setJWT(getJWT());
}
