var express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");
var mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://othon:bruck@cluster0.trgac.mongodb.net/podlib?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);
const scrollPageToBottom = require("puppeteer-autoscroll-down");
const Podcast = require("../model/podcast");

buscarPodcast = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(
        `https://www.podbean.com/site/search/podcasts/v/${query}`
      );
      await scrollPageToBottom(page, 250, 350);
      let urls = await page.evaluate(() => {
        let results = [];
        let items = document.querySelectorAll("a.pic");

        items.forEach((item) => {
          if (
            item
              .getAttribute("href")
              .includes("https://www.podbean.com/podcast-detail/")
          ) {
            results.push({
              title: item.getAttribute("title"),
              text: item.getAttribute("href"),
              img: item.querySelector("img").getAttribute("src"),
            });
          }
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

createPodcast = (link) => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(
        `https://www.podbean.com/podcast-detail/w739y-2835f/NerdCast-Podcast`
      );
      let urls = await page.evaluate(() => {
        let results = {
          title: document.querySelector("h1.tit").innerHTML,
          description: document
            .querySelector("div.user-description")
            .querySelector("p").innerHTML,
          link: document.URL,
          episodes: [],
        };
        let episodes = [];
        let epi = document.querySelectorAll("tr");
        epi.forEach((item) => {
          episodes.push({
            title: item.querySelector("a.title").getAttribute("title"),
            date: item.querySelector("span.datetime").innerHTML,
            ratings: 0,
            link: "red",
          });
        });
        results = { ...results, episodes: episodes };
        return results;
      });
      browser.close();
      return resolve(urls);
    } catch (e) {
      return reject(e);
    }
  });
};

router.get("/searchpodcast", async (req, res) => {
  let resultado = await buscarPodcast(req.query.search);
  return res.json(resultado);
});

router.get("/podcast", (req, res) => {
  Podcast.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

router.post("/podcast", async (req, res) => {
  let resultado = await createPodcast(req.query.link);

  let newPodcast = new Podcast({
    title: resultado.title,
    description: resultado.description,
    link: resultado.link,
    episodes: resultado.episodes,
  });
  newPodcast
    .save()
    .then(() => {
      res.json("foi");
    })
    .catch((err) => {
      res.json(err);
    });
});

router.put("/podcast/:index/:id", (req, res) => {
  Podcast.findOne({ _id: req.params.index }).then((a) => {
    let newepisodes = a.episodes.map((epi, id) => {
      return id === Number(req.params.id)
        ? {
            _id: epi._id,
            title: epi.title,
            date: epi.date,
            ratings: req.query.ratings,
            link: epi.link,
          }
        : epi;
    });
    let newPodcast = {
      _id: a._id,
      title: a.title,
      description: a.description,
      link: a.link,
      episodes: newepisodes,
    };
    Podcast.findOneAndUpdate({ _id: req.params.index }, newPodcast, {
      runValidators: true,
      context: "query",
    })
      .then(() => {
        res.json("foi");
      })
      .catch((err) => {
        res.json(err);
      });
  });
});

router.delete("/podcast/:index", (req, res) => {
  Podcast.findByIdAndRemove(req.params.index)
    .then((result) => {
      res.json("foi");
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
