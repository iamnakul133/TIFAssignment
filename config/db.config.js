const mongoose = require("mongoose");
const dburl = "mongodb+srv://Admin:password12345@cluster0.ueok1qt.mongodb.net/";

const connectDb = async () => {
  try {
    await mongoose.connect(dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
  } catch (err) {
    console.log("Error Connecting to database", err);
  }
};
module.exports = connectDb;
