const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRoute");
require("dotenv").config();
const { MONGO_URL, PORT } = process.env;

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`@@INFO: SERVER IS RUNNING AT PORT ${PORT}`);
    });
    console.log("@@INFO: MONGODB CONNECTED");
  })
  .catch((err) => {
    console.log("@@ERROR: MONGODB CONNECTION FAILED");
    console.log(`@@ERROR: ${err.message}`);
  });
