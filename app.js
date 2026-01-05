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

// Historical data - will be loaded on first run only
const HISTORICAL_DATA = {
    hp: [
        {
            amount: 0,
            date: '2024-12-18T00:00:00.000Z',
            displayDate: '18 Dec 2024',
            notes: 'Thomas transfer'
        },
        {
            amount: 3000,
            date: '2024-12-30T00:00:00.000Z',
            displayDate: '30 Dec 2024',
            notes: 'First payment Dec (000608339)'
        },
        {
            amount: 2800,
            date: '2026-01-05T00:00:00.000Z',
            displayDate: '05 Jan 2026',
            notes: 'Second payment Jan (206677)'
        }
    ],
    mortgage: [
        {
            amount: 0,
            date: '2024-12-18T00:00:00.000Z',
            displayDate: '18 Dec 2024',
            notes: 'Thomas transfer'
        },
        {
            amount: 1700,
            date: '2024-12-23T00:00:00.000Z',
            displayDate: '23 Dec 2024',
            notes: 'First payment Dec (609136086)'
        },
        {
            amount: 2524,
            date: '2026-01-05T00:00:00.000Z',
            displayDate: '05 Jan 2026',
            notes: 'Second payment + Yearly Takaful RM845.57 (612174498)'
        }
    ]
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
    } else {
        // First time loading - use historical data
        payments = JSON.parse(JSON.stringify(HISTORICAL_DATA));
        saveData();
    }
    updateDisplay();
    renderHistory();
}

// Save data to browser storage
function saveData() {
    localStorage.setItem('allocationData', JSON.stringify(payments));
}

// Add a payment
function addPayment(type) {
    const inputId = type === 'hp' ? 'hp-payment' : 'mortgage-payment';
    const notesId = type === 'hp' ? 'hp-notes' : 'mortgage-notes';
    const input = document.getElementById(inputId);
    const notesInput = document.getElementById(notesId);
    const amount = parseFloat(input.value);
    
    // Validation - allow 0 or positive numbers
    if (isNaN(amount) || amount < 0) {
        alert('Please enter a valid amount (0 or greater)');
        return;
    }
    
    const remaining = ALLOCATIONS[type].total - getTotalUsed(type);
    if (amount > remaining) {
        alert(`Payment exceeds remaining allocation! Only RM ${remaining.toFixed(2)} left.`);
        return;
    }
    
    // Add payment with timestamp and notes
    payments[type].push({
        amount: amount,
        date: new Date().toISOString(),
        displayDate: new Date().toLocaleDateString('en-MY', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }),
        notes: notesInput ? notesInput.value || '' : ''
    });
    
    // Save and update
    saveData();
    updateDisplay();
    renderHistory();
    
    // Clear inputs
    input.value = '';
    if (notesInput) notesInput.value = '';
    
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
                ${payment.notes ? `<br><small style="color: #9ca3af">📝 ${payment.notes}</small>` : ''}
            </div>
            <div style="font-weight: 600; color: ${payment.amount === 0 ? '#6b7280' : '#ef4444'}">
                ${payment.amount === 0 ? 'RM 0.00' : `-RM ${payment.amount.toLocaleString('en-MY', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
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
