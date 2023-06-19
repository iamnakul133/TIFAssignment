const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Snowflake } = require("@theinternetfolks/snowflake");

const roleSchema = new Schema(
  {
    _id: {
      type: String,
      unique: true,
      default: Snowflake.generate().toString(),
    },
    name: { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
