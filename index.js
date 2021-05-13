const fs = require('fs');
const puppeter = require('puppeteer');
const dowloader = require('image-downloader');
const url = 'https://nhadep.com.vn/sofa-da-phong-khach';
const path = './sofa-da-phong-khach';
async function saveImage(nameFile,urlLink) {
    try {
        if (!fs.existsSync(nameFile)) {
            fs.mkdirSync(nameFile);
        }
		dowloader.image({
			url: urlLink,
			dest: nameFile
		});
	} catch (e) {
		console.log(e);
	}
}
function saveObj(fileName,data)
{
    fs.writeFile(`${path}/${fileName}.json`, JSON.stringify(data), () => {
        console.log("generate data successfully");

    })
}


async function main() {
	const browser = await puppeter.launch({
		// devtools: true
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

	const link = await page.evaluate(() => {
		const items = Array.from(
			document.querySelectorAll('.page-pro div .item.delay')
		);
		const srcSetAttribute = items.map(item => {
			const gethref = item.querySelector('.img.over a').getAttribute('href');
			return 'https://nhadep.com.vn' + gethref;
		});

		return srcSetAttribute;
	});

    const data = await Promise.all(link.map(async ele=>{
        const nextpage = await browser.newPage();
        await nextpage.goto(ele, {
            waitUntil: 'load',
            timeout: 0
        });

        const nextLink = await nextpage.evaluate(() => {

            const items = Array.from(
                document.querySelectorAll('.owl-item .item a img')
            );

            const srcSetAttribute = items.map(item => {
                const gethref = item.getAttribute('src');
                
                return 'https://nhadep.com.vn' + gethref;
            });
    
            return srcSetAttribute;
        });

        const nextData = await nextpage.evaluate(() => {
            const items = Array.from(
                document.querySelectorAll('div .list-detail')
            );
            const srcSetAttribute = items.map(item => {
                const title = item.querySelector('h1').innerText;
                const h2 =item.querySelectorAll('h2');
                const labelRed=item.querySelectorAll('label.red');
                const prameter= item.querySelectorAll('.prameter ul li')
                const des=document.querySelector("#Desc-sp").innerText
                return {
                    Name:title,
                    Code:h2[h2.length-1].innerText.split(':')[1],
                    Size:prameter[0].innerText,
                    Origin:prameter[1].innerText,
                    Meterial: prameter[2].innerText,
                    Quanlity: "",
                    Guarantee:prameter[3].innerText,
                    Price: labelRed.innerText,
                    Decription: des,
                    Image: [""],
                    isStatus: "ACTIVE",
                    Total:~~Math.random()*100,
                    FK_Room: "",
                    FK_Category: ""
    
                }
            });
    
            return srcSetAttribute;
        });



        return {
            nextLink,nextData
        }
    }))
	await browser.close();
    const res=await Promise.all(data.map(async (current,index)=>{
        const fileName=current.nextData[0].Name
        const img=current.nextLink
        if (img.length>0) {
            for (let i = 0; i <img.length; i++) {
                const link=img[i]
                if (link) {
                    await saveImage(`${path}/${fileName}`,link);
                }
            }
            const obj=current.nextData[0]
            return obj
        }
    }))
    saveObj("data",res)
    
}
main();
