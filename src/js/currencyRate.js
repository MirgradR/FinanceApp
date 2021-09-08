// Stocks

const API_KEY = 'c4q8am2ad3icc97rdfcg';
let symbols = ['FB', 'AAPL', 'MS', 'JPM', 'JNJ', 'XOM', 'BAC', 'V', 'T', 'INTC', 'PFE', 'BA', 'KO', 'BABA', 'TSLA', 'NFLX', 'WMT', 'NKE', 'EA', 'MSFT']
//let symbols = ['FB', 'AAPL', 'MS', 'AMZN']
let stocksArr = [];

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
    stockObj.count = 1
    stockObj.price = (Math.floor(data[0].c * 100) / 100) * stockObj.count
    stockObj.inPortfolio = 'false'
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
const exportStocksFromArr = () => {
    localStocks.forEach(stock => {
        createStocks(stock) 
        
    })
}

exportStocksFromArr()

const addToPortfolio = () => {
    const btnAdd = document.querySelectorAll('.widget_price-btn')
    for (let add of btnAdd) {
        add.addEventListener('click', function (e) {
            let stockElem = e.target.closest('.widget_price-description')
                .querySelector('.widget_price-title');
            localStocks.forEach(stoc => {
                if (stockElem.innerText === stoc.name) {
                   console.log(stoc.name) 
                   //и мы запускаем тут функцию добавления 
                   //в портфолио разметки с данными
                }
            })   
        })
    }
}
addToPortfolio()