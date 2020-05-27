import axiosWrapper from "./httpService";
const reserveEndPoint = "./reserve";

export function addReservation(reservation) {
  return axiosWrapper.post(`${reserveEndPoint}/new`, reservation);
}

export function updateReservation(reservation) {
  return axiosWrapper.put(`${reserveEndPoint}/update`, reservation);
}

export async function checkReservationDate(unixEpoch, roomid) {
  const { data } = await axiosWrapper.get(`${reserveEndPoint}/checkdate`, {
    params: {
      date: unixEpoch,
      roomid,
    },
  });

  return data;
}
