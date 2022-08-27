const axios = require("axios");


const makeStringBid = (data, valueInput) => {
    console.log(data.data.length)
    console.log(data.total)
    let value = data.data.length < valueInput ? data.data.length : valueInput
    let mainPrice = data.data[0].adv.price
    let string = `\`Price: ${mainPrice}(${data.data[0].adv.surplusAmount})\n`
    for (let i = 1; i < value; i++) {
        string += `    Price: ${data.data[i].adv.price}(${data.data[i].adv.surplusAmount})\n`
    }
    return string
}
const getP2pUsdBuyPrice = async () => {
    let resp = await axios.post("https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search", {
        "asset": "USDT",
        "fiat": "RUB",
        "merchantCheck": false,
        "page": 1,
        "payTypes": ["TinkoffNew"],
        // "payTypes": [],
        "publisherType": null,
        "rows": 20, //1-20
        "tradeType": "BUY",
        "transAmount": "0"
    })

    let string = makeStringBid(resp.data, 3)
    let mainPrice = resp.data.data[0].adv.price
    return [mainPrice, string]

}
getP2pUsdBuyPrice()

// console.log(main)