import { MongoClient } from "mongodb";
import config from "config";

const url = config.get("mongourl");
let db = null;

export async function connectDB() {
  if (db) return db;
  let client = await MongoClient.connect(url, { useNewUrlParser: true });
  db = client.db();

  console.log("Got db", db);
  return db;
}
