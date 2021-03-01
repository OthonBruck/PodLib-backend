const puppeteer = require("puppeteer");
const scrollPageToBottom = require("puppeteer-autoscroll-down");

buscarPodcast = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(`https://www.podbean.com/site/search/index`, {
        waitUntil: "networkidle2",
      });

      await page.waitForSelector("input.search-query");

      await page.$eval(
        "input.search-query",
        (el, query) => (el.value = query),
        query
      );
      await page.click("button.visible-phone.head-search");
      await (await page.$("input.search-query")).press("Enter");
      await page.waitForSelector("img.lazyloaded");
      await page.click('button[type="submit"]');
      const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await Promise.race([await timeout(900)]);
      const [tabOne, tabTwo, tabThree] = await browser.pages();
      await scrollPageToBottom(tabThree, 250, 350);
      let urls = await tabThree.evaluate(() => {
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
              // followers: item.querySelector("div.info-block").innerHTML,
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
