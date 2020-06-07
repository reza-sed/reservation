import axios from "axios";
import { toast } from "react-toastify";
import { client } from "../../../config/default.json";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    toast.error("خطای ناشناخته، لطفا با مدیر سیستم تماس بگیرید.");
  }

  return Promise.reject(error);
});

function setJWT(jwt) {
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

axios.defaults.baseURL = client.remoteApi;

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  setJWT,
};
