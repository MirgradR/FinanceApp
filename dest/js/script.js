// Stocks

const API_KEY = 'c4q8am2ad3icc97rdfcg';
//let symbols = ['FB', 'AAPL', 'MS', 'JPM', 'JNJ', 'XOM', 'BAC', 'V', 'T', 'INTC', 'PFE', 'BA', 'KO', 'BABA', 'TSLA', 'NFLX', 'WMT', 'NKE', 'EA', 'MSFT']
let symbols = ['FB', 'AAPL', 'MS', 'AMZN']
let stocksArr = [];
let balance = {}
balance.started = 10000
balance.available = balance.started
balance.asset = 0
localStorage.setItem('balance', JSON.stringify(balance))


let myPortfolio = []//JSON.parse(localStorage.getItem('Portfolio'))
if (localStorage.Portfolio) {
    myPortfolio = JSON.parse(localStorage.getItem('Portfolio'))
}

const getPrice = (ticker) => {
    const url_price = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${API_KEY}`
    return url_price
}   
const getCompany = (ticker) => {
    const url_company_profile = `
    https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${API_KEY}` 
    return url_company_profile
}
const getData = (url1, url2) => {
    Promise.all([
        fetch(url1).then(resp => resp.json()),
        fetch(url2).then(resp => resp.json()),  
    ])
    .then(data => {
        createObject(data, symbols)
        localStorage.setItem('stocks', JSON.stringify(stocksArr))
    })
}

const updateGetData = () => {
    for (let i = 0; i < symbols.length; i++) {
        getData(getPrice(symbols[i]), getCompany(symbols[i]))
        
    } 
}
updateGetData()

const createElem = (tagName, className, text) => {
    const elem = document.createElement(tagName);
    elem.classList.add(className);
    if (text) {
        elem.textContent = text
    }
    return elem
}

const createObject = (data, ticker) => {
    let stockObj = {}
    stockObj.name = data[1].name
    stockObj.logo = data[1].logo
    stockObj.industry = data[1].finnhubIndustry
    stockObj.price = (Math.floor(data[0].c * 100) / 100)
    stocksArr.push(stockObj)
}

const createStocks = (arr) => {
    const stockPriceWidget = document.querySelector('.stockPrice-widget')
    const list = stockPriceWidget.querySelector('.widget_price-list')

    const card = createElem('div', 'widget_price-card');
    list.append(card)

    const cardDiv = createElem('div', 'widget_price-info');
    card.append(cardDiv)

    const cardImg = createElem('img', 'widget_price-img');
    cardImg.src = arr.logo 
    cardDiv.append(cardImg)
    
    const cardDivDiscript = createElem('div', 'widget_price-description');
    cardDiv.append(cardDivDiscript)

    const cardTitle = createElem('h3', 'widget_price-title', arr.name);
    cardDivDiscript.append(cardTitle)

    const cardInductry = createElem('p', 'widget_price-inductry', arr.industry);
    cardDivDiscript.append(cardInductry)
    
    const cardPrice = createElem('p', 'widget_price-price', arr.price + ' $');
    card.append(cardPrice)

    const btnAdd = createElem('button', 'widget_price-btn', 'Add to portfolio');
    cardDivDiscript.append(btnAdd)
}

let localStocks = JSON.parse(localStorage.getItem('stocks'))
const exportStocksFromArr = (arr, func) => {
    arr.forEach(stock => {
        func(stock) 
    })
}

exportStocksFromArr(localStocks, createStocks)

const addedStocks = () => {
    const btnAdd = document.querySelectorAll('.widget_price-btn')
    for (let add of btnAdd) {
        let stockElem = add.parentElement.firstChild;
        myPortfolio.forEach(stoc => {
            if (stockElem.innerText === stoc.name) { 
                add.style.backgroundColor = 'grey'
                add.textContent = 'The stock is added'
            }
        })
    }   
}
addedStocks()

const addToPortfolio = () => {
    const btnAdd = document.querySelectorAll('.widget_price-btn')
    for (let add of btnAdd) {
        add.addEventListener('click', function (e) {
            e.preventDefault()
            let stockElem = e.target.closest('.widget_price-description')
                .querySelector('.widget_price-title');
            localStocks.forEach(stoc => {
                if (stockElem.innerText === stoc.name) {
                    let obj = {}
                    obj.name = stoc.name
                    obj.logo = stoc.logo
                    obj.count = 1
                    
                    let count = 0;
                    for (let key of myPortfolio) {
                        if (key.name === obj.name) {
                            return count += 1
                        }
                    }
                    if (count >= 1) {
                        console.log(count)
                    } else {
                        myPortfolio.push(obj)
                        localStorage.setItem('Portfolio', JSON.stringify(myPortfolio))
                        
                        createPortfolioElem(obj)
                        delitePortfolioElem()
                        counterAmountStocks()
                        setBalancePortfolio()
                        addedStocks()
                    }
                   
                }      
            })    
        })
    }
}
addToPortfolio()

const getPricePortfolio = (name, arr) => {
    let resp;
    arr.forEach(stoc => { 
        if (name.name === stoc.name) {
            resp = stoc.price
            return resp 
        }
    })
    return resp
}

const createPortfolioElem = (arr) => {
    const stockMyPortfolioWidget = document.querySelector('.myPortfolio-widget')
    const list = stockMyPortfolioWidget.querySelector('.list-content__items')

    const card = createElem('li', 'content-items__stock');
    list.append(card)

    const logo = createElem('img', 'stock-img');
    logo.src = arr.logo
    card.append(logo) 

    const discription = createElem('div', 'stock-info');
    card.append(discription)
    const titleComp = createElem('h3', 'stock-info__name', arr.name);
    discription.append(titleComp)

    const sectionAmount = createElem('div', 'stock-number');
    card.append(sectionAmount)
    const amountNum = createElem('div', 'stock-number__amount');
    sectionAmount.append(amountNum)
    const priceStock = createElem('h3', 'stock-number__price', getPricePortfolio(arr, localStocks) + '$'); 
    amountNum.append(priceStock)
    const priceStockAll = createElem('h3', 'stock-number__price', (Math.floor(getPricePortfolio(arr, localStocks) * arr.count * 100) / 100) + '$'); 
    amountNum.append(priceStockAll)

    const sectionBtns = createElem('div', 'stock-number__count');
    sectionAmount.append(sectionBtns)
    const btnSell = createElem('button', 'btn-sell', 'Sell');
    sectionBtns.append(btnSell)
    const btnMinus = createElem('button', 'btn-minus');
    btnMinus.innerHTML = `&#8211;`
    sectionBtns.append(btnMinus)
    const count = createElem('p', 'stock-count', arr.count);
    sectionBtns.append(count)
    const btnPlus = createElem('button', 'btn-plus', '+');
    sectionBtns.append(btnPlus)

    if (myPortfolio.length == 0) {
        document.querySelector('.empty-list').style = 'display: block'
        console.log('Empty')
    } else {
        document.querySelector('.empty-list').style = 'display: none'
    }
}

