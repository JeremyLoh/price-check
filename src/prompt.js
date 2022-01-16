import prompts from "prompts"
import { BOOK_DEPOSITORY_WEBSITE } from "./constant.js"
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
            { title: "Book Depository", value: BOOK_DEPOSITORY_WEBSITE },
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
    return response.term.trim() || ""
}

export async function getTorProxy() {
    const questions = [
        {
            type: "confirm",
            name: "isUsingTor",
            message: "Are you using a Tor proxy?"
        },
        {
            type: (isUsingTor) => Boolean(isUsingTor) ? "number" : null,
            name: "torPort",
            message: "What is the Tor Sock Port?",
            initial: 9050,
            validate: (value) => value > 1023 && value < 65535 ? true 
                : "Please enter a valid port range (1024 to 65535)",
        }
    ]
    return await prompts(questions)
}