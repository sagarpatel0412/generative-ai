/* eslint-disable no-undef */
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');

const SECRET_KEY = process.env.JWT_SECRET;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
};

const unAuthObj = {
  status: 401,
  message: 'Unauthorized',
  reason: 'Either you didnt pass auth token or pass expired auth token',
};

passport.use(
  new JwtStrategy(options, (jwtPayload, done) => {
    try {
      const user = { sub: jwtPayload.sub, username: jwtPayload.username, email:jwtPayload.email };

      if (user) {
        return done(null, user);
      } else {
        return done(null, false, unAuthObj);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.customAuthenticate = (strategy, options = {}) => {
  return (req, res, next) => {
    passport.authenticate(strategy, options, (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      if (!user) {
        return res.status(401).json(unAuthObj);
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

module.exports = passport;
