// ==========================================
// DONNÉES DU PORTEFEUILLE
// ==========================================
const portfolioAssets = [
    {
        symbol: 'BTC',
        name: 'Bitcoin',
        quantity: 0.5,
        priceUnit: 45234.50,
        percentage: 45,
        change24h: 2.5
    },
    {
        symbol: 'ETH',
        name: 'Ethereum',
        quantity: 5,
        priceUnit: 3000.75,
        percentage: 30,
        change24h: -1.2
    },
    {
        symbol: 'BNB',
        name: 'Binance Coin',
        quantity: 20,
        priceUnit: 620.30,
        percentage: 12,
        change24h: 3.8
    },
    {
        symbol: 'ADA',
        name: 'Cardano',
        quantity: 100,
        priceUnit: 1.12,
        percentage: 5,
        change24h: 1.5
    }
];

// ==========================================
// INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadAssetsTable();
    setupEventListeners();
});

// ==========================================
// CONFIGURATION DES EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    document.getElementById('depotForm').addEventListener('submit', handleDepotSubmit);
    document.getElementById('retraitForm').addEventListener('submit', handleRetraitSubmit);
    document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
}

// ==========================================
// CHARGEMENT DU TABLEAU DES ACTIFS
// ==========================================
function loadAssetsTable() {
    const tableBody = document.getElementById('assetsTableBody');
    tableBody.innerHTML = '';

    let totalValue = 0;

    portfolioAssets.forEach((asset) => {
        const totalAssetValue = asset.quantity * asset.priceUnit;
        totalValue += totalAssetValue;

        const changeColor = asset.change24h >= 0 ? 'text-success' : 'text-danger';
        const changeIcon = asset.change24h >= 0 ? '↑' : '↓';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <strong>${asset.symbol}</strong><br>
                <small class="text-muted">${asset.name}</small>
            </td>
            <td>${asset.quantity.toFixed(4)}</td>
            <td>$${asset.priceUnit.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td><strong>$${totalAssetValue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
            <td class="${changeColor}">
                ${changeIcon} ${Math.abs(asset.change24h).toFixed(2)}%
            </td>
            <td>
                <span class="badge bg-primary">${asset.percentage}%</span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editAsset('${asset.symbol}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="removeAsset('${asset.symbol}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Ajouter cash
    const cashRow = document.createElement('tr');
    cashRow.innerHTML = `
        <td>
            <strong>USD</strong><br>
            <small class="text-muted">Cash Disponible</small>
        </td>
        <td>5183</td>
        <td>$1.00</td>
        <td><strong>$5,183.00</strong></td>
        <td class="text-success">
            ↑ 0.00%
        </td>
        <td>
            <span class="badge bg-secondary">8%</span>
        </td>
        <td>
            <button class="btn btn-sm btn-info">
                <i class="bi bi-arrow-left-right"></i>
            </button>
        </td>
    `;
    tableBody.appendChild(cashRow);
}

// ==========================================
// ÉDITION D'UN ACTIF
// ==========================================
function editAsset(symbol) {
    showAlert(`Édition de ${symbol} - Fonctionnalité à venir`, 'info');
}

// ==========================================
// SUPPRESSION D'UN ACTIF
// ==========================================
function removeAsset(symbol) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${symbol} de votre portefeuille?`)) {
        const index = portfolioAssets.findIndex(a => a.symbol === symbol);
        if (index > -1) {
            portfolioAssets.splice(index, 1);
            loadAssetsTable();
            showAlert(`${symbol} a été supprimé du portefeuille`, 'success');
        }
    }
}

// ==========================================
// DÉPÔT
// ==========================================
function handleDepotSubmit(e) {
    e.preventDefault();

    const methode = document.getElementById('methodeDpot').value;
    const montant = parseFloat(document.getElementById('montantDpot').value);

    if (!methode || !montant || montant <= 0) {
        showAlert('Veuillez remplir tous les champs correctement', 'danger');
        return;
    }

    const frais = (montant * 0.01).toFixed(2);
    const montantFinal = (montant + parseFloat(frais)).toFixed(2);

    showAlert(`Dépôt de $${montant.toFixed(2)} via ${methode} - Frais: $${frais}`, 'success');
    document.getElementById('depotForm').reset();

    const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('deposer'));
    if (offcanvas) offcanvas.hide();
}

// ==========================================
// RETRAIT
// ==========================================
function handleRetraitSubmit(e) {
    e.preventDefault();

    const methode = document.getElementById('methodeRetrait').value;
    const montant = parseFloat(document.getElementById('montantRetrait').value);
    const adresse = document.getElementById('adresseRetrait').value;

    if (!methode || !montant || !adresse) {
        showAlert('Veuillez remplir tous les champs', 'danger');
        return;
    }

    const soldeTotal = 51183;
    if (montant > soldeTotal) {
        showAlert('Solde insuffisant', 'danger');
        return;
    }

    const frais = (montant * 0.005).toFixed(2);
    const montantFinal = (montant - parseFloat(frais)).toFixed(2);

    showAlert(`Retrait de $${montant.toFixed(2)} - Frais: $${frais} - Reçu: $${montantFinal}`, 'success');
    document.getElementById('retraitForm').reset();

    const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('retrait'));
    if (offcanvas) offcanvas.hide();
}

// ==========================================
// TRANSFERT
// ==========================================
function transferModal() {
    showAlert('Fonction de transfert en cours de développement', 'info');
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
    alertContainer.innerHTML = `
        <strong>${type === 'success' ? '✓' : type === 'danger' ? '✗' : 'ℹ'}</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.insertBefore(alertContainer, document.body.firstChild);
    setTimeout(() => alertContainer.remove(), 5000);
}

console.log('Page Portefeuille chargée avec succès!');
