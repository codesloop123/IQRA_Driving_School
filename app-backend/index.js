const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
mongoose
  .connect(
    "mongodb+srv://ceo:1auvXOBAaapyFFho@cluster0.cnucw.mongodb.net/IQRA_DRIVING",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    }
  )
  .then(() => console.log("MongoDB connected for userAuthDB"))
  .catch((err) => console.log(err));

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
app.get("/", async (req, res) => {
  res.json("Hello DB");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
