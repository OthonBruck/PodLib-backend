var express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");

var mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://othon:bruck@cluster0.trgac.mongodb.net/podlib?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  app.use(cors());
  next();
});

app.use("", require("./routes/podcast"));

app.listen(2222, function () {
  console.log("listening on 2222");
});
