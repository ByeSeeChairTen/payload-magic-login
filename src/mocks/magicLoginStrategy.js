

class MockJWTStrategy {
  constructor(options, verify) {
    this.name = 'jwt';
    this._verify = verify;
    this._options = options;
  }

  authenticate(req, options) {
    // Implement your mock logic here
  }
}

export default MockJWTStrategy
