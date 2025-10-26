const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config({path: path.join(__dirname, "../.env")});
const routes = require("./routes/router.js");
const logger = require("morgan");

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');


var options ={
  explorer: true,
  swaggerOptions: {
    authAction: {
      JWT: {
        name: 'JWT',
        schema: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: ''
        },
        value: 'Bearer <my own JWT token>'
      }
    }
  }
}

app.use(logger("tiny"));

const databaseConnection = require("../config/db.config.js");
databaseConnection(); 

const cors = require("cors");
app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    allowedHeaders: [
      "X-Requested-With",
      "Content-Type",
      "Authorization",
      "Cookie",
    ],
    credentials: true, // Allows cookies and other credentials
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, "../frontend/dist")));

const session = require("express-session");
const cookieparser = require("cookie-parser");
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SECRET || "its_a_secret",
  })
);

app.use(cookieparser());

const { generatedErrors } = require("./middlewares/error.js");
app.use("/api/v1",routes);
const ErrorHandler = require("./utils/ErrorHandler.js");

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,options));

app.use(generatedErrors);

app.use((req, res, next)=> {
 return res.status(404).json({ status: false, message: `Requested URL not found ${req.url}` });
});


module.exports = app;