if (localStorage.Portfolio) {
   exportStocksFromArr(myPortfolio, createPortfolioElem) 
} else {
    document.querySelector('.empty-list').style = 'display: block'
}


const delitePortfolioElem = () => {
    const btnSell = document.querySelectorAll('.btn-sell')
    for (let sell of btnSell) {
        sell.addEventListener('click', function(e) {
            e.preventDefault()
            let stockElem = e.target.closest('.content-items__stock')
                .querySelector('.stock-info__name');
            myPortfolio.findIndex(function(item, index) { 
                if (stockElem.innerText === item.name) { 
                    myPortfolio.splice(index, 1)
                    localStorage.setItem('Portfolio', JSON.stringify(myPortfolio))
                    addedStocks()
                    e.target.closest('.content-items__stock').remove()
                    setBalancePortfolio()
                    if (myPortfolio.length == 0) {
                        document.querySelector('.empty-list').style = 'display: block'
                    }
                } 
                
            }) 
             
        })
        

    }
}
delitePortfolioElem()

const counterAmountStocks = () => {
    const minusBtns = document.querySelectorAll('.btn-minus')
    for (let minus of minusBtns) {
        minus.addEventListener('click', function(e) {
            e.preventDefault()
            let stockPerPrice = e.target.closest('.content-items__stock')
                .querySelector('.stock-number__price');
            let stockAllPrice = e.target.closest('.content-items__stock')
                .querySelector('.stock-number__price:last-child');
            let stockCount = e.target.closest('.content-items__stock')
                .querySelector('.stock-count');
            let stockElem = e.target.closest('.content-items__stock')
                .querySelector('.stock-info__name');
            myPortfolio.forEach(stoc => {
                if (stockElem.innerText === stoc.name) {
                    if (stoc.count > 1) {
                        stoc.count --
                        +stockCount.textContent -- 
                        let perPrice = stockPerPrice.textContent.split('')
                        perPrice.length = perPrice.length - 1
                        stockAllPrice.textContent = (Math.floor(perPrice.join('') * stoc.count * 100) / 100) + '$' 
                        localStorage.setItem('Portfolio', JSON.stringify(myPortfolio))
                        setBalancePortfolio()
                    }
                }
            })
        })
    }
    const plusBtns = document.querySelectorAll('.btn-plus')
    for (let plus of plusBtns) {
        plus.addEventListener('click', function(e) {
            e.preventDefault()
            let stockPerPrice = e.target.closest('.content-items__stock')
                .querySelector('.stock-number__price');
            let stockAllPrice = e.target.closest('.content-items__stock')
                .querySelector('.stock-number__price:last-child');
            let stockCount = e.target.closest('.content-items__stock')
                .querySelector('.stock-count');
            let stockElem = e.target.closest('.content-items__stock')
                .querySelector('.stock-info__name');
            myPortfolio.forEach(stoc => {
                if (stockElem.innerText === stoc.name) {
                    if (stoc.count < 10 && getSumPricePortfolio() < JSON.parse(localStorage.getItem('balance')).started) {
                        stoc.count++
                        +stockCount.textContent ++
                        let perPrice = stockPerPrice.textContent.split('')
                        perPrice.length = perPrice.length - 1
                        stockAllPrice.textContent = (Math.floor(perPrice.join('') * stoc.count * 100) / 100) + '$'
                        localStorage.setItem('Portfolio', JSON.stringify(myPortfolio))
                        setBalancePortfolio()
                    }
                }
            })
        })
    }
}
counterAmountStocks()

