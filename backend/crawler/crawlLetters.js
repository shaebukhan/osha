const { PlaywrightCrawler } = require("crawlee");
const cheerio = require("cheerio");
const Letter = require("../models/Letter");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const startCrawler = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("✅ Connected to DB for crawling");

  const crawler = new PlaywrightCrawler({
    async requestHandler({ request, page, enqueueLinks, log }) {
      const url = request.url;
      console.log("🧭 Visiting:", url);

      if (url.includes("standardinterpretations/publicationdate")) {
        console.log("🔗 Enqueuing detail links...");
        await enqueueLinks({ selector: ".view-content a", label: "DETAIL" });
      } else {
        const html = await page.content();
        const $ = cheerio.load(html);
        const title = $("h1").text().trim();
        const date = $("time").first().text().trim();
        const content = $(".field--name-body").text().trim();

        console.log("📝 Extracted:");
        console.log("Title:", title);
        console.log("Date:", date);
        console.log("Content snippet:", content.substring(0, 100) + "...");

        const existing = await Letter.findOne({ url });
        if (existing) {
          console.log("⚠️ Already exists, skipping:", url);
        } else {
          await Letter.create({ title, date, content, url });
          console.log("✅ Saved:", title);
        }
      }
    },
  });

  await crawler.run([
    "https://www.osha.gov/laws-regs/standardinterpretations/publicationdate",
  ]);

  console.log("✅ Crawling finished. Disconnecting DB.");
  await mongoose.disconnect();
};

startCrawler();
