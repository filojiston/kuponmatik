const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto('https://www.nesine.com/iddaa?et=1&le=1&ocg=MS-2%2C5&gt=Pop%C3%BCler');
  await page.setViewport({
    width: 1200,
    height: 800
  });
  
  await autoScrool(page);

  let matches = await page.evaluate(() => {
    let elems = document.getElementsByClassName('odd-col event-list pre-event');
    let result = [];
    for (const elem of elems) {
      result.push(elem.innerText);
    }

    return result;
  });

  await browser.close();
  matches = matches.map(match => match.split('\n').filter(x => x !== '\t'));
  console.log(matches.length);

  let result = {};
  const PATH = './data.json';

  matches.forEach(match => {
    const name = match[1];
    const ms = match[2].split('\t');
    const alt_ust = match[3].split('\t');
    const handi = match[4].split('\t');
    const cifte = match[5].split('\t');
    const kg = match[6].split('\t');
    let data = {
      'ms1': ms[0],
      'ms0': ms[1],
      'ms2': ms[2],
      'alt': alt_ust[0],
      'ust': alt_ust[1],
      'h1': handi[1],
      'h0': handi[2],
      'h2': handi[3],
      'cifte1-0': cifte[0], 
      'cifte1-2': cifte[1],
      'cifte0-2': cifte[2],
      'kgvar': kg[0],
      'kgyok': kg[1]
    };

    result[name] = data;
  });

  try {
    fs.writeFileSync(PATH, JSON.stringify(result));
  } catch (err) {
    console.log(err);
  }
  
})();

async function autoScrool(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
      let totalHeight = 0;
      let distance = 100;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
  });
}