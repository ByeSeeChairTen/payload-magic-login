// @ts-ignore
import session from "express-session";
import MongoStore from 'connect-mongo'
import payload, { Payload } from "payload";

const create = (payload: Payload) => session({
  resave: false,
  saveUninitialized: false,
  secret: payload.secret || "unsafe",
  store: MongoStore.create({ mongoUrl: process.env.DATABASE_URI })
});

export default { create }