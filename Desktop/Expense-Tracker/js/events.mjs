import { addBudget, addCategory, addExpense } from "./helperFunc.mjs";
import { addBudgBtn, addBudgInp, addCatBtn, addCatInp, addExpBtn, addExpDetailInp, addExpInp, addPage, bottomNav, forms, sections, themeBtn } from "./selectors.mjs";

const handleAddPageClick = e => {
    e.preventDefault()
    switch (e.target) {
        case addCatBtn:
            addCategory(addCatInp)
            break;
        case addExpBtn:
            addExpense(addExpInp, addExpDetailInp)
            break;
        case addBudgBtn:
            addBudget(addBudgInp)
            break;
        default:
            break;
    }
}

const handleFormSubmit = e => {
    e.preventDefault()
}

const handleBottomNavClick = e => {
    bottomNav.querySelectorAll('button').forEach(btn => btn.classList.remove('active'))
    e.target.classList.add('active')
    const selectedBtnIndex = +e.target.dataset.index;
    sections.forEach(sect => { sect.classList.add('hidden') })
    sections[selectedBtnIndex].classList.remove('hidden')
}

const toggleTheme = () => {
    if (!themeBtn.checked) {
        document.querySelector('html').dataset.theme = "dark"
    } else {
        document.querySelector('html').dataset.theme = "light"
    }
}

export const addEvents = () => {
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit)
    })
    bottomNav.addEventListener('click', handleBottomNavClick)
    addPage.addEventListener('click', handleAddPageClick)
    themeBtn.addEventListener('click', toggleTheme)
}