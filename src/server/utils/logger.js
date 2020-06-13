import winston, { format } from "winston";

export default function () {
  winston.exceptions.handle(
    new winston.transports.File({
      filename: "uncaughtExceptions.log",
      format: format.combine(format.timestamp(), format.simple()),
    }),
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(
    new winston.transports.File({
      filename: "logFile.log",
      format: format.combine(format.timestamp(), format.simple()),
    }),
  );

  if (process.env.NODE_ENV !== "production") {
    winston.add(
      new winston.transports.Console({
        format: format.combine(
          format.timestamp(),
          format.colorize(),
          format.simple(),
        ),
      }),
    );
  }
}
