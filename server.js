var express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");

app.use((req, res, next) => {
  //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
  res.header("Access-Control-Allow-Origin", "*");
  //Quais são os métodos que a conexão pode realizar na API
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  app.use(cors());
  next();
});

app.use("", require("./routes/podcast"));

app.listen(2222, function () {
  console.log("listening on 2222");
});
