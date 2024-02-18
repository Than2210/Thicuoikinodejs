const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const hostname = process.env.HOST_NAME || "localhost";

require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI, {
    retryWrites: true,
    w: "majority",
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(express.static(__dirname + "/views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "project", resave: true, saveUninitialized: true }));

app.get("/", (req, res) => {
  res.redirect("/login");
});

const dashboard = require("./routes/dashboard");
const login = require("./routes/login");
const signup = require("./routes/signup");

app.use("/dashboard", dashboard);
app.use("/login", login);
app.use("/signup", signup);

app.listen(port, hostname, () => {
  console.log(`Server is running on port ${port}`);
});
