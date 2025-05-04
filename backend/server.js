const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const letterRoutes = require("./routes/letterRoutes");

const app = express();
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use("/api/letters", letterRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
