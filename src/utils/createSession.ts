// @ts-ignore
import session from "express-session";
import payload, { Payload } from "payload";

const create = (payload: Payload) => session({
  resave: false,
  saveUninitialized: false,
  secret: payload.secret || "unsafe",
});

export default { create }