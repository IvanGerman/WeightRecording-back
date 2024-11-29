const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/User');

const { JWT_SECRET_KEY } = require('../common/config');


const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET_KEY
};

module.exports = passport2 = () => { 
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => { 
      try {  
        const user = await User.findById(jwt_payload.userId).select('email id');
        if (user) {  
          return done(null, user);
        } else {  
          return done(null, false);
        }
      } catch(err) { 
        console.log(err);
      }
    })
  )
}


//docs-   https://github.com/mikenicholson/passport-jwt
