var express = require("express");
const app = express();
const puppeteer = require("puppeteer");
app.use(express.json());
var mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://othon:bruck@cluster0.trgac.mongodb.net/podlib?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const cors = require("cors");

run = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(
        `https://www.podbean.com/site/search/podcasts/v/${query}`
      );
      await page.waitForSelector("img.lazyloaded");
      let urls = await page.evaluate(() => {
        let results = [];
        let items = document.querySelectorAll("a.pic");
        items.forEach((item) => {
          results.push({
            title: item.getAttribute("title"),
            text: item.getAttribute("href"),
            img: item.querySelector("img").getAttribute("src"),
          });
        });
        return results;
      });
      browser.close();
      return resolve(urls);
    } catch (e) {
      return reject(e);
    }
  });
};

app.use((req, res, next) => {
  //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
  res.header("Access-Control-Allow-Origin", "*");
  //Quais são os métodos que a conexão pode realizar na API
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  app.use(cors());
  next();
});

app.get("/geeks", async (req, res) => {
  let resultado = await run(req.query.search);
  return res.json(resultado);
});

app.get("/geeks/:index", (req, res) => {
  return res.json(req.user);
});

app.post("/geeks", (req, res) => {
  const name = req.body;
  geeks.push(name);

  return res.json();
});

app.put("/geeks/:index", (req, res) => {
  const { index } = req.params;
  const name = req.body;

  geeks[index] = name;

  return res.json();
});

app.delete("/geeks/:index", (req, res) => {
  const { index } = req.params;

  geeks.splice(index, 1);

  return res.json();
});

app.listen(2222, function () {
  console.log("listening on 2222");
});
