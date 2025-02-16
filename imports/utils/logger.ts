import pino from "pino";

const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport: process.env.NODE_ENV === "production" 
    ? undefined 
    : {
        target: "pino/file",
        options: {
          destination: 1,
          sync: true
        }
      }
});

export default logger;
