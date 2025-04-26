require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  })
  .then(async () => {
    console.log("MongoDB connected for userAuthDB");
  })
  .catch((err) => console.log(err));
  const User = require("./models/User");
const Branch = require("./models/Branch");
// Function to create a user using an existing branch




 
  
app.use(cors());
app.use(express.json());
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/branch", require("./routes/branchRoute"));
app.use("/api/instructors", require("./routes/instructorRoute"));
app.use("/api/vehicle", require("./routes/vehicleRoute"));
app.use("/api/admissions", require("./routes/admission"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/alerts", require("./routes/alerts"));
app.use("/api/courses/", require("./routes/courseRoute"));
app.use("/api/notifications/", require("./routes/notificationRoute"));
app.get("/", async (req, res) => {
  res.json("Hello DB");
});
const PORT = process.env.PORT || 5011;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
