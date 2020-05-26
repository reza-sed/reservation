import reservationStatus from "../utils/reservationStatus";

export default {
  // session: {
  //   authenticated: false,
  // },
  reservations: [
    {
      id: 1,
      roomId: 1,
      sectionName: "بهره برداری",
      description: "",
      infPerId: 124,
      requestDate: new Date(),
      finalizedDate: new Date(),
      status: reservationStatus.ACCEPTED, // 'requested', 'accepted', 'canceled'
      reserveFromDate: new Date(),
      reserveToDate: new Date(),
      isDeleted: false,
    },
  ],
  rooms: [
    {
      id: 1,
      name: "سالن سیروان",
    },
    {
      id: 2,
      name: "سالن پرنده های آبی",
    },
  ],
  // admins: [{ infPerId: 123, name: "مظلوم" }],
  users: [
    { infPerId: 123, name: "مظلوم", isAdmin: true },
    { infPerId: 124, name: "علی اکبری" },
  ],
};
