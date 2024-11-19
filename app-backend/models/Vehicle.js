const { BranchSchema } = require("./Branch");
const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  type: { type: String, required: true },
  branch: {
    type: BranchSchema,
    required: true,
  },
});

module.exports = mongoose.model("Vehicle", VehicleSchema);
