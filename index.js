const TelegramApi = require("node-telegram-bot-api")
const axios = require("axios");

const token = "5681973392:AAEjBzLGIYx4lZgm-Kop3qAwCzuqZ49cMrM"

const AccountsId = {
    Ainur: 623361536,
    Arseniy: 5668343908
}

// function getValueReg(string, currency) {
//     // if currency == true -> TON
//     // else RUB
//     try {
//         let reg = currency ? /Покупка: (?<value>.*?) TON/g : / за (?<value>.*?) RUB/g
//         let {groups: {value}} = reg.exec(string)
//         return parseFloat(value.replace("'", ""))
//     } catch (err) {
//         console.error(err)
//     }
// }

function getValueRegForSeleniumBot(string, currency) {
    //Sorry for this worst solution...
    // if currency == true -> TON
    // else RUB
    try {
        let reg = currency ? /Покупка:<\/strong>&nbsp;(?<value>.*?) TON/g : /(\d) TON за (?<value>.*?) RUB/g
        let {groups: {value}} = reg.exec(string)
        return parseFloat(value.replace("'", ""))
    } catch (err) {
        console.error(err)
    }
}

function getValueReg(string, currency){
    try{
        let reg = currency ? /(((\d{1,10})\.(\d{1,15})))/g : /((\d{1,5})\'(\d{1,15}))/g
        let value = string.match(reg)[0]
        return parseFloat(value.replace("'", ""))
    }
    catch (e) {
        console.error(err)
    }
}




const getTime = () => {
    const time = new Date()
    const year = time.getFullYear()
    const month = String(time.getMonth() + 1).length === 1 ? `0${time.getMonth() + 1}` : time.getMonth() + 1
    const day = String(time.getDate() + 1).length === 1 ? `0${time.getDate() + 1}` : time.getDate() + 1
    const hours = String(time.getHours()).length === 1 ? `0${time.getHours()}` : time.getHours()
    const mins = String(time.getMinutes()).length === 1 ? `0${time.getMinutes()}` : time.getMinutes()
    const secs = String(time.getSeconds()).length === 1 ? `0${time.getSeconds()}` : time.getSeconds()
    return `${year}.${month}.${day} ${hours}:${mins}:${secs}`
}

const makeStringBid = (data, valueInput) => {
    let value = data.data.length < valueInput ? data.data.length : valueInput
    let mainPrice = data.data[0].adv.price
    let string = `Price: ${mainPrice}₽ (${data.data[0].adv.surplusAmount}$)`
    for (let i = 1; i < value; i++) {
        string += `\n        Price: ${data.data[i].adv.price}₽ (${data.data[i].adv.surplusAmount}$)`
    }
    string += `\n        ...see more ${data.total - value}`
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

    let string = makeStringBid(resp.data, 5)
    let mainPrice = resp.data.data[0].adv.price
    return [mainPrice, string]

}

const getFtxTonPrice = async () => {
    let resp = await axios.get("https://ftx.com/api/wallet/coins")
    return resp.data.result.find(crypto => crypto.id === "TONCOIN").indexPrice
}

const getRightNum = (string) => {
    if (string.indexOf(",") !== -1) return parseFloat(string.replace(",", "."))
    if (string.indexOf(".") !== -1) return parseFloat(string)
    return parseInt(string)
}

const bot = new TelegramApi(token, {polling: true})

const StartBot = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        // {command: '/check', description: 'Получить информацию о spread`e'},
    ])


    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        // console.log("===========")
        // console.log(text)
        // console.log("===========")
        console.log(msg)
        // console.log("===========")
        // await bot.sendPhoto(chatId, "https://i.mycdn.me/i?r=AzEPZsRbOZEKgBhR0XGMT1Rk0-ec5W5QIM5QTbiCToKv_qaKTM5SRkZCeTgDn6uOyic")
        // return bot.sendMessage(chatId, "Бот временно не работает, вот вам поссума:)")
        if (text == '/start') {
            await bot.sendPhoto(chatId, "https://tlgrm.ru/_/stickers/985/bdc/985bdc40-fd5f-3b50-a5b3-80ddaad23565/15.jpg")
            return bot.sendMessage(chatId, "Добро пожаловать в чертоги бота! ")
        }
        if (text == '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }
        if (text == '/check') {
            return bot.sendMessage(chatId, "Введите количество покупки TONCOIN`a за 25k рублей")
        }
        if (text == '/secret') {
            await bot.sendPhoto(chatId, "https://7factov.ru/wp-content/uploads/2020/03/9717e5cf185c1e7dd55196a882903601.jpg")
            return bot.sendMessage(chatId, "АЙНУР БАЛБАЛЕЙ ДУРАЧОК БЕБЕБЕ")
        }
        if (text.indexOf('&nbsp;Купить криптовалюту:') !== -1) {

            const arrayP2pUsdBuyPrice = await getP2pUsdBuyPrice()
            const priceUSDT = arrayP2pUsdBuyPrice[0]
            const bid = arrayP2pUsdBuyPrice[1]
            const priceFtx = await getFtxTonPrice()
            const inputFtx = getValueReg(text, true)
            const inputRub = getValueReg(text, false)
            const gapValue = priceFtx * priceUSDT * inputFtx
            let tempString = String(gapValue/inputRub * 100)
            console.log(tempString.slice(0,-2))
            const Result = parseInt(gapValue) > inputRub ? `${parseInt(gapValue)} (+${(parseInt(gapValue)) - inputRub}₽) 💵[${parseFloat(String(gapValue/inputRub * 100).slice(2,-12))}% profit]💵` : `${parseInt(gapValue)} (${parseInt(gapValue) - inputRub}₽)`
            const currentDate = getTime()

            // if (gapValue > 25700) await bot.sendMessage(AccountsId.Ainur, `Result: ${Result}`)
            return bot.sendMessage(chatId, `Date: ${currentDate}\nInput volume FTX: ${inputFtx}\nInput volume RUB: ${inputRub}\nAsset: USDT\nFiat: RUB\nBank: Tinkoff\nPrice: ${priceUSDT}₽\nBid: ${bid}\nFtx price: ${priceFtx}$\nResult: ${Result}`)

        }

        // if (text.split(" ")[0] == '/check') {
        //     const arrayP2pUsdBuyPrice = await getP2pUsdBuyPrice()
        //     const priceUSDT = arrayP2pUsdBuyPrice[0]
        //     const bid = arrayP2pUsdBuyPrice[1]
        //     const priceFtx = await getFtxTonPrice()
        //     const inputVolume = getRightNum(text.split(" ")[1])
        //     const Result = parseInt(priceFtx * priceUSDT * inputVolume) > 25500 ? `${parseInt(priceFtx * priceUSDT * inputVolume)} (+${(parseInt(priceFtx * priceUSDT * inputVolume)) - 25500}) 💵💵💵` : `${parseInt(priceFtx * priceUSDT * inputVolume)} (${parseInt(priceFtx * priceUSDT * inputVolume) - 25500})`
        //     const currentDate = getTime()
        //     return bot.sendMessage(chatId, `Date: ${currentDate}\nInput volume: ${inputVolume}\nAsset: USDT\nFiat: RUB\nBank: Tinkoff\nPrice: ${priceUSDT}\nBid: ${bid}\nFtx price: ${priceFtx}\nResult: ${Result}`)
        // }
        if (text.indexOf("Купить криптовалюту") !== -1) {
            const arrayP2pUsdBuyPrice = await getP2pUsdBuyPrice()
            const priceUSDT = arrayP2pUsdBuyPrice[0]
            const bid = arrayP2pUsdBuyPrice[1]
            const priceFtx = await getFtxTonPrice()
            const inputFtx = getValueReg(text, true)
            const inputRub = getValueReg(text, false)
            const gapValue = priceFtx * priceUSDT * inputFtx
            let tempString = String(gapValue/inputRub * 100)
            console.log(tempString.slice(0,-2))
            const Result = parseInt(gapValue) > inputRub ? `${parseInt(gapValue)} (+${(parseInt(gapValue)) - inputRub}₽) 💵[${parseFloat(String(gapValue/inputRub * 100).slice(2,-12))}% profit]💵` : `${parseInt(gapValue)} (${parseInt(gapValue) - inputRub}₽)`
            const currentDate = getTime()

            // if (gapValue > 25700) await bot.sendMessage(AccountsId.Ainur, `Result: ${Result}`)
            return bot.sendMessage(chatId, `Date: ${currentDate}\nInput volume FTX: ${inputFtx}\nInput volume RUB: ${inputRub}\nAsset: USDT\nFiat: RUB\nBank: Tinkoff\nPrice: ${priceUSDT}₽\nBid: ${bid}\nFtx price: ${priceFtx}$\nResult: ${Result}`)
        }

        return bot.sendMessage(chatId, "Я тебя не понял...")
    })
}

try {
    StartBot()
} catch (e) {

}


