const Discord = require('discord.js');
const puppeteer = require('puppeteer');
const {prefix, token} = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

let url;
let cardSelector = '.PageLayout__Main' //ESPN card selector
let fightInfo = 'a.btn:nth-child(2)' //ONE FC event info
let oneCardSelector = 'section.site-section:nth-child(3) > div:nth-child(1)' // one card selector

client.on('message', message => {
    if (message.content === `${prefix}ufc`) {
        url = 'https://www.espn.com/mma/fightcenter/_/league/ufc'
        getCard()
    }
    else if (message.content === `${prefix}bellator`) {
        url = 'https://www.espn.com/mma/fightcenter/_/league/bellator'
        getCard()
    }
    else if (message.content === `${prefix}pfl`) {
        url = 'https://www.espn.com/mma/fightcenter/_/league/pfl'
        getCard()
    }
    else if (message.content === `${prefix}one`) {
        url = 'https://www.onefc.com/events/'
        getOneCard()
    }

        function getOneCard(){ // ONE FC
            (async () => {
                const browser = await puppeteer.launch({headless:true});
                console.log('browser launched...')
                const page = await browser.newPage();
                await page.setViewport({
                    width: 730,
                    height: 900,
                    deviceScaleFactor: 1.4
                  });
                await page.goto(url);
                await page.waitForTimeout(1000)
                await page.click(fightInfo)
                await page.waitForTimeout(1000)
                await page.evaluate(() => {
                    const navBar = document.querySelector('.navbar')
                    navBar.remove() // removes navbar element in the top
                  })
                await page.waitForTimeout(1000)
                const cardElement = await page.$(oneCardSelector) //select cards css path
                await cardElement.screenshot({path: `./images/card.png`}); //card screenshot
                const attachment = new Discord.MessageAttachment(`./images/card.png`);
                message.channel.send(`${message.author}`, attachment);
                console.log(`card sent...`)
                await browser.close();
                console.log('browser closed...')
            })();
        }

        function getCard() { // UFC PFL BELLATOR
        (async () => {
            const browser = await puppeteer.launch({headless:true});
            console.log('browser launched...')
            const page = await browser.newPage();
            await page.setViewport({
                width: 730,
                height: 900,
                deviceScaleFactor: 1.4
              });
            await page.goto(url);
            await page.evaluate(() => {
                const ads = document.querySelector('.sponsored-content')
                ads.remove() // removes ads element in the bottom
              })
            const cardElement = await page.$(cardSelector) //select cards css path
            await cardElement.screenshot({path: `./images/card.png`}); //card screenshot
            const attachment = new Discord.MessageAttachment(`./images/card.png`);
            message.channel.send(`${message.author}`, attachment);
            console.log(`card sent...`)
            await browser.close();
            console.log('browser closed...')
        })();}
    }
);

client.login(token);