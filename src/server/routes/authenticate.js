import express from "express";
import { generateToken } from "./../utils/token";
import { connectDB } from "./../connect-db";

const router = express.Router();

router.post("/", async (req, res) => {
  let infPerId = req.body.id;

  let db = await connectDB();
  let collection = db.collection("users");
  let user = await collection.findOne({ infPerId: parseInt(infPerId) });

  if (!user) return res.status(404).send("user is not existed");

  let token = generateToken(user);
  let reservations = [];
  if (user.isAdmin) {
    reservations = await db
      .collection("reservations")
      .find({ isDeleted: false })
      .toArray();
  } else {
    reservations = await db
      .collection("reservations")
      .find({
        isDeleted: false,
        infPerId: parseInt(infPerId),
        reserveFromDate: { $gte: new Date() },
      })
      .toArray();
  }

  let rooms = await db.collection("rooms").find().toArray();

  let state = {
    reservations,
    rooms,
    session: {
      token,
      isAdmin: user.isAdmin || false,
      //      id: infPerId,
      authenticated: `AUTHENTICATED`,
    },
  };

  res.status(200).send({ state });
});

export default router;
