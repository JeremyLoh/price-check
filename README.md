# price-check

Before launching the program, ensure that you are either connected to a VPN or have Tor running with an open SOCK port (default of 9050).

If you would like to use Tor, the format for the proxy is assumed to be `socks5://127.0.0.1:9050`. You can change the port number from `9050` to something else by following the program prompts. 

## Configuring Tor (to change Ip address) (Linux)

`sudo apt-get install tor`

The default Tor config uses a SOCKS port that has one circuit to an exit node (one ip address). To add multiple Ip addresses, we can open more ports to listen for SOCKS connections. 

To do this, we can add more `SockPort` options to the config file under `/etc/tor`

Open `/etc/tor/torrc` file and add the following lines

```
# Open 3 SOCKS ports, each providing a new Tor circuit.
SocksPort 9050
SocksPort 9052
SocksPort 9053
```

* The value of each `SockPort` is a number that is the port that Tor will listen for connections from SOCKS-speaking applicaitons, like browsers
* The ports provided need to be open and the port cannot be used by another process
* The initial port starts with `9050` (default SOCKS port for Tor client)
* We bypass value `9051` as this port is used by Tor to allow external applications connected to this port to control Tor processes.
* As a simple convention, to open more ports, we increment each value after `9051` by one.

To apply the new changes, we need to restart the Tor client

`sudo /etc/init.d/tor restart`

# References

- Public IP Address API - https://www.ipify.org/
- puppeteer-extra - https://www.npmjs.com/package/puppeteer-extra
- Anonymous Web Scraping with Node.js, Tor, Puppeteer and cheerio by
George Gkasdrogkas - https://levelup.gitconnected.com/anonymous-web-scrapping-with-node-js-tor-apify-and-cheerio-3b36ec6a45dc
- waitForSelector seems to follow the CSS selector list rules. So essentially you can select multiple CSS elements by just using a comma https://stackoverflow.com/a/64451797