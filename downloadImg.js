const fs = require('fs');
const puppeter = require('puppeteer');
const dowloader = require('image-downloader');
const url = 'https://bloggame.net/bo-hinh-nen-pubg-4k-dep-nhat-sieu-sac-net-b89.html';
const path = './songoku'
const loginPage = {
    email: 'input[id="email"]',
    pass: 'input[id="pass"]',
    btn: 'button[class="sqdOP yWX7d    y3zKF     "]',
    btn2: 'button[id="loginbutton"]'
}

async function saveImage(urlLink) {
    try {
        dowloader.image({
            url: urlLink,
            dest: path
        })
    } catch (e) {
        console.log(e)
    }
}


async function main() {
    const browser = await puppeter.launch({
        //devtools: true
    }); //
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'load',
        timeout: 0
    });
    // await page.waitFor(loginPage.btn);
    // await page.click(loginPage.btn);
    // await page.waitFor(loginPage.email);
    // await page.type(loginPage.email, 'lamhoangan3012@yahoo.com.vn');
    // await page.type(loginPage.pass, 'lamhoangan123cmvn');
    // await page.click(loginPage.btn2);
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }


    await setTimeout(async() => {
        const imageSrcSets = await page.evaluate(() => {
            const imgs = Array.from(document.querySelectorAll('p img'));
            const srcSetAttribute = imgs.map(i => 'https://bloggame.net/' + i.getAttribute('src'));
            return srcSetAttribute;
        })
        await browser.close();
        for (let i = 0; i < imageSrcSets.length; i++) {
            if (imageSrcSets[i]) {
                let k = imageSrcSets[i];
                await saveImage(k);
            }

        }
    }, 20000);


}
main();