const getSumPricePortfolio = () => {
    let sum = 0;
    const balanceAvailable = document.querySelector('.user-balance__count')
    myPortfolio.forEach(stoc => {
        sum += +getPricePortfolio(stoc, localStocks) * stoc.count 
        if( sum >= JSON.parse(localStorage.getItem('balance')).started) {
            balanceAvailable.style.color = 'red'
            alert('Your balance: ' + (Math.floor((JSON.parse(localStorage.getItem('balance')).started - sum) * 100) / 100) + '$')
        } else {
            balanceAvailable.style.color = 'black'
        }
    
    })
    return sum
}

const setBalancePortfolio = () => {
    const balanceAvailable = document.querySelector('.user-balance__count')
    const balanceAsset = document.querySelector('.user-balance__count:last-child')
    let localBalance = JSON.parse(localStorage.getItem('balance'))
    balanceAvailable.textContent = localBalance.available + '$'

    
    if (myPortfolio.length === 0) {
        localBalance.available = localBalance.started
        balanceAvailable.textContent = localBalance.started + '$'
        localBalance.asset = 0
        balanceAsset.textContent = 0 
        
    } else {
        localBalance.asset = (Math.floor(getSumPricePortfolio() * 100) / 100)
        balanceAsset.textContent = localBalance.asset + '$'
        localBalance.available = (Math.floor((localBalance.started - localBalance.asset) * 100) / 100)
        balanceAvailable.textContent = localBalance.available + '$'
    }
    localStorage.setItem('balance', JSON.stringify(localBalance))
}
setBalancePortfolio()

// =========== Currency rate ==========

const currencyRate_API_KEY = 'DYLE6KtoNRkqm6lCbIgGAC8eO'
const currenciesList = 'USD/AUD,USD/CAD,USD/CHF,USD/EUR,USD/GBP,USD/PLN,USD/RUB,USD/JPY,USD/CNY,USD/UAH,USD/TRY'
const usDollar = 'US Dollar / '
const imgFlags = ['img/flag/Canada.png', 'img/flag/Switzerland.png', 'img/flag/Japan.png', 'img/flag/Russia.png', 'img/flag/Poland.png', 'img/flag/Turkey.png', 'img/flag/Australia.png', 'img/flag/China.png', 'img/flag/European-Union.png', 'img/flag/Britian.png', 'img/flag/Ukraine.png']
const currenciesDescription =['Canadian Dollar', 'Swiss Franc', 'Japanese yen', 'Russian Ruble', 'Polish zloty', 'Turkish Lira', 'Australian Dollar', 'Chinese Yuan', 'Euro', 'Pound', 'Ukrainian hryvnia']
const currencyRate_URL = `https://fcsapi.com/api-v3/forex/latest?symbol=${currenciesList}&access_key=${currencyRate_API_KEY}`

const getValueRate = (data) => {
    let count = 0
    data.forEach(rate => {
        if(rate.id !== '1872') {
            const rateElem = rate.s
            const ratePrice = Math.floor(rate.c * 10000) / 10000  
            createCurrencyRate(rateElem, ratePrice, imgFlags[count], currenciesDescription[count])
            count++ 
        }  
    })
    const currencyRate = document.querySelector('.currencyRate-widget')
    let idElem = currencyRate.querySelectorAll('li')
    idElem.forEach(ctoc => {
        let nameId = ctoc.children[2].id
        createConvertRate(nameId)
        
    })
    convertationCalculator()
}

const getCurrencyRate = (url) => {
    fetch(url)
        .then(resp => resp.json())
        .then(data => {
            console.log(data.response)
            getValueRate(data.response)
        })    
}
getCurrencyRate(currencyRate_URL)

