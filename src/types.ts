import { Payload } from "payload"

export interface PluginTypes {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean
  /**
   * Secret used to sign JWTs
   */
  secret: string
  /**
   * The payload instance
   * @default payload
   */
  payload: Payload

  /**
   * Your own custom targets:
   * @default []
   * @example
   * targets: [
   *  { 
   *   target: "app",
   *   uri: "exp://my-app.example.com",
   *   subject: "GetRekd: Login Link",
   *   html: `Click this link to finish logging in: <a href="${link}">LOGIN LINK</a>, if you can't click the link, copy and paste this link into your browser: ${link}`
   *  },
   *  {
   *   target: "admin",
   *   uri: "https://admin.getrekd.lol",
   *   subject: "GetRekd: Login Link",
   *   html: `Click this link to finish logging in: <a href="${link}">LOGIN LINK</a>, if you can't click the link, copy and paste this link into your browser: ${link}`
   *  }
   * ]
   */
  targets?: Array<{ target: string, uri: string, subject: string, html: (link: string) => string }>
}