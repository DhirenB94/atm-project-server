const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const GoogleStrategy = require("passport-google-oauth20");

//Passport - set the user in the session
passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});




//Passport - get the user in the sesison
//req.user 
passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, userDocument);
  });
});




//Passport - authenticate using our database
passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      next(err);
      return;
    }
    if (!foundUser) {
      next(null, false, { message: 'Invalid login' });
      return;
    }
    if (!bcrypt.compareSync(password, foundUser.password)) {
      next(null, false, { message: 'Invalid login' });
      return;
    }
    next(null, foundUser);
  });
}));

//Passport - Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      //The user got authenticated by google
      User.findOne({ googleId: profile.id })
        .then((user) => {
          if (user) {
            //Authenticate and persist in session
            done(null, user);
            return;
          }
          User.create({ googleId: profile.id, username: profile.displayName })
            .then((newUser) => {
              //Authenticate and persist in session
              done(null, newUser);
            })
            .catch((err) => done(err)); // closes User.create()
        })
        .catch((err) => done(err)); // closes User.findOne()
    }
  )
);