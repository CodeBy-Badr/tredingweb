// ==========================================
// DONNÉES DES CRYPTOMONNAIES
// ==========================================
const cryptoPrices = {
    'BTC': 45234.50,
    'ETH': 3000.75,
    'BNB': 620.30,
    'XRP': 2.45,
    'ADA': 1.12,
    'SOL': 195.40
};

// ==========================================
// INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    calculateTotal();
    updatePrices();
    // Met à jour les prix toutes les 5 secondes
    setInterval(updatePrices, 5000);
});

// ==========================================
// CONFIGURATION DES EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    document.getElementById('tradingForm').addEventListener('submit', handleTradingSubmit);
    document.getElementById('tradingPrice').addEventListener('input', calculateTotal);
    document.getElementById('tradingQuantity').addEventListener('input', calculateTotal);
    document.getElementById('orderTypeSelect').addEventListener('change', updateOrderType);
    document.getElementById('tradingCrypto').addEventListener('change', updateCryptoPrice);
    document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
}

// ==========================================
// MISE À JOUR DU GRAPHIQUE
// ==========================================
function updateChart() {
    const crypto = document.getElementById('cryptoSelector').value;
    const currentPrice = cryptoPrices[crypto];
    document.getElementById('currentPrice').textContent = `$${currentPrice.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
    
    showAlert(`Graphique de ${crypto} mis à jour`, 'info');
}

// ==========================================
// MISE À JOUR DU PRIX DE LA CRYPTO
// ==========================================
function updateCryptoPrice() {
    const crypto = document.getElementById('tradingCrypto').value;
    const price = cryptoPrices[crypto];
    document.getElementById('tradingPrice').value = price.toFixed(2);
    calculateTotal();
}

// ==========================================
// CALCUL DU TOTAL
// ==========================================
function calculateTotal() {
    const price = parseFloat(document.getElementById('tradingPrice').value) || 0;
    const quantity = parseFloat(document.getElementById('tradingQuantity').value) || 0;
    const total = price * quantity;
    const fees = total * 0.001; // 0.1%

    document.getElementById('tradingTotal').textContent = `$${total.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

    document.getElementById('fees').value = fees.toFixed(2);
}

// ==========================================
// MISE À JOUR DU TYPE D'ORDRE
// ==========================================
function updateOrderType() {
    const orderType = document.getElementById('orderTypeSelect').value;
    const stopLossDiv = document.getElementById('stopLossDiv');
    const takeProfitDiv = document.getElementById('takeProfitDiv');

    if (orderType === 'stop' || orderType === 'trailing') {
        stopLossDiv.style.display = 'block';
        takeProfitDiv.style.display = 'block';
    } else {
        stopLossDiv.style.display = 'none';
        takeProfitDiv.style.display = 'none';
    }
}

// ==========================================
// MISE À JOUR DES PRIX EN TEMPS RÉEL
// ==========================================
function updatePrices() {
    // Simule une mise à jour des prix (variation aléatoire)
    for (const crypto in cryptoPrices) {
        const variation = (Math.random() - 0.5) * 200;
        cryptoPrices[crypto] = Math.max(0, cryptoPrices[crypto] + variation);
    }
    updateChart();
}

// ==========================================
// SOUMISSION DU FORMULAIRE DE TRADING
// ==========================================
function handleTradingSubmit(e) {
    e.preventDefault();

    const orderType = document.querySelector('input[name="orderType"]:checked').value;
    const orderTypeSelect = document.getElementById('orderTypeSelect').value;
    const crypto = document.getElementById('tradingCrypto').value;
    const price = parseFloat(document.getElementById('tradingPrice').value);
    const quantity = parseFloat(document.getElementById('tradingQuantity').value);
    const leverage = document.getElementById('leverage').value;
    const total = price * quantity;
    const fees = total * 0.001;

    if (!crypto || !price || !quantity) {
        showAlert('Veuillez remplir tous les champs obligatoires', 'danger');
        return;
    }

    if (quantity <= 0 || price <= 0) {
        showAlert('La quantité et le prix doivent être positifs', 'danger');
        return;
    }

    // Validation pour Stop Loss
    if (orderTypeSelect === 'stop' || orderTypeSelect === 'trailing') {
        const stopLoss = parseFloat(document.getElementById('stopLoss').value);
        const takeProfit = parseFloat(document.getElementById('takeProfit').value);
        
        if (!stopLoss || !takeProfit) {
            showAlert('Veuillez définir Stop Loss et Take Profit', 'danger');
            return;
        }
    }

    const message = `
        <strong>Ordre ${orderType.toUpperCase()} confirmé!</strong><br>
        <small>
        Paire: ${crypto}/USD<br>
        Quantité: ${quantity.toFixed(4)}<br>
        Prix: $${price.toFixed(2)}<br>
        Total: $${total.toFixed(2)}<br>
        Frais: $${fees.toFixed(2)}<br>
        Levier: ${leverage}x<br>
        Type: ${orderTypeSelect}
        </small>
    `;

    showAlert(message, 'success');
    document.getElementById('tradingForm').reset();
    calculateTotal();
}

// ==========================================
// ANNULATION D'ORDRE
// ==========================================
function cancelOrder() {
    if (confirm('Êtes-vous sûr de vouloir annuler cet ordre?')) {
        showAlert('Ordre annulé avec succès', 'success');
    }
}

// ==========================================
// CONNEXION
// ==========================================
function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    showAlert(`Connecté avec: ${email}`, 'success');
    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    modal.hide();
    document.getElementById('loginForm').reset();
}

// ==========================================
// FONCTIONS UTILITAIRES
// ==========================================
function showAlert(message, type = 'info') {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show`;
    alertContainer.setAttribute('role', 'alert');
    alertContainer.style.position = 'fixed';
    alertContainer.style.top = '100px';
    alertContainer.style.right = '20px';
    alertContainer.style.zIndex = '9999';
    alertContainer.style.maxWidth = '500px';
    
    const icon = type === 'success' ? '✓' : type === 'danger' ? '✗' : 'ℹ';
    
    alertContainer.innerHTML = `
        <strong>${icon}</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertContainer);

    setTimeout(() => {
        alertContainer.remove();
    }, 5000);
}

console.log('Page Trading chargée avec succès!');
