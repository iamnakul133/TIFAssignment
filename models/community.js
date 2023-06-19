const mongoose = require("mongoose");
const { Snowflake } = require("@theinternetfolks/snowflake");
const { Schema } = mongoose;

const communitySchema = new Schema(
  {
    _id: {
      type: String,
      unique: true,
      default: Snowflake.generate().toString(),
    },
    name: { type: String, unique: true },
    slug: { type: String, unique: true },
    owner: { type: String, refs: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Community", communitySchema);
