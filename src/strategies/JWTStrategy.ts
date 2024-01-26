// @ts-ignore
import type { StrategyOptions } from 'passport-jwt'
// @ts-ignore
import type { Strategy as PassportStrategy } from 'passport-strategy'
// @ts-ignore
import type { Request } from 'express'
import type { SanitizedConfig } from 'payload/dist/config/types'

// @ts-ignore
import passportJwt from 'passport-jwt'
import url from 'url'
import payload, { Payload } from "payload";
import parseCookies from 'payload/dist/utilities/parseCookies'
import { PayloadRequest } from 'payload/types'


const JwtStrategy = passportJwt.Strategy

export default ({ collections, config, secret }: Payload): PassportStrategy => {
  const opts: StrategyOptions = {
    jwtFromRequest: getExtractJWT(config),
    passReqToCallback: true,
    secretOrKey: secret,
  }

  return new JwtStrategy(opts, async (req: PayloadRequest, token: any, done: any) => {
    if (req.user) {
      done(null, req.user)
    }

    try {
      const collection = payload.collections[token.collection]
      const parsedURL = url.parse(req.originalUrl)
      const isGraphQL = parsedURL.pathname === `/api${req.payload.config.routes.graphQL}`

      const user = await req.payload.findByID({
        id: token.id,
        collection: token.collection,
        depth: isGraphQL ? 0 : collection.config.auth.depth,
        req,
      })

      if (user && (!collection.config.auth.verify || user._verified)) {
        user.collection = collection.config.slug
        user._strategy = 'jwt'
        done(null, user)
      } else {
        done(null, false)
      }
    } catch (err) {
      done(null, false)
    }
  })
}

const getExtractJWT =
  (config: SanitizedConfig) =>
    (req: Request): null | string => {
      if (!req?.get) {
        return null
      }

      const jwtFromHeader = req.get('Authorization')
      const origin = req.get('Origin')

      if (jwtFromHeader?.indexOf('JWT ') === 0) {
        return jwtFromHeader.replace('JWT ', '')
      }
      // allow RFC6750 OAuth 2.0 compliant Bearer tokens
      // in addition to the payload default JWT format
      if (jwtFromHeader?.indexOf('Bearer ') === 0) {
        return jwtFromHeader.replace('Bearer ', '')
      }

      const cookies = parseCookies(req)
      const tokenCookieName = "payload-token"
  
      if (!cookies?.[tokenCookieName]) {
        return null
      }

      if (cookies[tokenCookieName]) {
        return cookies[tokenCookieName]
      }
      /*
      if (!origin || config.csrf.length === 0 || config.csrf.indexOf(origin) > -1) {
        return cookies[tokenCookieName]
      }*/

      return null
    }