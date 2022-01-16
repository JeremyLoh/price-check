// TODO
// Generate links for product page, purchase price etc.
import {
    getSearchTerm,
    getSearchWebsite,
    getTorProxy,
    isContinue
} from "./prompt.js"
import {search} from "./search.js"

async function run() {
    if (!await isContinue()) {
        return
    }
    const {isUsingTor, torPort} = await getTorProxy()
    const websites = await getSearchWebsite()
    const searchTerm = await getSearchTerm()
    const browserArgs = isUsingTor ? [`--proxy-server=socks5://127.0.0.1:${torPort}`] : []
    const foundProducts = await search(websites, searchTerm, browserArgs)
    console.log("run --> foundProducts", foundProducts)
}

run()