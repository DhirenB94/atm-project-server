require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

require("./configs/passport");

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("trust proxy", 1); //allows heroku to recieve connections from other websites


//Session Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
      sameSite: true, //the front and backend on the same domain as the server (initially at least on localhost)
      secure: false, //at time of creation not using https - will change upon deployment
      httpOnly: true,
      maxAge: 600000, //time in ms of session expiration
    },
    rolling: true, //session gets refreshed with interactions
  })
);

//intialise passport
app.use(passport.initialize());
//connect passport to the session
app.use(passport.session());


// default value for title local
app.locals.title = 'ATM Project';

app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_HOSTNAME],
  })
);



const index = require('./routes/index');
app.use('/', index);

const userRoute = require("./routes/user");
app.use("/api/user", userRoute);

const pinRoute = require("./routes/pins");
app.use("/api/pins", pinRoute);



module.exports = app;
