# Payload Magic Login Plugin

## THIS IS A PACKAGE UNDER ACTIVE DEVELOPMENT - USE AT YOUR OWN RISK

This is built with the [Payload CMS](https://payloadcms.com) plugin template.

### How to install this plugin

First install it with `npm install payload-magic-login` (or your preferred package manager).

To then install this plugin, simply add it to your payload.config() in the Plugin array.

```ts
import magicLoginPlugin from 'payload-magic-login';

export const config = buildConfig({
  plugins: [
    // You can pass options to the plugin
    magicLoginPlugin({
      secret: process.env.PAYLOAD_SECRET, // A secret used to sign the JWTs
      payload: payload, // Your payload instance
      enabled: true, 
    })
  ]
});
```

#### It depends on these things in your config:

```ts
  // payload.config.ts
  ...
  email: {
    fromName: 'Oscar - GetRekd app',
    fromAddress: 'oscar@getrekd.lol',
    // You can use the ethereal mail in dev, 
    // but requires some sort of transport options for actual emails (See Payload Docs)
    transportOptions: {
      host: process.env.SMTP_HOST,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      port: process.env.SMTP_PORT,
      secure: Number(process.env.SMTP_SECURE) === 465,
      requireTLS: Number(process.env.SMTP_SECURE) === 587,
    }
  },
  // It will redirect to this URL
  serverURL: process.env.SERVER_URL || 'http://localhost:3000',
  ...
```

#### Example

In the dev folder, you’ll find a basic payload project, created with `npx create-payload-app`.

The `magicLoginPlugin` has already been installed to the `payload.config()` file in this project.

```ts
plugins: [
  magicLoginPlugin({
      secret: process.env.PAYLOAD_SECRET, // A secret used to sign the JWTs
      payload: payload, // Your payload instance
      enabled: true, 
    })
]
```

When you’re ready to start development, navigate into this folder with `cd dev`

And then start the project with `yarn dev` and pull up [http://localhost:3000/](http://localhost:3000/) in your browser.


##### Types.ts

These are the current types/options for the plugin.

```ts
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
```

##### Testing

I will implement tests shortlyTM.


### Contribute

Feel free to submit PRs and suggestions, the code isn't perfect by any means and is provided as-is. 