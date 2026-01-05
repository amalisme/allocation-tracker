// Allocation constants
const ALLOCATIONS = {
    hp: {
        total: 33000,
        name: 'Hire Purchase'
    },
    mortgage: {
        total: 10000,
        name: 'Mortgage'
    }
};

// State management - stores data in browser
let payments = {
    hp: [],
    mortgage: []
};

// Load saved data when app starts
function loadData() {
    const saved = localStorage.getItem('allocationData');
    if (saved) {
        payments = JSON.parse(saved);
        updateDisplay();
        renderHistory();
    }
}

// Save data to browser storage
function saveData() {
    localStorage.setItem('allocationData', JSON.stringify(payments));
}

// Add a payment
function addPayment(type) {
    const inputId = type === 'hp' ? 'hp-payment' : 'mortgage-payment';
    const input = document.getElementById(inputId);
    const amount = parseFloat(input.value);
    
    // Validation
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    const remaining = ALLOCATIONS[type].total - getTotalUsed(type);
    if (amount > remaining) {
        alert(`Payment exceeds remaining allocation! Only RM ${remaining.toFixed(2)} left.`);
        return;
    }
    
    // Add payment with timestamp
    payments[type].push({
        amount: amount,
        date: new Date().toISOString(),
        displayDate: new Date().toLocaleDateString('en-MY', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    });
    
    // Save and update
    saveData();
    updateDisplay();
    renderHistory();
    
    // Clear input
    input.value = '';
    
    // Visual feedback
    showSuccessMessage(type);
}

// Calculate total used for an allocation type
function getTotalUsed(type) {
    return payments[type].reduce((sum, payment) => sum + payment.amount, 0);
}

// Update the display numbers
function updateDisplay() {
    // Hire Purchase
    const hpUsed = getTotalUsed('hp');
    const hpRemaining = ALLOCATIONS.hp.total - hpUsed;
    document.getElementById('hp-used').textContent = `RM ${hpUsed.toLocaleString('en-MY', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('hp-remaining').textContent = `RM ${hpRemaining.toLocaleString('en-MY', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    
    // Change color if running low
    const hpRemainingEl = document.getElementById('hp-remaining');
    if (hpRemaining < ALLOCATIONS.hp.total * 0.2) {
        hpRemainingEl.style.color = '#ef4444';
    } else {
        hpRemainingEl.style.color = '#059669';
    }
    
    // Mortgage
    const mortgageUsed = getTotalUsed('mortgage');
    const mortgageRemaining = ALLOCATIONS.mortgage.total - mortgageUsed;
    document.getElementById('mortgage-used').textContent = `RM ${mortgageUsed.toLocaleString('en-MY', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('mortgage-remaining').textContent = `RM ${mortgageRemaining.toLocaleString('en-MY', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    
    const mortgageRemainingEl = document.getElementById('mortgage-remaining');
    if (mortgageRemaining < ALLOCATIONS.mortgage.total * 0.2) {
        mortgageRemainingEl.style.color = '#ef4444';
    } else {
        mortgageRemainingEl.style.color = '#059669';
    }
}

// Render payment history
function renderHistory() {
    const historyList = document.getElementById('history-list');
    
    // Combine all payments and sort by date
    const allPayments = [
        ...payments.hp.map(p => ({...p, type: 'hp', name: ALLOCATIONS.hp.name})),
        ...payments.mortgage.map(p => ({...p, type: 'mortgage', name: ALLOCATIONS.mortgage.name}))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (allPayments.length === 0) {
        historyList.innerHTML = '<div class="history-empty">No payments yet</div>';
        return;
    }
    
    historyList.innerHTML = allPayments.map(payment => `
        <div class="history-item">
            <div>
                <strong>${payment.name}</strong><br>
                <small style="color: #6b7280">${payment.displayDate}</small>
            </div>
            <div style="font-weight: 600; color: #ef4444">
                -RM ${payment.amount.toLocaleString('en-MY', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
        </div>
    `).join('');
}

// Reset for new month
function resetMonth() {
    if (confirm('Are you sure you want to reset all payments for a new month? This cannot be undone.')) {
        payments = {
            hp: [],
            mortgage: []
        };
        saveData();
        updateDisplay();
        renderHistory();
        alert('Month reset! Ready for new payments.');
    }
}

// Visual feedback
function showSuccessMessage(type) {
    const card = document.querySelector(`.card:nth-child(${type === 'hp' ? 1 : 2})`);
    card.style.transform = 'scale(1.02)';
    card.style.boxShadow = '0 8px 16px rgba(79, 70, 229, 0.3)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }, 300);
}

// PWA Install handling
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('install-prompt').style.display = 'flex';
});

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
            document.getElementById('install-prompt').style.display = 'none';
        });
    }
}

function dismissInstall() {
    document.getElementById('install-prompt').style.display = 'none';
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});
