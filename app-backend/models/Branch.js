const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    branchCode: { type: String, required: true },
  },
  {
    timestamps: true, 
    id: false,
  }
);

module.exports = mongoose.model("Branch", BranchSchema);
module.exports.BranchSchema = BranchSchema;
