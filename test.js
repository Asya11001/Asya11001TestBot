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


let text = "\"./img-apple-64/1f4b3.png\">&nbsp;Купить криптовалюту: TON за RUB</strong><br><br><strong>Покупка:</strong>&nbsp;267.978298779 TON за 25'000 RUB<span class=\"MessageMeta\" dir=\"ltr\"><span class=\"message-time\">17:23</span></span>"
const inputFtx = getValueRegForSeleniumBot(text, true)
const inputRub = getValueRegForSeleniumBot(text, false)


console.log(getValueRegForSeleniumBot(text, true))
console.log(getValueRegForSeleniumBot(text, false))
console.log(getValueReg(text, true))
console.log(getValueReg(text, false))
console.log(text)
// console.log(inputRub)