// Stocks

const API_KEY = 'c4q8am2ad3icc97rdfcg';
//let symbols = ['FB', 'AAPL', 'MS', 'JPM', 'JNJ', 'XOM', 'BAC', 'V', 'T', 'INTC', 'PFE', 'BA', 'KO', 'BABA', 'TSLA', 'NFLX', 'WMT', 'NKE', 'EA', 'MSFT']
let symbols = ['FB', 'AAPL', 'MS', 'AMZN']
let stocksArr = [];

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
                        console.log('takoy est')
                    } else {
                        myPortfolio.push(obj)
                        localStorage.setItem('Portfolio', JSON.stringify(myPortfolio))
                        createPortfolioElem(obj)
                        delitePortfolioElem()
                    }
                   
                }      
            })    
        })
    }
}
addToPortfolio()

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
    const priceStock = createElem('h3', 'stock-number__price', '140' + '$'); // PRICE
    amountNum.append(priceStock)
    const priceStockAll = createElem('h3', 'stock-number__price', '740' + '$'); // PRICE
    amountNum.append(priceStockAll)

    const sectionBtns = createElem('div', 'stock-number__count');
    sectionAmount.append(sectionBtns)
    const btnSell = createElem('button', 'btn-sell', 'Sell');
    sectionBtns.append(btnSell)
    const btnMinus = createElem('button', 'btn-minus');
    btnMinus.innerHTML = `&#8211;`
    sectionBtns.append(btnMinus)
    const count = createElem('p', 'stock-count', '5'); // COUNT
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
console.log(myPortfolio)

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
                    e.target.closest('.content-items__stock').remove()
                    if (myPortfolio.length == 0) {
                        document.querySelector('.empty-list').style = 'display: block'
                    }
                } 
                
            }) 
             
        })
    }
}
delitePortfolioElem()

