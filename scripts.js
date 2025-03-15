document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expenseForm');
    const expenseList = document.getElementById('expenseList');
    const targetForm = document.getElementById('targetForm');
    const targetDisplay = document.getElementById('targetDisplay');
    const progressBar = document.querySelector('.progress');
    const celebration = document.querySelector('.celebration');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const exportCSV = document.getElementById('exportCSV');
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const ctx = document.getElementById('expenseChart').getContext('2d');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let targetExpense = parseFloat(localStorage.getItem('targetExpense')) || 0;
    let username = localStorage.getItem('username') || "";

    // Dark Mode Toggle
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    }

    darkModeToggle.addEventListener('click', toggleDarkMode);

    // User Authentication (Basic)
    loginBtn.addEventListener('click', () => {
        username = usernameInput.value.trim();
        if (username) {
            localStorage.setItem('username', username);
            alert(`Welcome, ${username}!`);
        }
    });

    function saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
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
        }

        if (total >= targetExpense && targetExpense > 0) {
            celebration.style.display = 'block';
            progressBar.style.background = '#d4af37';
        } else {
            celebration.style.display = 'none';
            progressBar.style.background = '#28a745';
        }
    }

    function renderExpenses() {
        expenseList.innerHTML = expenses.map(exp => `<div><strong>${exp.title} (${exp.category})</strong><br>$${exp.amount.toFixed(2)}</div>`).join('');
    }

    function exportAsCSV() {
        let csv = "Title,Amount,Category\n";
        expenses.forEach(exp => {
            csv += `${exp.title},${exp.amount},${exp.category}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'expenses.csv';
        a.click();
    }

    exportCSV.addEventListener('click', exportAsCSV);

    renderExpenses();
    updateTargetDisplay();
});