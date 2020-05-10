import axios from "axios";
import { URL } from "./constants";

export async function getActiveReservedDates(unixEpoch, roomid) {
  const { data } = await axios.get(`${URL}/checkdate`, {
    params: {
      date: unixEpoch,
      roomid,
    },
  });

  return data;
}
