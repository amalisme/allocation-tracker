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
        hpRemainingEl.style.color = '#D44C47';
    } else {
        hpRemainingEl.style.color = '#2D6A4F';
    }
    
    // Mortgage
    const mortgageUsed = getTotalUsed('mortgage');
    const mortgageRemaining = ALLOCATIONS.mortgage.total - mortgageUsed;
    document.getElementById('mortgage-used').textContent = `RM ${mortgageUsed.toLocaleString('en-MY', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('mortgage-remaining').textContent = `RM ${mortgageRemaining.toLocaleString('en-MY', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    
    const mortgageRemainingEl = document.getElementById('mortgage-remaining');
    if (mortgageRemaining < ALLOCATIONS.mortgage.total * 0.2) {
        mortgageRemainingEl.style.color = '#D44C47';
    } else {
        mortgageRemainingEl.style.color = '#2D6A4F';
    }
}

// Render payment history for each type
function renderHistory() {
    // Render Hire Purchase history
    const hpHistoryList = document.getElementById('hp-history-list');
    const hpPayments = payments.hp
        .map(p => ({...p, type: 'hp', name: ALLOCATIONS.hp.name}))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (hpPayments.length === 0) {
        hpHistoryList.innerHTML = '<div class="history-empty">No payments yet</div>';
    } else {
        hpHistoryList.innerHTML = hpPayments.map(payment => `
            <div class="history-item">
                <div>
                    <div style="font-weight: 500; color: #1C1C1C; margin-bottom: 2px;">${payment.displayDate}</div>
                    ${payment.notes ? `<div style="font-size: 0.85rem; color: #8E8E93;">${payment.notes}</div>` : ''}
                </div>
                <div style="font-weight: 600; color: ${payment.amount === 0 ? '#8E8E93' : '#D44C47'}; white-space: nowrap;">
                    ${payment.amount === 0 ? 'RM 0.00' : `-RM ${payment.amount.toLocaleString('en-MY', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                </div>
            </div>
        `).join('');
    }
    
    // Render Mortgage history
    const mortgageHistoryList = document.getElementById('mortgage-history-list');
    const mortgagePayments = payments.mortgage
        .map(p => ({...p, type: 'mortgage', name: ALLOCATIONS.mortgage.name}))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (mortgagePayments.length === 0) {
        mortgageHistoryList.innerHTML = '<div class="history-empty">No payments yet</div>';
    } else {
        mortgageHistoryList.innerHTML = mortgagePayments.map(payment => `
            <div class="history-item">
                <div>
                    <div style="font-weight: 500; color: #1C1C1C; margin-bottom: 2px;">${payment.displayDate}</div>
                    ${payment.notes ? `<div style="font-size: 0.85rem; color: #8E8E93;">${payment.notes}</div>` : ''}
                </div>
                <div style="font-weight: 600; color: ${payment.amount === 0 ? '#8E8E93' : '#D44C47'}; white-space: nowrap;">
                    ${payment.amount === 0 ? 'RM 0.00' : `-RM ${payment.amount.toLocaleString('en-MY', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                </div>
            </div>
        `).join('');
    }
}

// PWA Install handling
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installPrompt = document.getElementById('install-prompt');
    if (installPrompt) {
        installPrompt.style.display = 'flex';
    }
});

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
            const installPrompt = document.getElementById('install-prompt');
            if (installPrompt) {
                installPrompt.style.display = 'none';
            }
        });
    }
}

function dismissInstall() {
    const installPrompt = document.getElementById('install-prompt');
    if (installPrompt) {
        installPrompt.style.display = 'none';
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});
