// Initial Values
let balance = 0;
let budget = 0;
let currencySymbol = "₹";
let transactions = [];

// Set budget and currency
function setBudgetAndProceed() {
    budget = parseFloat(document.getElementById("budget").value);
    currencySymbol = document.getElementById("currency").value;
    if (budget > 0) {
        document.getElementById("budget-slide").classList.add("hidden");
        document.getElementById("wallet-slide").classList.remove("hidden");
        document.getElementById("currency-symbol").innerText = currencySymbol;
    } else {
        alert("Please enter a valid budget.");
    }
}

// Add cash in
function cashIn() {
    const amount = parseFloat(document.getElementById("amount").value);
    const transactionTime = new Date(document.getElementById("transaction-time").value);
    const icon = document.getElementById("icon-selection").value;

    if (amount > 0 && transactionTime) {
        balance += amount;
        transactions.push({ type: "Cash In", amount, date: transactionTime, icon });
        updateBalance();
        showTransactions();
        clearInputFields();
    } else {
        alert("Enter a valid amount and date.");
    }
}

// Add cash out
function cashOut() {
    const amount = parseFloat(document.getElementById("amount").value);
    const transactionTime = new Date(document.getElementById("transaction-time").value);
    const icon = document.getElementById("icon-selection").value;

    if (amount > 0 && amount <= balance && transactionTime) {
        balance -= amount;
        transactions.push({ type: "Cash Out", amount, date: transactionTime, icon });
        updateBalance();
        showTransactions();
        checkBudgetExceeded();
        clearInputFields();
    } else {
        alert("Enter a valid amount and date.");
    }
}

// Check if budget is exceeded
function checkBudgetExceeded() {
    const totalExpenditure = transactions.reduce((sum, t) => t.type === "Cash Out" ? sum + t.amount : sum, 0);
    const budgetAlert = document.getElementById("budget-alert");
    if (totalExpenditure > budget) {
        budgetAlert.classList.remove("hidden");
    } else {
        budgetAlert.classList.add("hidden");
    }
}

// Update balance on screen
function updateBalance() {
    document.getElementById("balance").innerText = balance.toFixed(2);
}

// Show transactions in order
function showTransactions() {
    const filter = document.getElementById("filter").value;
    const transactionHistory = document.getElementById("transaction-history");
    transactionHistory.innerHTML = '';

    const filteredTransactions = transactions.filter(t => {
        const now = new Date();
        if (filter === "currentMonth") {
            return t.date.getMonth() === now.getMonth() && t.date.getFullYear() === now.getFullYear();
        } else if (filter === "lastMonth") {
            const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
            return t.date.getMonth() === lastMonth.getMonth() && t.date.getFullYear() === lastMonth.getFullYear();
        } else if (filter === "oneYear") {
            return t.date >= new Date(now.setFullYear(now.getFullYear() - 1));
        }
        return true;
    });

    filteredTransactions.forEach(t => {
        const li = document.createElement("li");
        const color = t.type === "Cash In" ? "green" : "red"; // Color based on type
        li.innerHTML = `<div style="color: ${color};">${t.icon} ${t.type}: ${t.amount.toFixed(2)} - ${t.date.toLocaleString()}</div>`;
        transactionHistory.appendChild(li);
    });
}

// Clear input fields
function clearInputFields() {
    document.getElementById("amount").value = '';
    document.getElementById("transaction-time").value = '';
}

// Go to Graph Slide
function goToGraphSlide() {
    document.getElementById("wallet-slide").classList.add("hidden");
    document.getElementById("graph-slide").classList.remove("hidden");
}

// Go to Wallet Slide
function goToWalletSlide() {
    document.getElementById("graph-slide").classList.add("hidden");
    document.getElementById("wallet-slide").classList.remove("hidden");
}

// Update Graph
function updateGraph() {
    const labels = transactions.map(t => t.date.toLocaleDateString());
    const data = transactions.map(t => t.type === "Cash In" ? t.amount : -t.amount);

    const ctx = document.getElementById("expenseChart").getContext("2d");
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Expenditure',
                data,
                backgroundColor: data.map(d => d < 0 ? "red" : "green"),
                borderColor: 'black',
                borderWidth: 1
            }]
        }
    });
}



  
  


   


