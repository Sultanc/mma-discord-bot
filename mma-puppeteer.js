const Discord = require('discord.js');
const puppeteer = require('puppeteer');
const {prefix, token} = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

let url;
//css path  
const cookie = '#onetrust-accept-btn-handler'//cookie css
const cardSelector = 'html body div#espnfitt div#DataWrapper div#fitt-analytics div.bp-mobileTablet.bp-tablet.bp-mobileMDPlus.bp-mobileLGPlus.bp-tabletPlus.no-touch div#fittPageContainer div div.PageLayout.page-container.cf.PageLayout--tablet.PageLayout--93'

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

        function getCard() {
        (async () => {
            const browser = await puppeteer.launch();
            console.log('browser launched')
            const page = await browser.newPage();
            await page.goto(url);
            await Promise.all([
                await page.waitForSelector(cookie),
                await page.click(cookie) //accept cookie
              ]);
            console.log('cookie accepted') 
            await page.waitForTimeout(3000) //3 sec wait
            const cardElement = await page.$(cardSelector) //select css path
            await cardElement.screenshot({path: `./images/card.png`}); //card screenshot
            const attachment = new Discord.MessageAttachment(`./images/card.png`);
            message.channel.send(`${message.author}`, attachment);
            console.log(`card sent`)
            await browser.close();
            console.log('browser closed')
        })();}
    }
);

client.login(token);
