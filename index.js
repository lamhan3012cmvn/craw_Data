const fs = require('fs');
const puppeteer = require('puppeteer');
const download = require('image-downloader');

const host='https://nhadep.com.vn/'
const url = `${host}thiet-ke-noi-that`;
const path = './TKNT_1'


async function saveImage(urlLink) {
    try {
        await download.image({
            url: urlLink,
            dest: path
        })
    } catch (e) {
        console.log(e)
    }
}

const DownloadList =async (imageSrcSets)=>
{
    try{
        for (let i = 0; i < imageSrcSets.length; i++) {
            if (imageSrcSets[i]) {
                let k = imageSrcSets[i];
                await saveImage(k);
            }

        }
    }catch(e){
        console.log("DownloadList",e)
    }
}


async function main() {

    const browser = await puppeteer.launch({
        // devtools: true
    }); //
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'load',
        timeout: 0
    });

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }


    
    const imageSrcSets = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        const srcSetAttribute = imgs.map(i => 'https://nhadep.com.vn/' + i.getAttribute('src'));
 
        return srcSetAttribute;
    })
    await browser.close();
    await DownloadList(imageSrcSets)
}
main();
