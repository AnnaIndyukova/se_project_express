const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;

const app = express();
app.use(express.json());
app.use(cors());

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

app.use("/", mainRouter);
