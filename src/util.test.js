import axios from "axios"
import {getIpAddress} from "./util"

jest.mock("axios")

describe("#getIpAddress", () => {
    it("Retrieves Ip Address from API", async () => {
        const expectedIpAddress = "19.117.63.126"
        axios.get.mockResolvedValueOnce({status: 200, data: expectedIpAddress})
        const result = await getIpAddress()
        expect(result).toBe(expectedIpAddress)
    })

    it("Return error when Ip Address cannot be retrieved", async () => {
        axios.get.mockResolvedValueOnce({status: 404, data: undefined})
        await expect(async () => await getIpAddress()).rejects.toThrow()
    })
})