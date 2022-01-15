// TODO
// Run puppeteer for website
// Generate links for product page, purchase price etc.
import {getSearchTerm, getSearchWebsite, isContinue} from "./prompt.js"
import {search} from "./search.js"

async function run() {
    if (!await isContinue()) {
        return
    }
    const websites = await getSearchWebsite()
    const searchTerm = await getSearchTerm()
    search(websites, searchTerm)
}

run()