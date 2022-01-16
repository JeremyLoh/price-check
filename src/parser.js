import { BOOK_DEPOSITORY_WEBSITE, LAZADA_SG_WEBSITE } from "./constant.js"

const PARSER = new Map([
    [
        BOOK_DEPOSITORY_WEBSITE,
        {
            price: (price) => price.split(/\s+/)[0],
            productPageUrl: (productPageUrl, productPageUrlPrepend) => `${productPageUrlPrepend}${productPageUrl}`,
            title: (title) => title
        }
    ],
    [
        LAZADA_SG_WEBSITE,
        {
            price: (price) => price,
            productPageUrl: (productPageUrl, productPageUrlPrepend) => `${productPageUrlPrepend}${productPageUrl}`,
            title: (title) => title
        }
    ]
])

export function getWebsiteParser(website) {
    return PARSER.get(website)
}