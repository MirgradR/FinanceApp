const API_KEY_NEWS = '1de49cf49c8b420c9333bade896baea7'

const getNews = (category) => {
    fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY_NEWS}`)
    .then(resp => resp.json())
    .then(data => {
        const dataNews = data.articles
        for (let i = 0; i < 7; i++) {
            if (dataNews[i].urlToImage == null) {
                dataNews[i].urlToImage = 'img/category/worldNews.png'
            }
            if (dataNews[i].description == 'False') {
                i++
            }
            createCardsNews(dataNews[i], category)
        }      
    })
}
getNews('business')

const createCardsNews = (data, category) => {
    const economicNews = document.querySelector('.economicNews-widget')
    const newsList = economicNews.querySelector('.news-list')

    const card = createElem('li', 'news-list__card');
    newsList.append(card)

    const cardInfo = createElem('div', 'news-card__info');
    card.append(cardInfo)
    const cardInfoName = createElem('h3', 'news-card__info-name', data.source.name);
    cardInfo.append(cardInfoName)
    const cardInfoCategory = createElem('h4', 'news-card__info-category', category);
    cardInfo.append(cardInfoCategory)

    const cardTitle = createElem('p', 'news-card__title', data.title);
    card.append(cardTitle)

    const cardDescription = createElem('p', 'news-card__description', data.description);
    card.append(cardDescription)

    const cardImg = createElem('img', 'news-card__img');
    cardImg.src = data.urlToImage
    card.append(cardImg)

    const cardURL = createElem('a', 'news-card__url', 'Click to continue');
    cardURL.href = data.url
    card.append(cardURL)
}

const changeCategory = () => {
    const cardsNews = document.querySelectorAll('.news-list__card')
    cardsNews.forEach(card => {
        card.remove()
    })  
}
const removeCategoryActive = (btns) => {
    btns.forEach(btn => {
        btn.classList.remove('active')
    })
}

const chooseCategory = () => {
    const economicNews = document.querySelector('.economicNews-widget')
    const categoryBtns = economicNews.querySelectorAll('.news-category__item')
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            changeCategory() 
            removeCategoryActive(categoryBtns)
            btn.classList.add('active')
            getNews(btn.id)
        })
    })
}
chooseCategory()

const api_key_test = 'EbXM4yKB9ua_wBL-6CihPQbg2YAZyOrKRYPxMty9A1U'
const url_test = 'https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=business'
fetch(url_test, {
    headers: {
        'x-api-key': api_key_test
    }
}).then(resp => resp.json()).then(data => {
    console.log(data.articles)
})
