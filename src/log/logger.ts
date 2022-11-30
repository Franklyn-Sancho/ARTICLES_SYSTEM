import { createLogger, transports, format } from "winston";

export const logger = createLogger({
  format: format.combine(format.errors({ stack: true }), format.json()),
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "info.log", level: "info" }),
  ],
});
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

