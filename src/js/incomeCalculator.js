const getResult = (elem, value) => {
    elem.textContent = value
    getRemains()
}

const sumArr = (arr) => {
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
        sum += +arr[i]
    }
    return sum
}

const getRemains = () => {
    const remainsResult = document.getElementById('result-remains')
    const incomeResult = document.getElementById('result-income').textContent
    const expenseResult = document.getElementById('result-expenses').textContent
    remainsResult.textContent = (+incomeResult - +expenseResult).toLocaleString()
}

const getIncome = () => {
    const incomeResult = document.getElementById('result-income')
    const incomeInputs = document.querySelectorAll('.form-income .income-input')
    let sum = []
    for (let i = 0; i < incomeInputs.length; i++) {
        sum.push(0)
        incomeInputs[i].addEventListener('input', function() {
            sum[i] = this.value
            getResult(incomeResult, sumArr(sum))
        })  
    }   
}
getIncome()

const getExpenses = () => {
    const expenseResult = document.getElementById('result-expenses')
    const expenseInputs = document.querySelectorAll('.form-expense .expense-input')
    let sum = []
    for (let i = 0; i < expenseInputs.length; i++) {
        sum.push(0)
        expenseInputs[i].addEventListener('input', function() {
            sum[i] = this.value
            getResult(expenseResult, sumArr(sum))
        })  
    }
}
getExpenses()
