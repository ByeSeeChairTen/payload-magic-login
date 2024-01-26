// @ts-ignore
import jwt from "jsonwebtoken";
import { Payload } from "payload";

export const signJwt = (user: any, payload: Payload) => {
  const collectionConfig = payload.collections["users"].config;
  const token = jwt.sign(user, payload.secret, {
    expiresIn: collectionConfig.auth.tokenExpiration,  // Set token expiration as per configuration
  });

  return token;
}