import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker"
import randomUseragent from "random-useragent"
import { createCursor } from "ghost-cursor"
import { getWebsiteSelectors } from "./selector.js"
import { getRandomRange } from "./util.js"
import { getWebsiteParser } from "./parser.js"

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
    const websiteParser = getWebsiteParser(website)
    const page = await getNewPage(browser)
    const cursor = createCursor(page)
    await page.goto(website, { waitUntil: 'networkidle2' })
    await page.waitForSelector(selectors.search.textField)
    await cursor.click(selectors.search.textField)

    await page.keyboard.type(searchTerm, { delay: getRandomRange(150, 200) })
    await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.keyboard.press("Enter", { delay: getRandomRange(0, 10) })
    ])
    
    await page.waitForSelector(selectors.result.containers)
    const productContainers = await page.$$(selectors.result.containers)
    const productFieldPromises = productContainers.map(async (element) => {
        const {
            price: priceSelector,
            productPageUrl: productPageSelector,
            title: titleSelector
        } = selectors.result
        return {
            price: await getProductPrice(element, priceSelector, websiteParser.price),
            productPageUrl: await getProductPageUrl(element, productPageSelector, websiteParser.productPageUrl,
                selectors.productPageUrlPrepend),
            title: await getProductTitle(element, titleSelector, websiteParser.title)
        }
    })
    const products = await Promise.all(productFieldPromises)
    // TODO remove log
    console.log(products)
    page.close()
    return products
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
    await page.setDefaultNavigationTimeout(0)
    await page.setUserAgent(randomUseragent.getRandom())
    return page
}

async function getProductPrice(element, selector, parser) {
    await element.waitForSelector(selector)
    const price = await element.$eval(selector, (el) => el.textContent.trim())
    return parser(price)
}

async function getProductPageUrl(element, selector, parser, productPageUrlPrepend) {
    await element.waitForSelector(selector)
    const productPageUrl = await element.$eval(selector, (el) => el.getAttribute("href"))
    return parser(productPageUrl, productPageUrlPrepend)
}

async function getProductTitle(element, selector, parser) {
    await element.waitForSelector(selector)
    const title = await element.$eval(selector, (el) => el.textContent.trim())
    return parser(title)
}