const createCurrencyRate = (value, price, flag, desript) => {
    const currencyRate = document.querySelector('.currencyRate-widget')
    const currencyRateList = currencyRate.querySelector('.current-course__list')

    const card = createElem('li', 'current-course__item');
    currencyRateList.append(card)

    const rateItemInfo = createElem('div', 'rate-item__info');
    card.append(rateItemInfo)
    const rateItemTitle = createElem('h3', 'rate-item__title', value)
    rateItemInfo.append(rateItemTitle)
    const rateItemDescript = createElem('p', 'rate-item__descript', usDollar + desript)
    rateItemInfo.append(rateItemDescript)
    
    const imgFlag = createElem('img', 'rate-item__flag');
    imgFlag.src = flag
    card.append(imgFlag) 

    const rateItemPrice = createElem('p', 'rate-item__price', price)
    rateItemPrice.id = value.split('').slice(4,7).join('')
    card.append(rateItemPrice)
}

const createConvertRate = (nameId) => {
    const currencyRate = document.querySelector('.currencyRate-widget')
    const rateFrom = currencyRate.querySelector('#name-from')
    const rateTo = currencyRate.querySelector('#name-to')

    const optionRateTo = createElem('option', 'rate-option', nameId);
    optionRateTo.value = nameId
    rateTo.append(optionRateTo)
}

const convertationCalculator = () => {
    const currencyRate = document.querySelector('.currencyRate-widget')
    const rateTo = currencyRate.querySelector('#name-to') 
    const optionRateTo = currencyRate.querySelectorAll('.rate-option')
    const inputAmountNumber = currencyRate.querySelector('.course-amount')
    const courseResult = currencyRate.querySelector('.course-result')

    let selectCourse = currencyRate.querySelector('#CAD').textContent
    let selectRate = 'CAD'
    rateTo.addEventListener('change', function() {
        selectRate = rateTo.value
        optionRateTo.forEach(opt => {
            if (opt.value === selectRate) {
                selectCourse = currencyRate.querySelector(`#${selectRate}`).textContent
                return selectCourse
            }
        })
        return selectRate
    })

    inputAmountNumber.addEventListener('input', function() {
        let amount = inputAmountNumber.value
        courseResult.textContent = (Math.floor(amount * selectCourse * 10000) / 10000)
    })
}
;

const widgetBody = document.querySelector('.widget-body')
const widgetList = document.querySelectorAll('.menu-finance__item')
let currentWidget;

let saveWidget = localStorage.getItem('widget')
if (localStorage.widget) {
    for (let key of widgetBody.children) {
        if (key.className == saveWidget) {
            key.classList.add('active-widget')
        }   
    }
    for (let item of widgetList) {
        if (item.id == saveWidget) {
            item.classList.add('active-item') 
        }  
    }
} else {
    widgetBody.children[0].classList.add('active-widget')
    widgetList[0].classList.add('active-item')
}

const chooseWidget = (widget, itemList, n) => {
    itemList.addEventListener('click', function () {
        currentWidget = widget.children[n].className;
        localStorage.setItem('widget', currentWidget)
        for (let key of widgetBody.children) {
            key.classList.remove('active-widget')    
        }
        widget.children[n].classList.add('active-widget')
        for (let item of widgetList) {
            item.classList.remove('active-item') 
        }
        itemList.classList.add('active-item')
    })
}

const changeWidget = () => {
    for (let i = 0; i < widgetList.length; i++) {
        chooseWidget(widgetBody, widgetList[i], i) 
    }
}
changeWidget()

const setTime = () => {
    const getHours = document.querySelector('.date-group__time')
    const fullData = document.querySelector('.date-group__date')
    const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturdat']
    const dayOfWeek = document.querySelector('.date-group__day')
    let date = new Date()
    dayOfWeek.textContent = week[date.getDay()]
    let minutesHeader = date.getMinutes()
    let hoursHeader = date.getHours()
    let dayHeader = date.getDate()
    let monthHeader = date.getMonth() + 1
    let yearHeader = date.getFullYear()
    if (minutesHeader < 10) {
        minutesHeader = '0' + minutesHeader
    }
    if (hoursHeader < 10) {
        hoursHeader = '0' + hoursHeader
    }
    if (dayHeader < 10) {
        dayHeader = '0' + dayHeader
    }
    if (monthHeader < 10) {
        monthHeader = '0' + monthHeader
    }
    getHours.textContent = hoursHeader + ':' + minutesHeader; 
    fullData.textContent = dayHeader + '.' + monthHeader + '.' + yearHeader
}
setTime ()
setInterval(setTime, 60000)

// Menu active

const btnOpenMenu = document.querySelector('.btn-menu-open');
const menuFinance = document.querySelector('.menu-finance');
btnOpenMenu.addEventListener('click', function() {
    btnOpenMenu.classList.toggle('active-menu')
})