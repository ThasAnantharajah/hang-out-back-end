require("dotenv").config();  // Charger les variables d'environnement
require("./models/connection");  // Connexion à la base de données

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require('cors');

// Les routes à importer
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const uploadRouter = require('./routes/upload');
const eventsRouter = require('./routes/events');
const messagesRouter = require('./routes/messages');
const activitiesRouter = require('./routes/activities');
const sportsRouter = require('./routes/sports');

const app = express();  // Créer l'application Express


app.use(cors({
  origin: '*', // Autoriser toutes les origines. En production, remplacez par l'origine de votre front-end
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Utilisation des routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/upload", uploadRouter);
app.use("/events", eventsRouter);
app.use("/messages", messagesRouter);
app.use("/activities", activitiesRouter);
app.use("/sports", sportsRouter);

module.exports = app;  // Exporter l'application










































// require("dotenv").config();
// require("./models/connection");
// var express = require("express");
// var path = require("path");
// var cookieParser = require("cookie-parser");
// var logger = require("morgan");
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var uploadRouter = require('./routes/upload')
// var eventsRouter = require('./routes/events')
// var messagesRouter = require('./routes/messages');
// var activitiesRouter = require('./routes/activities')
// var sportsRouter = require('./routes/sports')
// var app = express();


// // upload setup
// const fileUpload = require("express-fileupload");
// app.use(fileUpload());

// app.use(express.json());
// const cors = require('cors');
// app.use(cors());
// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
// app.use("/users", usersRouter);
// app.use("/", uploadRouter);
// app.use("/events", eventsRouter);
// app.use("/messages", messagesRouter);
// app.use("/", activitiesRouter)
// app.use("/", sportsRouter)

// module.exports = app;

