const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Snowflake } = require("@theinternetfolks/snowflake");

const userSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: Snowflake.generate().toString(),
  },
  name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});
module.exports = mongoose.model("User", userSchema);
