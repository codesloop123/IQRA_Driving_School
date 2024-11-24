const mongoose = require("mongoose");
const { BranchSchema } = require("./Branch");
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: Boolean, required: true },
  role: { type: String, required: true },
  branch: {
    type: BranchSchema,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
