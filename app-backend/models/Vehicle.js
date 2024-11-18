const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: Number, required: true },
  AutoMan: { type: String, required: true },
  branch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
});

module.exports = mongoose.model("Vehicle", VehicleSchema);
