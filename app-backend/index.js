const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection for User Authentication and Other Shared Data
mongoose
  .connect("mongodb+srv://ceo:1auvXOBAaapyFFho@cluster0.cnucw.mongodb.net/IQRA_DRIVING", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected for userAuthDB"))
  .catch((err) => console.log(err));

// Routes for shared resources (instructors, authentication, etc.)
app.use("/api/auth", require("./routes/auth")); // Authentication routes
app.use("/api/instructors", require("./routes/instructor")); // Instructor routes
app.use("/api/cars", require("./routes/car")); // Instructor routes
app.use("/api/admissions", require("./routes/admission")); // General admission routes, if applicable
app.use("/api/attendance", require("./routes/attendance")); // Attendance routes
app.use("/api/alerts", require("./routes/alerts"));
app.get('/', async(req,res)=>{
  res.json("Hello DB");
  });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
