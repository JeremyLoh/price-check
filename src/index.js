import Papa from "papaparse"
import fs from "fs"
import {
    getOutputFileName,
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
    const fileName = await getOutputFileName()
    saveProducts(foundProducts, fileName)
    console.log(`Saved results to ${process.cwd()}/output/${fileName}`)
}

function saveProducts(products, fileName) {
    const csv = Papa.unparse(products)
    const filePath = `./output/${fileName}.csv`
    if (!fs.existsSync("./output")) {
        fs.mkdirSync("./output", { recursive: true })
    }
    fs.writeFileSync(filePath, csv)
}

run()