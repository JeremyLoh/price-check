import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker"
import randomUseragent from "random-useragent"
import { createCursor } from "ghost-cursor"
import { getWebsiteSelectors } from "./selector.js"
import { getRandomRange } from "./util.js"

puppeteer.use(StealthPlugin())
puppeteer.use(AdblockerPlugin())

export async function search(websites, searchTerm, browserArgs = []) {
    const browser = await getBrowser(browserArgs)
    for (const website of websites) {
        const products = await searchProducts(browser, website, searchTerm)
    }
    // await browser.close()
}

export async function searchProducts(browser, website, searchTerm) {
    const selectors = getWebsiteSelectors(website)
    const page = await getNewPage(browser)
    const cursor = createCursor(page)
    await page.goto(website, { waitUntil: 'networkidle2' })
    await page.waitForSelector(selectors.search.textField)
    await cursor.click(selectors.search.textField)

    await page.keyboard.type(searchTerm, { delay: getRandomRange(150, 200) })
    await page.keyboard.press("Enter", { delay: getRandomRange(0, 10) })
    
    await page.waitForSelector(selectors.result.containers)
    const productContainers = await page.$$(selectors.result.containers)
    const productFieldPromises = productContainers.map(async (element) => {
        const allSelectors = Object.values(selectors.result).join(",")
        await element.waitForSelector(allSelectors)
        return {
            price: await element.$eval(selectors.result.price, (el) => el.innerText),
            url: await element.$eval(selectors.result.productPageUrl, (el) => el.getAttribute("href")),
            title: await element.$eval(selectors.result.title, (el) => el.innerText)
        }
    })
    const products = await Promise.all(productFieldPromises)
    
    console.log(products)
    // page.close()
    // return products
}

export async function getBrowser(browserArgs) {
    const browser = await puppeteer.launch({
        headless: false,
        args: ["--start-maximized", ...browserArgs]
    })
    return browser
}

async function getNewPage(browser) {
    const page = await browser.newPage()
    await page.setUserAgent(randomUseragent.getRandom())
    return page
}
