const express = require("express");
const app = express();
const connectDb = require("./config/db.config");
const routes = require("./v1/routes/routes");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

connectDb();
app.use("/v1", routes);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
