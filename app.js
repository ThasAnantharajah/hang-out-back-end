require("dotenv").config();
require("./models/connection");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/upload')
var eventsRouter = require('./routes/events')
var messagesRouter = require('./routes/messages')
var activitiesRouter = require('./routes/activities')
var sportsRouter = require('./routes/sports')
var app = express();



// upload setup
const fileUpload = require("express-fileupload");
app.use(fileUpload());

const cors = require('cors');
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/", uploadRouter);
app.use("/events", eventsRouter);
app.use("/", messagesRouter);
app.use("/", activitiesRouter)
app.use("/", sportsRouter)

module.exports = app;
