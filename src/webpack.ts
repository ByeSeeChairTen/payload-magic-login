import path from 'path'
import type { Config } from 'payload/config'
import type { Configuration as WebpackConfig } from 'webpack'

const mockModulePath = path.resolve(__dirname, 'mocks/module.js')
const mockPassportPath = path.resolve(__dirname, 'mocks/passport.js')
const mockSignJwtPath = path.resolve(__dirname, 'mocks/signJwt.js')
const mockJwtStrategyPath = path.resolve(
  __dirname,
  'mocks/jwtStrategy.js'
)
const mockMagicLoginStrategyPath = path.resolve(
  __dirname,
  'mocks/magicLoginStrategy.js'
)
export const extendWebpackConfig =
  (config: Config): ((webpackConfig: WebpackConfig) => WebpackConfig) =>
    // @ts-ignore  
    webpackConfig => {
      const existingWebpackConfig =
        typeof config.admin?.webpack === 'function'
          ? config.admin.webpack(webpackConfig)
          : webpackConfig

      const newWebpack = {
        ...existingWebpackConfig,
        resolve: {
          ...(existingWebpackConfig.resolve || {}),
          alias: {
            ...(existingWebpackConfig.resolve?.alias ? existingWebpackConfig.resolve.alias : {}),
            // Add additional aliases here like so:
            [path.resolve(
              __dirname,
              'strategies/signJwt'
            )]: mockSignJwtPath,

            [path.resolve(
              __dirname,
              'strategies/JWTStrategy'
            )]: mockJwtStrategyPath,

            [path.resolve(
              __dirname,
              'utils/createSession'
            )]: mockModulePath,

            'connect-mongo': mockModulePath,
            'express-session': mockModulePath,
            passport: mockPassportPath,
          },
          fallback: {
            ...(existingWebpackConfig.resolve?.fallback ? existingWebpackConfig.resolve.fallback : {}),
            util: require.resolve("util/"),
            stream: require.resolve("stream-browserify"),
          },
        },
      }

      return newWebpack
    }
