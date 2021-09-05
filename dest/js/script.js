// Stocks

const API_KEY = 'c4q8am2ad3icc97rdfcg';
let symbols = ['FB', 'AAPL', 'MS', 'AMZN', 'JPM', 'GOOGL', 'JNJ', 'XOM', 'BAC', 'V', 'T', 'INTC', 'PFE', 'BA', 'KO', 'BABA', 'TSLA', 'NFLX', 'WMT', 'NKE', 'EA', 'MSFT']

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
        createStocks(data)
        console.log(data)
    })
}
for (let i = 0; i < symbols.length; i++) {
    getData(getPrice(symbols[i]), getCompany(symbols[i]))
}
//getData(getPrice(symbols[9]), getCompany(symbols[9]))


const createElem = (tagName, className, text) => {
    const elem = document.createElement(tagName);
    elem.classList.add(className);
    if (text) {
        elem.textContent = text
    }
    return elem
}

const createStocks = (data) => {
    const stockPriceWidget = document.querySelector('.stockPrice-widget')
    const list = stockPriceWidget.querySelector('.widget_price-list')

    const card = createElem('div', 'widget_price-card');
    list.append(card)

    const cardDiv = createElem('div', 'widget_price-info');
    card.append(cardDiv)

    const cardImg = createElem('img', 'widget_price-img');
    cardImg.src = data[1].logo 
    cardDiv.append(cardImg)

    const cardDivDiscript = createElem('div', 'widget_price-description');
    cardDiv.append(cardDivDiscript)

    const cardTitle = createElem('h3', 'widget_price-title', data[1].name);
    cardDivDiscript.append(cardTitle)

    const cardInductry = createElem('p', 'widget_price-inductry', data[1].finnhubIndustry);
    cardDivDiscript.append(cardInductry)
    
    const cardPrice = createElem('p', 'widget_price-price', data[0].c + ' $');
    card.append(cardPrice)
};

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