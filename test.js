const axios = require("axios");

const main = async () => {
    let resp = await axios.post("https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search", {
        "asset": "USDT",
        "fiat": "RUB",
        "merchantCheck": false,
        "page": 1,
        "payTypes": ["TinkoffNew"],
        // "payTypes": [],
        "publisherType": null,
        "rows": 3,
        "tradeType": "BUY",
        "transAmount":  "0"
    })
    let data = resp.data
    let mainPrice = resp.data.data[0].adv.price
    let stroka = `Bid: Price: ${mainPrice}(${resp.data.data[0].adv.surplusAmount})
    Price: ${resp.data.data[1].adv.price}(${resp.data.data[1].adv.surplusAmount})
    Price: ${resp.data.data[2].adv.price}(${resp.data.data[2].adv.surplusAmount})`
    console.log(stroka)
}


main()

// console.log(main)