import defaultState from "./defaultState";
import { connectDB } from "./connect-db";

async function initializeDB() {
  const db = await connectDB();
  for (let collectionName in defaultState) {
    let collection = db.collection(collectionName);
    await collection.insertMany(defaultState[collectionName]);
  }
}

initializeDB();
