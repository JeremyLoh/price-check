import axios from "axios"

export async function getIpAddress() {
    const {status, data} = await axios.get("https://api.ipify.org")
    if (status === 200) {
        return data
    }
    throw new Error("Unable to obtain Ip Address")
}
