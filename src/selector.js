import { BOOK_DEPOSITORY_WEBSITE } from "./constant.js"

const SELECTORS = new Map([
    [BOOK_DEPOSITORY_WEBSITE, {
        search: {
            textField: "input.text-input",
        },
        result: {
            containers: "div.book-item",
            price: ".price",
            productPageUrl: "div.book-item .title a",
            title: "div.book-item .title a"
        },
        productPageUrlPrepend: "https://www.bookdepository.com"
    }],
])

export function getWebsiteSelectors(website) {
    return SELECTORS.get(website)
}