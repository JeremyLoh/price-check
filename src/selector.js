import { BOOK_DEPOSITORY_WEBSITE, LAZADA_SG_WEBSITE } from "./constant.js"

const SELECTORS = new Map([
    [
        BOOK_DEPOSITORY_WEBSITE,
        {
            search: {
                textField: "input.text-input",
            },
            result: {
                containers: "div.book-item",
                price: ".price-wrap",
                productPageUrl: ".title a",
                title: ".title a"
            },
            productPageUrlPrepend: "https://www.bookdepository.com"
        }
    ],
    [
        LAZADA_SG_WEBSITE,
        {
            search: {
                textField: "input[type='search']"
            },
            result: {
                containers: "div[data-tracking='product-card']",
                price: "div:nth-child(1) div span",
                productPageUrl: "a[title]",
                title: "a[title]",
            },
            productPageUrlPrepend: "https:"
        }
    ]
])

export function getWebsiteSelectors(website) {
    return SELECTORS.get(website)
}