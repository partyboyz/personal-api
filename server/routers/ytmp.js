const ytmp = require('express').Router();
const puppeteer = require('puppeteer');

async function ytMp(URL) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://youtube-to-mp3.org/'); 

    await page.type('#input', `${URL}`);
    await page.click('#submit', {delay: 300});
    await page.waitForSelector('#response > div > div.y_thumb > img');
    let Img = await page.$eval('#response > div > div.y_thumb > img', (image) => {
        return image.getAttribute('src');
    });
    await page.waitForSelector('#tab_mp3 > tbody > tr:nth-child(1) > td:nth-child(3) > a');
    let Link = await page.$eval('#tab_mp3 > tbody > tr:nth-child(1) > td:nth-child(3) > a', (element) => {
        return element.getAttribute('href');
    });
    let Title = await page.$eval('#response > div > div.y_thumb > div.title', el => el.innerText);
    let FileS = await page.$eval('#tab_mp3 > tbody > tr:nth-child(1) > td:nth-child(2)', size => size.innerText);
    //let Upload = await page.$eval('#search-result > div > div > div > div > p:nth-child(2)', size => size.innerText);
    browser.close();
     return {Title,Link,Img,FileS}
    }
    ytmp.get('/', async (req, res) => {
        var URL = req.query.URL;
        const gets = await ytMp(URL);
        res.json(gets);
        
    });
    module.exports = ytmp;
