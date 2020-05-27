import express from "express";
import { connectDB } from "./../connect-db";
import reservationStatus from "./../../utils/reservationStatus";
import { MongoDate } from "./../../utils/dateUtils";
import auth from "../middleware/auth";
import Joi from "@hapi/joi";
import winston from "winston";

const router = express.Router();

export const addNewReservation = async reservation => {
  let db = await connectDB();
  let collection = db.collection("reservations");

  if (!validate(reservation))
    return res.status(400).send("داده های خود را چک کرده و دوباره ارسال کنید");

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
  const dataCount = await collection
    .find({
      reserveFromDate: { $lt: new Date(reserveToDate * 1000) },
      reserveToDate: { $gt: new Date(reserveFromDate * 1000) },
      isDeleted: false,
      status: { $ne: reservationStatus.CANCELED },
    })
    .count();

  if (dataCount === 0) {
    await collection.insertOne(accReservation);
    return "added";
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
        winston.error(err);
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
  res.status(200).send("done");
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
    //infPerId: Joi.number().required(),
    reserveFromDate: Joi.number().required(),
    reserveToDate: Joi.number().required(),
  });

  const { error } = schema.validate(r);

  return error.details.length === 0;
}

export default router;
