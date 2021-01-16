const puppeteer = require("puppeteer");
const ytaud = require('express').Router()

async function ytAudio(URL) {

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://ytmp3.cc/en13/',{delay: 300} )
        
    await page.type('#input', `${URL}`, {delay: 300})
    await page.click('#submit');
    await page.waitForSelector('#submit');
    let getVideo = await page.$eval('body > div:nth-child(2) > div > div:nth-child(2) > a:nth-child(1)', (element) => {
        return element.getAttribute('href');
    });
    let titleInfo = await page.$eval('body > div:nth-child(2) > div > div:nth-child(1)', el => el.innerText);
    browser.close();
     return {
	    titleInfo,
	    getVideo
       }
    }

ytaud.get('/', async (req, res) => {
    var URL = req.query.URL;
    const gets = await ytAudio(URL);
    res.json(gets)
    
});

module.exports = ytaud;
