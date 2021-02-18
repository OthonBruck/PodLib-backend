const puppeteer = require("puppeteer");
const scrollPageToBottom = require("puppeteer-autoscroll-down");

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

module.exports = {
  async search(req, res) {
    let resultado = await buscarPodcast(req.query.search);
    return res.json(resultado);
  },
};
