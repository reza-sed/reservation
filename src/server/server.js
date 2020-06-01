import express from "express";
import "express-async-errors";
import logger from "./../utils/logger";
import cors from "cors";
import bodyParser from "body-parser";
import config from "config";
import authenticate from "./routes/authenticate";
import reservations from "./routes/reservations";
import error from "./middleware/error";
import winston from "winston";
import compression from "compression";
import helmet from "helmet";
import path from "path";

logger();

if (!config.get("jwttoken")) {
  winston.info("secret jwt key is not set in environment");
  process.exit(1);
}

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.resolve(__dirname, "../../dist")));
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve("index.html"));
  });
}

let port = process.env.PORT || 7777;

let app = express();

app.listen(port, winston.info(`server listening on port ${port}`));
app.use(helmet());
app.use(compression());
app.use(cors(), bodyParser.urlencoded({ extended: true }), bodyParser.json());
app.use("/authenticate", authenticate);
app.use("/reserve", reservations);
app.use(error);
