const puppeteer = require("puppeteer");

function run() {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto("https://www.podbean.com/site/search/podcasts/v/knight");
      let urls = await page.evaluate(() => {
        let results = [];
        let items = document.querySelectorAll("a.pic");
        items.forEach((item) => {
          results.push({
            title: item.getAttribute("title"),
            text: item.getAttribute("href"),
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
}
run().then(console.log).catch(console.error);
