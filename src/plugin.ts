import type { Config, Plugin } from 'payload/config'

import { onInitExtension } from './onInitExtension'
import type { PluginTypes } from './types'
import { extendWebpackConfig } from './webpack'
import LoginButton from './components/AfterLogin/LoginButton';
import APIError from 'payload/dist/errors/APIError';
import httpStatus from 'http-status'
// @ts-ignore
import passport from "passport";
import MagicLoginStrategy from './strategies/MagicLoginStrategy';
import JWTStrategy from './strategies/JWTStrategy';
import createSession from './utils/createSession';
import { signJwt } from './utils/signJwt';
import getCookieExpiration from 'payload/dist/utilities/getCookieExpiration';
import { Payload } from 'payload';


type PluginType = (pluginOptions: PluginTypes) => Plugin

export const magicLoginPlugin =
  (pluginOptions: PluginTypes): Plugin =>
    (incomingConfig) => {
      let config = { ...incomingConfig }
      const { payload } = pluginOptions;

      // If you need to add a webpack alias, use this function to extend the webpack config
      const webpack = extendWebpackConfig(incomingConfig)

      const sendMagicLink = async (destination: string, href: string) => {
        const params = new URLSearchParams(href.split("?")[1]);
        const targetIsAdmin = params.get("target") === "admin";

        if (targetIsAdmin) {
          const link = `${payload.config.serverURL}/api${href}`
          payload.sendEmail({
            to: destination,
            from: payload.emailOptions.fromAddress,
            subject: "GetRekd: Login Link",
            html: `Click this link to finish logging in: <a href="${link}">LOGIN LINK</a>, if you can't click the link, copy and paste this link into your browser: ${link}`
          })
          return;
        }

        const target = pluginOptions.targets?.find(target => href.includes(`target=${target.target}`))
        if (target) {
          const token = params.get("token");
          const link = `${target.uri}?email=${destination}&token=${token}`
          payload.sendEmail({
            to: destination,
            from: payload.emailOptions.fromAddress,
            subject: target.subject,
            html: target.html(link)
          })
          return;
        }
      }

      const magicLoginStrategy = MagicLoginStrategy({ payload, sendMagicLink });

      const sessionMiddleware = createSession.create(payload);

      // If config.email isn't defined, throw an error
      if (!config.email) {
        console.log('You forgot to define an email configuration in your Payload config');

        config.email = {
          fromName: "Admin",
          fromAddress: "noreply@email.com",
          logMockCredentials: true,
        }
      }

      config.admin = {
        ...(config.admin || {}),
        // If you extended the webpack config, add it back in here
        // If you did not extend the webpack config, you can remove this line
        webpack,

        // Add additional admin config here

        components: {
          ...(config.admin?.components || {}),
          // Add additional admin components here
          afterLogin: [
            ...(config.admin?.components?.afterLogin || []),
            LoginButton,
          ],
        },
      }

      // If the plugin is disabled, return the config without modifying it
      // The order of this check is important, we still want any webpack extensions to be applied even if the plugin is disabled
      if (pluginOptions.enabled === false) {
        return config
      }

      config.collections = [
        ...(config.collections || []),
        {
          slug: 'users',
          admin: {
            useAsTitle: 'email',
          },
          auth: {
            disableLocalStrategy: true,
            strategies: [{ name: "magiclogin", strategy: magicLoginStrategy }, {
              name: "jwt", strategy: JWTStrategy({ ...payload, secret: pluginOptions.secret } as Payload)
            }]
          },
          fields: [
            {
              name: "email",
              type: "email",
              required: true,
            },
            {
              name: 'salt',
              hidden: true,
              type: 'text',
            },
            {
              name: 'hash',
              hidden: true,
              type: 'text',
            },
          ],
        }

      ]

      config.endpoints = [
        ...(config.endpoints || []),
        // Add additional endpoints here
        {
          path: "/auth/logout",
          method: "post",
          handler: (req, res) => {

            if (!req.user) throw new APIError('No User', httpStatus.BAD_REQUEST)

            res.clearCookie(`payload-token`, {
              domain: "localhost",
              path: "/",
              httpOnly: true,
            }).send()
            return req.t('authentication:loggedOutSuccessfully')

          }
        },
        {
          path: "/auth/magiclogin",
          method: "post",
          handler: magicLoginStrategy.send
        },
        {
          path: "/auth/magiclogin/confirm",
          method: "get",
          handler: [
            sessionMiddleware, passport.authenticate("magiclogin"), (req, res) => {
              const sanitizedUser = { ...req.user };
              if (sanitizedUser.hash) delete sanitizedUser.hash;
              if (sanitizedUser.salt) delete sanitizedUser.salt;

              const collectionConfig = payload.collections["users"].config;

              const token = signJwt(sanitizedUser, payload);

              // Set a cookie in the response with the JWT
              res.cookie("payload-token", token, {
                path: "/",  // Cookie path
                httpOnly: true,  // HttpOnly flag for security
                expires: getCookieExpiration(collectionConfig.auth.tokenExpiration),  // Cookie expiration time
                secure: collectionConfig.auth.cookies.secure,  // Secure flag (for HTTPS)
                sameSite: collectionConfig.auth.cookies.sameSite,  // SameSite attribute
                domain: collectionConfig.auth.cookies.domain || undefined,  // Cookie domain
              });

              if (req.query.target === "admin") {
                res.redirect("/admin")
              } else {
                res.send({ success: true, token })
              }
            }]
        }
      ]

      passport.use("magiclogin", magicLoginStrategy);

      config.globals = [
        ...(config.globals || []),
        // Add additional globals here
      ]

      config.hooks = {
        ...(config.hooks || {}),
        // Add additional hooks here
      }

      config.onInit = async payload => {
        if (incomingConfig.onInit) await incomingConfig.onInit(payload)
        // Add additional onInit code by using the onInitExtension function
        onInitExtension(pluginOptions, payload)
      }

      return config
    }
