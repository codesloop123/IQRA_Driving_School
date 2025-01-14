const express = require("express");
const mongoose = require("mongoose");
const Instructor = require("./models/Instructor");
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
  .then(async () => {
    console.log("MongoDB connected for userAuthDB");
    // const Admission = mongoose.model("Admission");
    // await Admission.deleteMany({}); // Delete all documents in the "Admission" collection
    // console.log("All entries deleted from the Admission collection.");

    // await Instructor.updateOne(
    //   { name: "Ustad" }, // Find the instructor by name
    //   { $set: { bookedSlots: [] } } // Clear all booked slots
    // );
    // const instructor = await Instructor.findOne({ name: "Ustad" });
    // console.log(instructor.bookedSlots); // Should log an empty array
  })
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
app.use("/api/notifications/", require("./routes/notificationRoute"));
app.get("/", async (req, res) => {
  res.json("Hello DB");
});
const PORT = process.env.PORT || 5011;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
