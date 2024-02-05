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
      targets: [
         {
          target: "app-dev",
          uri: "exp://my-app-dev.exp.direct",
          subject: "GetRekd: Login Link",
          html: (link) => `Click this link to finish logging in: <a href="${link}">LOGIN LINK</a>, if you can't click the link, copy and paste this link into your browser: \n\n${link}`
        },
      ]
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

#### Things to consider

At this moment, it creates a user collection for you - with an email and salt/hash (plan is to support this alongside local auth, working on that).
I will add support to extend this or have it update the given collection at a later date.

#### Example

In the dev folder, you’ll find a basic payload project, created with `npx create-payload-app`.

The `magicLoginPlugin` has already been installed to the `payload.config()` file in this project.

```ts
plugins: [
  magicLoginPlugin({
      secret: process.env.PAYLOAD_SECRET, // A secret used to sign the JWTs
      payload: payload, // Your payload instance
      enabled: true, 
      // Targets are used to determine where the link should point to.
      // For example: target: "admin" (default) creates a link to the admin panel.
      // The targets "app" and "app-dev" could be for opening the link in an app.
      targets: [
        {
          target: "app",
          uri: "exp://my-app.exp.direct",
          subject: "GetRekd: Login Link",
          html: (link) => `Click this link to finish logging in: <a href="${link}">LOGIN LINK</a>, if you can't click the link, copy and paste this link into your browser: ${link}`
        },
        {
          target: "app-dev",
          uri: "exp://my-app-dev.exp.direct",
          subject: "GetRekd: Login Link",
          html: (link) => `Click this link to finish logging in: <a href="${link}">LOGIN LINK</a>, if you can't click the link, copy and paste this link into your browser: \n\n${link}`
        },
      ]
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
  `targets?: Array<{ target: string, uri: string, subject: string, html: (link: string) => string }>`
}
```

##### Testing

I will implement tests shortlyTM.


### Contribute

Feel free to submit PRs and suggestions, the code isn't perfect by any means and is provided as-is. 