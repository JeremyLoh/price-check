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
    let foundProducts = []
    for await (const website of websites) {
        const products = (await searchProducts(browser, website, searchTerm))
            .filter((product) => product.price !== "unavailable")
        foundProducts = foundProducts.concat(products)
    }
    // await browser.close()
    return foundProducts
}

export async function searchProducts(browser, website, searchTerm) {
    const selectors = getWebsiteSelectors(website)
    const websiteParser = getWebsiteParser(website)
    const page = await getNewPage(browser)
    await page.goto(website, { waitUntil: 'networkidle2' })
    await enterSearchTerm(page, selectors, searchTerm)
    await page.waitForSelector(selectors.result.containers)
    const productContainers = await page.$$(selectors.result.containers)
    const productFieldPromises = productContainers.map(async (element) => 
        await getParsedProductFields(element, selectors, websiteParser))
    const products = await Promise.all(productFieldPromises)
    console.log("products", products)
    // page.close()
    return products
}

async function enterSearchTerm(page, selectors, searchTerm) {
    const cursor = createCursor(page)
    await page.waitForSelector(selectors.search.textField)
    await cursor.click(selectors.search.textField)
    await page.keyboard.type(searchTerm, { delay: getRandomRange(150, 200) })
    await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.keyboard.press("Enter", { delay: getRandomRange(0, 10) })
    ])
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

async function getParsedProductFields(element, selectors, websiteParser) {
    const {
        price: priceSelector,
        productPageUrl: productPageSelector,
        title: titleSelector
    } = selectors.result
    return {
        title: websiteParser.title(await getProductTitle(element, titleSelector)),
        price: websiteParser.price(await getProductPrice(element, priceSelector)),
        productPageUrl: websiteParser.productPageUrl(
            await getProductPageUrl(element, productPageSelector),
            selectors.productPageUrlPrepend
        )
    }
}

async function getProductPrice(element, selector) {
    await element.waitForSelector(selector)
    return await element.$eval(selector, (el) => el.textContent.trim())
}

async function getProductPageUrl(element, selector) {
    await element.waitForSelector(selector)
    return await element.$eval(selector, (el) => el.getAttribute("href"))
}

async function getProductTitle(element, selector) {
    await element.waitForSelector(selector)
    return await element.$eval(selector, (el) => el.textContent.trim())
}
