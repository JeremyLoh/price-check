import prompts from "prompts"
import {getIpAddress} from "./util.js"

export async function isContinue() {
    try {
        const ip = await getIpAddress()
        const response = await prompts({
            type: "confirm",
            name: "isContinue",
            message: `Your IP Address is ${ip}.\nDo you wish to continue?`,
            initial: true
        })
        return response.isContinue
    } catch (error) {
        console.error(`Could not get Ip Address due to ${error.message}`)
        return false
    }
}

export async function getSearchWebsite() {
    const response = await prompts({
        type: "multiselect",
        min: 1,
        name: "websites",
        choices: [
            { title: "Book Depository", value: "https://www.bookdepository.com/" },
        ],
        message: "Select a website to search",
        hint: "- Space to select. Return to submit"
    })
    return response.websites
}

export async function getSearchTerm() {
    const response = await prompts({
        type: "text",
        name: "term",
        message: "What do you want to search for?",
        validate: (input) => input.trim().length === 0 ? `Enter a valid search query` : true 
    })
    return response.term.trim()
}
