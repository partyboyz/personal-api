const ytaud = require('express').Router();
const puppeteer = require("puppeteer");

async function ytAudio(URL) {
    const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://www.y2mate.com/id/youtube-mp3/'); 

    await page.type('#txt-url', `${URL}`);
    await page.click('#btn-submit > span.glyphicon.glyphicon-arrow-right', {delay: 300});
    await page.waitForSelector('#process_mp3');
    await page.click('#process_mp3', {delay: 300});
    await page.waitForSelector('#result > div > div.col-xs-12.col-sm-5.col-md-4 > div > a > img');
    let getImg = await page.$eval('#result > div > div.col-xs-12.col-sm-5.col-md-4 > div > a > img', (image) => {
        return image.getAttribute('src');
    });
    await page.waitForSelector('#process-result > div > a');
    let getVideo = await page.$eval('#process-result > div > a', (element) => {
        return element.getAttribute('href');
    });
    let titleInfo = await page.$eval('#result > div > div.col-xs-12.col-sm-7.col-md-8 > div > b', el => el.innerText);
    //let sizeInfo = await page.$eval('#box-info > div > div.col-sm-9.col-xs-12 > div:nth-child(2) > label:nth-child(3)', size => size.innerText);
    let durasiInfo = await page.$eval('#result > div > div.col-xs-12.col-sm-7.col-md-8 > div > p', durasi => durasi.innerText);
    browser.close();
     return {titleInfo,durasiInfo,getVideo,getImg}
    }

    ytaud.get('/', async (req, res) => {
        var URL = req.query.URL;
        const gets = await ytAudio(URL);
        res.json(gets)
        
    });
