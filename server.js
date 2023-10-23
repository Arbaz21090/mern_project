/** @format */

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const color = require("colors");
const cors = require("cors");
const path = require("path");
const connnectDatabase = require("./config/database");
const authRoute = require("./routes/authRoute");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

const port = process.env.PORT || 5000;
connnectDatabase();

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use(express.static(path.join(__dirname, "./client/build")));
// route
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
app.listen(process.env.PORT, () => {
  console.log(
    `server is running on ${process.env.DEV_MODE} mode on port ${port}`.bgYellow
      .red
  );
});
