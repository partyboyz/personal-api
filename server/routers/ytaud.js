const ytaud = require('express').Router()
const puppeteer = require("puppeteer");

async function ytAudio(URL) {

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://ytmp3.cc/en13/');
        
    await page.type('body > #content > #converter_wrapper > #converter > form > input:nth-child(1)', `${URL}`);
    await page.click('body > #content > #converter_wrapper > #converter > form > #submit',  {delay: 300});
    await page.waitForSelector('body > #content > #converter_wrapper > #converter > form > #submit');
    let getVideo = await page.$eval('body > #content > #converter_wrapper > #converter > #buttons > a:nth-child(1)', (element) => {
        return element.getAttribute('href');
    });
    let titleInfo = await page.$eval('body > #content > #converter_wrapper > #converter > #title', el => el.innerText);
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
