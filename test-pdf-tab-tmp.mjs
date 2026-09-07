import puppeteer from "puppeteer";
const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1440, height: 1300 } });
const page = await browser.newPage();
await page.goto("http://localhost:3000/portfolio.html", { waitUntil: "networkidle0" });

// Open Oakland Local row
await page.evaluate(() => document.querySelectorAll(".accordion-trigger")[1].click());
await new Promise(r => setTimeout(r, 300));

const before = (await browser.pages()).length;
console.log("Pages before click:", before);

const newPagePromise = new Promise(resolve => browser.once("targetcreated", async target => {
  const newPage = await target.page();
  resolve(newPage);
}));

await page.evaluate(() => {
  const link = [...document.querySelectorAll(".clip-list a")].find(a => a.href.includes(".pdf"));
  link.click();
});

const newPage = await newPagePromise;
await new Promise(r => setTimeout(r, 500));
const after = (await browser.pages()).length;
console.log("Pages after click:", after);
console.log("New tab URL:", newPage.url());

await browser.close();
