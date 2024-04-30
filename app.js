const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;

const app = express();
app.use(express.json());

app.listen(PORT, (error) => {
  if (error) {
    console.log(`Error: ${error}`);
  }
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connnected to DB");
  })
  .catch(console.error);

// temp authorization middleware
app.use((req, res, next) => {
  req.user = {
    _id: "662ecca31bb7d84522705025",
  };
  next();
});
app.use("/", mainRouter);
