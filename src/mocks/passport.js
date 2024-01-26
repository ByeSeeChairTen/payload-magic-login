
module.exports = {
  initialize: () => (req, res, next) => next(),
  session: () => (req, res, next) => next(),
  authenticate: (name) => (req, res, next) => next(),
  use: () => {},
  serializeUser: () => {},
  deserializeUser: () => {},
};