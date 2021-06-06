// v1
const Discord = require('discord.js');
const puppeteer = require('puppeteer');
const {prefix, token} = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

let url;
let espnCardSelector = '.PageLayout__Main' //ESPN card selector
let oneEventInfo = '#event-banner > div.row > header > h1 > a' //ONE FC event info
let oneCardSelector = '.container-main > article:nth-child(1)' // one card selector
let gloryEventInfo = 'body > div.container.container-bg > div.row.card-module > div > div.row > div > a > strong'
let gloryCardSelector = 'body > div.container.container-bg > div.row.fightdetails.mt-2.hidden-lg-up'

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
    else if (message.content === `${prefix}glory`) {
        url = 'https://www.glorykickboxing.com/events'
        getGloryCard()
    }

        function getGloryCard() {
            (async () => {
                const browser = await puppeteer.launch({args:['--no-sandbox'], headless:true});
                console.log('browser launched...')
                const page = await browser.newPage();
                await page.setViewport({
                    width: 720,
                    height: 900,
                    deviceScaleFactor: 1.4
                  });
                await page.goto(url);
                await page.click(gloryEventInfo)
                await page.waitForTimeout(1000)

                // click show stats for each fight
                await page.evaluate(() => {
                    let showStats = document.getElementsByClassName('btn btn-block action-btn-gray btn-stats')
                    for (let element of showStats)
                    element.click();
                })
                await page.waitForTimeout(1000)
                const cardElement = await page.$(gloryCardSelector) //select cards css path
                await cardElement.screenshot({path: `./images/card.png`}); //card screenshot
                const attachment = new Discord.MessageAttachment(`./images/card.png`);
                message.channel.send(`${message.author}`, attachment);
                console.log(`card sent...`)
                await browser.close();
                console.log('browser closed...')
            })();
        }

        function getOneCard() { // ONE FC
            (async () => {
                let newsLister = '#action-banner-widget-3 > a.dismiss'
                const browser = await puppeteer.launch({args:['--no-sandbox'], headless:true});
                console.log('browser launched...')
                const page = await browser.newPage();
                await page.setViewport({
                    width: 730,
                    height: 900,
                    deviceScaleFactor: 1.4
                  });
                await page.goto(url);
                await page.waitForTimeout(1000)
                await page.click(newsLister)
                await page.click(oneEventInfo)
                await page.waitForTimeout(1000)
                
                // removes navbar element in the top
                await page.evaluate(() => {
                    const navBar = document.querySelector('.navbar')
                    navBar.remove() 
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
            const browser = await puppeteer.launch({args:['--no-sandbox'], headless:true});
            console.log('browser launched...')
            const page = await browser.newPage();
            await page.setViewport({
                width: 730,
                height: 900,
                deviceScaleFactor: 1.4
              });
            await page.goto(url);

            // removes ads element in the bottom
            await page.evaluate(() => {
                const ads = document.querySelector('.sponsored-content')
                ads.remove() 
              })
            const cardElement = await page.$(espnCardSelector) //select cards css path
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