const api_key_test = 'EbXM4yKB9ua_wBL-6CihPQbg2YAZyOrKRYPxMty9A1U'

const getNews = (category) => {
    fetch(`https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=${category}`, {
        headers: {
            'x-api-key': api_key_test
        }
    })
    .then(resp => {
        return resp.json()
    })
    .then(data => {
        const dataNews = data.articles
        const dataMax = 7  
        for (let i = 0; i < dataMax; i++) {
            if (dataNews[i].media == null) {
                dataNews[i].media = 'img/category/worldNews.png'
            }
            if (dataNews[i].author == null) {
                i++
            }
            createCardsNews(dataNews[i], category)
        }      
    }).catch(err => {
        console.log(err , '12')
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
    const cardInfoName = createElem('h3', 'news-card__info-name', data.author); 
    cardInfo.append(cardInfoName)
    const cardInfoCategory = createElem('h4', 'news-card__info-category', category);
    cardInfo.append(cardInfoCategory)

    const cardTitle = createElem('p', 'news-card__title', data.title); 
    card.append(cardTitle)

    const cardDescription = createElem('p', 'news-card__description', data.excerpt);
    card.append(cardDescription)

    const cardImg = createElem('img', 'news-card__img');
    cardImg.src = data.media
    card.append(cardImg)

    const cardURL = createElem('a', 'news-card__url', 'Click to continue');
    cardURL.href = data.link  
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
