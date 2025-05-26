const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config();

const User = require("./Models/user");
const app = express();
const userRoutes = require("./Routes/user");
const eventRoutes = require("./Routes/event");
const authRoutes = require("./Routes/auth");
const bookingRoutes = require("./Routes/booking");
const authenticationMiddleware = require('./Middleware/authenticationMiddleware');
const bookingRoutes = require("./Routes/booking");
const authenticationMiddleware = require('./Middleware/authenticationMiddleware');
const authrizationMiddleware = require("./Middleware/authorizationMiddleware");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

app.use(cookieParser())

app.use(
  cors({
    origin: process.env.ORIGIN, 
    methods: ["GET", "POST", "DELETE", "PUT","PATCH"],
    credentials: true,
  })
);

app.use("/api/v1", authRoutes);


//to check if the user is authrized 
app.use(authenticationMiddleware);

//to get the user booking
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/users", userRoutes);

const db_name = process.env.DB_NAME;
const db_url = `${process.env.DB_URL}/${db_name}`; // if it gives error try to change the localhost to 127.0.0.1

mongoose
  .connect(db_url)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => {
    console.log(e);
  });

app.use(function (req, res, next) {
  return res.status(404).send("404");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(process.env.PORT, () => console.log("server started"));

module.exports = app;

