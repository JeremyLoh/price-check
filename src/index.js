// Ask user if they want to continue scraping
// Ask for item to search for and website
// Run puppeteer for website
// Generate links for product page, purchase price etc.
import {isContinue} from "./prompt.js"

async function run() {
    if (!await isContinue()) {
        return
    }
}

run()