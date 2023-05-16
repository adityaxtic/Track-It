import { budgStat, expenseCategorySelect, expenseStat, savingsStat, tbody, transactionEl } from "./selectors.mjs"

const capitalize = (str, lower = false) => (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());

const addTransactions = (transaction) => {
    const card = document.createElement('div')
    card.className = "card w-full bg-neutral text-neutral-content"
    card.innerHTML = `
        <div class="card-body p-4 flex-row justify-between items-center">
            <div class="left">
                <h3 class="card-title text-xl">${transaction.detail}</h3>
                <small>${capitalize(transaction.category)}</small>
            </div>
            <h2 class="text-3xl font-semibold text-${transaction.category==='budget'?'success':'error'}">${transaction.amount}</h2>
        </div>
    `
    transactionEl.prepend(card)
}

const updateTransactions = () => {
    const transactions = JSON.parse(localStorage.transactions)
    for (const transaction in transactions) {
        addTransactions(transactions[transaction])
    }
}

const updateTable = () => {
    let data = ''
    const categories = JSON.parse(localStorage.categories)
    for (const category in categories) {
        data += `<tr>
        <td>${capitalize(category)}</td>
        <td>${categories[category]}</td>
        </tr>`
    }
    tbody.innerHTML = data
}

const updateStat = () => {
    budgStat.innerHTML = (+localStorage.budget).toLocaleString('en-IN')
    let expense = 0
    let transactions = JSON.parse(localStorage.transactions)
    for (const transaction in transactions) {
        if(transactions[transaction].category!=="budget"){
            expense += transactions[transaction].amount
        }
    }
    expenseStat.innerHTML = expense.toLocaleString('en-IN')
    savingsStat.innerHTML = (+localStorage.budget - expense).toLocaleString('en-IN')
}

const updateCategorySelect = () => {
    let options = ''
    const categories = JSON.parse(localStorage.categories)
    for (const category in categories) {
        options += `<option>${capitalize(category)}</option>\n`
    }
    expenseCategorySelect.innerHTML = options
}

export const addExpense = (amountEl, amountDetailEl) => {
    if (amountEl.value<=0){
        alert('Invalid expense amount')
        return
    }
    if(amountDetailEl.value.trim() === ''){
        alert('Please add expense detail')
        return
    }
    if(expenseCategorySelect.value.toLowerCase()===''){
        alert('Please add a category before adding expense')
        return
    }
    if (+amountEl.value > +(savingsStat.innerHTML.split(',').join(''))) {
        amountEl.value = ''
        alert("Insufficient balance")
        return
    }
    const categories = JSON.parse(localStorage.categories)
    categories[expenseCategorySelect.value.toLowerCase()] += +amountEl.value
    const transactions = JSON.parse(localStorage.transactions)
    const time = new Date().getTime();
    transactions[time] = ({
        amount: +amountEl.value,
        detail: amountDetailEl.value,
        category: expenseCategorySelect.value.toLowerCase()
    })
    addTransactions(transactions[time])
    localStorage.categories = JSON.stringify(categories)
    localStorage.transactions = JSON.stringify(transactions)
    amountEl.value = ''
    amountDetailEl.value = ''
    updateStat()
    updateTable()
}

export const addCategory = (categoryEl) => {
    if (categoryEl.value.trim() === '') return
    const categories = JSON.parse(localStorage.categories)
    categories[categoryEl.value.toLowerCase()] = 0
    categoryEl.value = ''
    localStorage.categories = JSON.stringify(categories)
    updateCategorySelect()
    updateTable()
}

export const addBudget = (budgetEl) => {
    if (+budgetEl.value<=0){
        alert('Invalid budget amount')
        budgetEl.value = ''
        return
    }
    if (+budgetEl.value < 0) {
        alert('Budget can\'t be negative')
        return
    }
    let currBudg = +localStorage.budget
    currBudg += +budgetEl.value
    localStorage.budget = "" + currBudg
    const transactions = JSON.parse(localStorage.transactions)
    const time = new Date().getTime();
    transactions[time] = ({
        amount: +budgetEl.value,
        detail: "Added budget",
        category: "budget"
    })
    localStorage.transactions = JSON.stringify(transactions)
    budgetEl.value = ''
    addTransactions(transactions[time])
    updateStat()
}

export const updateUI = () => {
    if (!localStorage.categories) localStorage.categories = JSON.stringify(new Set())
    if (!localStorage.transactions) localStorage.transactions = JSON.stringify(new Set())
    if (!localStorage.budget) localStorage.budget = "" + 0
    updateStat()
    updateCategorySelect()
    updateTable()
    updateTransactions()
}