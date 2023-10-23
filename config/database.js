/** @format */

const mongoose = require("mongoose");

const connnectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) =>
      console.log(`mongo db connected with ${data.connection.host}`.bgRed.white)
    )
    .catch((err) => console.log(err));
};

module.exports = connnectDatabase;
