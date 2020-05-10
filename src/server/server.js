import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from "./connect-db";
import reservationStatus from "../utils/reservationStatus";
import { authenticationRoute } from "./authenticate";
import { MongoDate } from "../utils/dateUtils";

let port = 7777;
let app = express();

app.listen(port, console.log(`server listening on port ${port}`));

app.use(cors(), bodyParser.urlencoded({ extended: true }), bodyParser.json());
authenticationRoute(app);

export const addNewReservation = async reservation => {
  let db = await connectDB();
  let collection = db.collection("reservations");

  // convert unix epochs to timestamps
  const { reserveFromDate, reserveToDate } = reservation;

  let accReservation = {
    ...reservation,
    reserveFromDate: new Date(reserveFromDate * 1000),
    reserveToDate: new Date(reserveToDate * 1000),
    requestDate: new Date(),
    status: reservationStatus.REQUESTED,
    isDeleted: false,
  };

  //check for overlapping
  const data = await collection
    .find({
      reserveFromDate: { $lt: new Date(reserveToDate * 1000) },
      reserveToDate: { $gt: new Date(reserveFromDate * 1000) },
      isDeleted: false,
      status: { $ne: reservationStatus.CANCELED },
    })
    .count();

  if (data === 0) {
    await collection.insertOne(accReservation);
    return "done";
  }
  return null;
};

export const updateReservation = async reservation => {
  let { id, status, isDeleted } = reservation;
  let db = await connectDB();
  let collection = db.collection("reservations");

  if (status) {
    await collection.updateOne(
      { id },
      { $set: { status, finalizedDate: new Date() } },
      (err, documents) => {
        console.log(err);
        return documents;
      },
    );
  }

  if (isDeleted) {
    await collection.updateOne({ id }, { $set: { isDeleted } });
  }
};

app.post("/reserve/new", async (req, res) => {
  let rs = req.body.reservation;
  const response = await addNewReservation(rs);
  res.status(200).send(response);
});

app.put("/reserve/update", async (req, res) => {
  let rs = req.body.reservation;
  await updateReservation(rs);
  res.status(200).send("ok");
});

app.get("/checkdate", async (req, res) => {
  let { roomid, date } = req.query;
  const db = await connectDB();

  const md = new MongoDate(new Date(parseInt(date) * 1000));

  const response = await db
    .collection("reservations")
    .find({
      roomId: roomid,
      status: reservationStatus.ACCEPTED,
      reserveFromDate: {
        $gt: md.getJustDate(),
        $lte: new Date(md.NPrevDate(-1)),
      },
    })
    .toArray();

  res.status(200).send(response);
});
