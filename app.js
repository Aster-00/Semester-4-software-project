const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const User = require("./Models/user");
const app = express();
const userRoutes = require("./Routes/user");
const eventRoutes = require("./Routes/event");
const authRoutes = require("./Routes/auth");
const bookingRoutes = require("./Routes/booking");
const authenticationMiddleware = require('./Middleware/authenticationMiddleware');
const authrizationMiddleware = require("./Middleware/authorizationMiddleware");

const cors = require("cors");

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser())

const allowedOrigins = [process.env.ORIGIN];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use("/api/v1", authRoutes);

//to check if the user is authrized 
app.use(authenticationMiddleware);

app.use("/api/v1/users", userRoutes);

//to get the user booking
app.use("/api/v1/bookings", bookingRoutes);

app.use("/api/v1/events", eventRoutes);

const db_name = process.env.DB_NAME;
const db_url = `${process.env.DB_URL}/${db_name}`;

mongoose
  .connect(db_url)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => {
    console.log(e);
  });

app.use(function (req, res, next) {
  return res.status(404).send("404");
});

app.listen(process.env.PORT, () => console.log("server started"));

