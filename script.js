document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expenseForm');
    const expenseList = document.getElementById('expenseList');
    const targetForm = document.getElementById('targetForm');
    const targetDisplay = document.getElementById('targetDisplay');
    const progressBar = document.querySelector('.progress');
    const celebration = document.querySelector('.celebration');
    const confetti = document.querySelector('.confetti');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const ctx = document.getElementById('expenseChart').getContext('2d');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let targetExpense = parseFloat(localStorage.getItem('targetExpense')) || 0;
    let isDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;

    // Dark Mode Toggle
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        isDarkMode = !isDarkMode;
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', toggleDarkMode);

    function saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function saveTarget() {
        localStorage.setItem('targetExpense', targetExpense);
    }

    function calculateTotalExpense() {
        return expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }

    function updateTargetDisplay() {
        const total = calculateTotalExpense();
        let remaining = targetExpense - total;
        progressBar.style.width = targetExpense > 0 ? `${(total / targetExpense) * 100}%` : '0%';

        if (targetExpense > 0) {
            targetDisplay.innerHTML = `Target: $${targetExpense.toFixed(2)}<br>Total Spent: $${total.toFixed(2)}<br>Remaining: $${remaining >= 0 ? remaining.toFixed(2) : 0}`;
        } else {
            targetDisplay.textContent = 'No target set yet.';
        }

        if (total >= targetExpense && targetExpense > 0) {
            celebration.style.display = 'block';
            progressBar.style.background = '#d4af37';
            document.body.classList.add('flash');
            confetti.style.display = 'block';

            setTimeout(() => {
                document.body.classList.remove('flash');
                confetti.style.display = 'none';
            }, 3000);
        } else {
            celebration.style.display = 'none';
            progressBar.style.background = '#28a745';
        }

        updateChart();
    }

    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const expenseItem = document.createElement('div');
            expenseItem.innerHTML = `<div><strong>${expense.title} (${expense.category})</strong><br>$${expense.amount.toFixed(2)}</div>
                                     <button onclick="deleteExpense(${index})">Delete</button>`;
            expenseList.appendChild(expenseItem);
        });
    }

    function updateChart() {
        let categoryTotals = {};
        expenses.forEach(exp => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        });

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(categoryTotals),
                datasets: [{
                    data: Object.values(categoryTotals),
                    backgroundColor: ['red', 'blue', 'green', 'purple', 'orange']
                }]
            }
        });
    }

    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        expenses.push({ title: title.value, amount: parseFloat(amount.value), category: category.value });
        saveExpenses();
        renderExpenses();
        updateTargetDisplay();
        expenseForm.reset();
    });

    renderExpenses();
    updateTargetDisplay();
});