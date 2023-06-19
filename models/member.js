const mongoose = require("mongoose");
const { Snowflake } = require("@theinternetfolks/snowflake");
const { Schema } = mongoose;

const memberSchema = new Schema({
  _id: { type: String, unique: true, default: Snowflake.generate().toString() },
  community: { type: String, ref: "Community" },
  user: { type: String, ref: "User" },
  role: { type: String, ref: "Role" },
  createdAt: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Member", memberSchema);
