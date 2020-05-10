import { v1 as uuidv1 } from "uuid";
import des from "nod3des";
import { connectDB } from "./connect-db";

const secret = "wlefehewhfiwehfidwqfweqfrw324324";
const authenticationTokens = [];

export const authenticationRoute = app => {
  app.post("/authenticate", async (req, res) => {
    let encryptedInfperId = req.body.id;
    let infPerId = 0;
    try {
      infPerId = des.decrypt(secret, encryptedInfperId);
    } catch (e) {
      return res.status(403).send("wrong value");
    }

    let isAdmin = false;

    let db = await connectDB();
    let collection = db.collection("admins");
    let user = await collection.findOne({ infPerId: parseInt(infPerId) });

    if (user) isAdmin = true;
    let token = uuidv1();
    let reservations = [];
    if (isAdmin) {
      reservations = await db
        .collection("reservations")
        .find({ isDeleted: false })
        .toArray();
    } else {
      reservations = await db
        .collection("reservations")
        .find({
          isDeleted: false,
          infPerId,
          reserveFromDate: { $gte: new Date() },
        })
        .toArray();
    }
    let rooms = await db
      .collection("rooms")
      .find()
      .toArray();

    let state = {
      reservations,
      rooms,
      session: { isAdmin, id: infPerId, authenticated: `AUTHENTICATED` },
    };
    authenticationTokens.push({ token, infPerId });

    res.status(200).send({ token, state });
  });
};
