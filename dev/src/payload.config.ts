import { buildConfig } from 'payload/config';
import path from 'path';
import Examples from './collections/Examples';
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
// @ts-ignore
import { magicLoginPlugin } from '../../src/index';
import payload from 'payload';

export default buildConfig({
  admin: {
    bundler: webpackBundler(),
    webpack: config => {
      const newConfig = {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...(config?.resolve?.alias || {}),
            react: path.join(__dirname, '../node_modules/react'),
            'react-dom': path.join(__dirname, '../node_modules/react-dom'),
            payload: path.join(__dirname, '../node_modules/payload'),
          },
        },
      }
      return newConfig
    },
  },
  email: {
    fromName: 'Oscar - GetRekd app',
    fromAddress: 'oscar@getrekd.lol',
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
  serverURL: process.env.SERVER_URL || 'http://localhost:3000',
  editor: slateEditor({}),
  collections: [
    Examples,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [magicLoginPlugin({ enabled: true, secret: process.env.PAYLOAD_SECRET, payload: payload })],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})
