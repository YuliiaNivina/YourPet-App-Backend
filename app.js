const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/api/auth");
const petsRouter = require("./routes/api/pets");
const noticesRouter = require("./routes/api/notices");
const userPetsRouter = require("./routes/api/user_pets");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/pets", petsRouter);
app.use("/api/notices", noticesRouter);
app.use("/api/user_pets", userPetsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const {status = 500, message = "Server error"} = err;
  res.status(status).json({ message, })
})

module.exports = app;
