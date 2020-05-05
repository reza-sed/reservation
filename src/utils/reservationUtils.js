import { axios } from "axios";
import { URL } from "./constants";

export async function getActiveReservedDates(unixEpoch, roomid) {
  let date = new Date(unixEpoch * 1000).toDateString();
  const { data } = await axios.get(`${URL}/checkdate`, {
    params: {
      date,
      roomid,
    },
  });
}
