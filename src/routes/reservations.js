import express from "express";
import { connectDB } from "../server/connect-db";
import reservationStatus from "../utils/reservationStatus";
import { MongoDate } from "../utils/dateUtils";
import auth from "../middleware/auth";
import Joi from "@hapi/joi";

const router = express.Router();

export const addNewReservation = async reservation => {
  let db = await connectDB();
  let collection = db.collection("reservations");

  if (!validate(reservation)) return res.status(400).send();

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

  //check for overlroutering
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

router.post("/new", auth, async (req, res) => {
  let rs = req.body.reservation;
  const response = await addNewReservation(rs);
  res.status(200).send(response);
});

router.put("/update", auth, async (req, res) => {
  let rs = req.body.reservation;
  await updateReservation(rs);
  res.status(200).send("ok");
});

router.get("/checkdate", auth, async (req, res) => {
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

function validate(r) {
  const schema = Joi.object({
    roomId: Joi.number().required(),
    sectionName: Joi.string().required(),
    infPerId: Joi.number().required(),
    reserveFromDate: Joi.number().required(),
    reserveToDate: Joi.number().required(),
  });

  return schema.validate(r);
}

export default router;
