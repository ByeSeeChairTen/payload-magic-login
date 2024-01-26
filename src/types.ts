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
}