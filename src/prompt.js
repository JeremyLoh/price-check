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