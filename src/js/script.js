@@include('currencyRate.js');

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