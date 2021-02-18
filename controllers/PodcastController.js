const Podcast = require("../model/podcast");

createPodcast = (link) => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`${link}`);
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

module.exports = {
  async save(req, res) {
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
  },
  async getAll(req, res) {
    Podcast.find({})
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ success: false, msg: `Something went wrong. ${err}` });
      });
  },
  async delete(req, res) {
    Podcast.findByIdAndRemove(req.params.index)
      .then((result) => {
        res.json("foi");
      })
      .catch((err) => {
        res.json(err);
      });
  },
  async alterar(req, res) {
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
  },
};
