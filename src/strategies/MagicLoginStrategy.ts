
// @ts-ignore
import passport from "passport";
import MagicLoginStrategy from "passport-magic-login"
import { generatePasswordSaltHash } from "payload/dist/auth/strategies/local/generatePasswordSaltHash";
import crypto from "crypto";
import { Payload } from "payload";

// IMPORTANT: ALL OPTIONS ARE REQUIRED!
export default (payload: Payload): MagicLoginStrategy => {
  async function findOrCreateUser(collectionSlug: string, email: string) {
    let users = await payload.find({
      collection: collectionSlug,
      where: { email: { equals: email } },
      showHiddenFields: true,
    });

    // If user exists, return the user
    if (users.docs && users.docs.length) {
      let user = users.docs[0];
      user.collection = collectionSlug;
      user._strategy = "magiclogin";
      return user;
    } else {
      // Generate a secure random password
      const randomPassword = crypto.randomBytes(32).toString('hex');
      console.log("randomPassword", randomPassword)
      const { hash, salt } = await generatePasswordSaltHash({ password: randomPassword });


      // Register new user
      return await payload.create({
        collection: collectionSlug,
        data: {
          email,
          hash,
          salt,
        },
        showHiddenFields: true,
      });
    }
  }

  passport.serializeUser((user: any, done: (error: any, user: any) => void) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id: string, done: (error: any, user: any) => void) => {
    const ok = await payload.findByID({ collection: "users", id })
    done(null, ok)
  })

  return new MagicLoginStrategy({
    // Used to encrypt the authentication token. Needs to be long, unique and (duh) secret.
    secret: payload.secret || "unsafe",

    // The authentication callback URL
    callbackUrl: "/auth/magiclogin/confirm",

    // Called with th e generated magic link so you can send it to the user
    // "destination" is what you POST-ed from the client
    // "href" is your confirmUrl with the confirmation token,
    // for example "/auth/magiclogin/confirm?token=<longtoken>"
    sendMagicLink: async (destination, href) => {

      const link = `http://localhost:3000/api${href}`

      console.log(link);
      payload.sendEmail({
        to: destination,
        subject: "GetRekd: Login Link",
        html: `Click this link to finish logging in: <a href="${link}">LOGIN LINK</a>, if you can't click the link, copy and paste this link into your browser: ${link}`
      })
    },

    // Once the user clicks on the magic link and verifies their login attempt,
    // you have to match their email to a user record in the database.
    // If it doesn't exist yet they are trying to sign up so you have to create a new one.
    // "payload" contains { "destination": "email" }
    // In standard passport fashion, call callback with the error as the first argument (if there was one)
    // and the user data as the second argument!
    verify: async (payload, callback) => {
      console.log("verify", payload)
      // Get or create a user with the provided email from the database
      let user = await findOrCreateUser("users", payload.destination);
      if (user) {
        callback(null, user);
      }
      else {
        callback(new Error("User not found"));
      }
    },


    // Optional: options passed to the jwt.sign call (https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback)
    jwtOptions: {
      expiresIn: "2 days",
    }
  })
}
