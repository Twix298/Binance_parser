const https = require("https");
// const fs = require('fs');
let config = require('./config.json');
const telegram = require('./index.js');
let stops = undefined;
let starts = function start() {

    let price = {
        priceBuy: 0,
        priceSell: 0
    }
    let urlSell;
    let urlBuy;
    let lastPriceBuy = 0;
    const data = JSON.stringify({
        "page": 1,
        "rows": 1,
        "payTypes": config.Data.payTypes,
        "countries": [],
        "publisherType": null,
        "transAmount": config.Data.transAmount,
        "fiat": "RUB",
        "tradeType": "BUY",
        "asset": "USDT",
        "merchantCheck": false
    });

    const sell = JSON.stringify({
        "page": 1,
        "rows": 1,
        "payTypes": config.Data.payTypes,
        "countries": [],
        "publisherType": null,
        "transAmount": config.Data.transAmount,
        "asset": "USDT",
        "fiat": "RUB",
        "tradeType": "SELL"
    });

    const option1 = {
        hostname: 'p2p.binance.com',
        port: 443,
        path: '/bapi/c2c/v2/friendly/c2c/adv/search',
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': sell.length,
        },
    };

    const option = {
        hostname: 'p2p.binance.com',
        port: 443,
        path: '/bapi/c2c/v2/friendly/c2c/adv/search',
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
        },
    };
    var lastDiff = 0;

    let interval = setInterval(() => {
        // console.log("start")
        let output = '';
        let outputSell = '';
        const req = https.request(option, res => {

            res.on('data', d => {
                output += d;
            });

            res.on('end', () => {
                let data = JSON.parse(output);
                price.priceBuy = parseFloat(data.data[0].adv.price);
                urlBuy = data.data[0].advertiser.userNo;
                // console.log("buy = " + data.data[0].adv.price);
                req.end();
            })
        });

        req.on('error', error => {
            console.error(error);
        });

        const reqSell = https.request(option1, res => {

            res.on('data', d => {
                outputSell += d;
            });

            res.on('end', () => {
                let data = JSON.parse(outputSell);
                price.priceSell = parseFloat(data.data[0].adv.price);
                urlSell = data.data[0].advertiser.userNo;
                // advNoSell = data.data[0].adv.advNo;
                // console.log("advNo = " + data.data[0].adv.advNo);
                reqSell.end();
            });
        });

        reqSell.on('error', error => {
            console.error(error);
        });
        req.write(data);
        reqSell.write(sell);

        Promise.all([req, reqSell]).then(values => {
            console.log("start");
            console.log("buy = " + price.priceBuy);
            console.log("sell = " + price.priceSell);
            console.log("last buy = " + lastPriceBuy);
            if (price.priceSell - price.priceBuy > Number(config.difference)) {
                let diff = (Math.trunc((Number(config.Data.transAmount) / price.priceBuy)) * price.priceSell) - Number(config.Data.transAmount);
                if (lastDiff !== diff) {
                    if(lastPriceBuy !== price.priceBuy) {
                        telegram.sendMessage(`BUY \n buy = ${price.priceBuy}, sell = ${price.priceSell} \n diff = ${diff}\n https://p2p.binance.com/en/advertiserDetail?advertiserNo=${urlBuy}`);
                    }
                    else {
                        telegram.sendMessage(`Sell \n buy = ${price.priceBuy}, sell = ${price.priceSell} \n diff = ${diff}\n https://p2p.binance.com/en/advertiserDetail?advertiserNo=${urlSell}`);

                    }
                    console.log("-----------buyy-----------");
                    console.log("diff = " + diff);
                    // let filediff = parseFloat(fs.readFileSync("output.txt", "utf8"));
                    // filediff += diff;
                    // fs.truncateSync("output.txt", 0);
                    // fs.writeFileSync("output.txt", Math.floor(filediff).toString());
                    lastDiff = diff;
                }

            }
            lastPriceBuy = price.priceBuy;
            console.log("finish");
        });

    }, 1000);

    stops = function stop() {
        clearInterval(interval)
    };


    module.exports.stop = stops;
};

module.exports.start = starts;
