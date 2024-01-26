import { Payload } from "payload"

export interface PluginTypes {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean
  secret: string
  payload: Payload
}

export interface NewCollectionTypes {
  title: string
}
