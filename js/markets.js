// ==========================================
// DONNÉES DES CRYPTOMONNAIES ÉTENDUES
// ==========================================
const extendedCryptos = [
    { rank: 1, name: 'Bitcoin', symbol: 'BTC', price: 45234.50, change24h: 2.5, change7d: 8.3, volume24h: '28.5B', marketCap: '880.5B', category: 'Layer1', isFavorite: true, inWatchlist: true },
    { rank: 2, name: 'Ethereum', symbol: 'ETH', price: 3000.75, change24h: -1.2, change7d: 5.2, volume24h: '15.8B', marketCap: '360B', category: 'Layer1', isFavorite: true, inWatchlist: true },
    { rank: 3, name: 'Binance Coin', symbol: 'BNB', price: 620.30, change24h: 3.8, change7d: 12.1, volume24h: '1.2B', marketCap: '95.5B', category: 'Layer1', isFavorite: true, inWatchlist: false },
    { rank: 4, name: 'Ripple', symbol: 'XRP', price: 2.45, change24h: 5.2, change7d: 15.8, volume24h: '2.3B', marketCap: '133B', category: 'DeFi', isFavorite: false, inWatchlist: true },
    { rank: 5, name: 'Cardano', symbol: 'ADA', price: 1.12, change24h: 1.5, change7d: 4.2, volume24h: '890M', marketCap: '40.5B', category: 'Layer1', isFavorite: false, inWatchlist: true },
    { rank: 6, name: 'Solana', symbol: 'SOL', price: 195.40, change24h: 4.2, change7d: 18.5, volume24h: '3.5B', marketCap: '68B', category: 'Layer1', isFavorite: false, inWatchlist: false },
    { rank: 7, name: 'Polkadot', symbol: 'DOT', price: 9.85, change24h: 2.1, change7d: 6.7, volume24h: '620M', marketCap: '15.2B', category: 'Layer2', isFavorite: false, inWatchlist: false },
    { rank: 8, name: 'Uniswap', symbol: 'UNI', price: 8.42, change24h: -2.3, change7d: 3.2, volume24h: '540M', marketCap: '9.8B', category: 'DeFi', isFavorite: false, inWatchlist: false },
    { rank: 9, name: 'Litecoin', symbol: 'LTC', price: 95.60, change24h: 1.8, change7d: 7.5, volume24h: '890M', marketCap: '14.5B', category: 'Layer1', isFavorite: false, inWatchlist: false },
    { rank: 10, name: 'Link', symbol: 'LINK', price: 28.95, change24h: 0.5, change7d: 2.1, volume24h: '450M', marketCap: '14.2B', category: 'DeFi', isFavorite: false, inWatchlist: false },
    { rank: 11, name: 'Dogecoin', symbol: 'DOGE', price: 0.38, change24h: 3.2, change7d: 9.8, volume24h: '1.8B', marketCap: '55.3B', category: 'Layer1', isFavorite: false, inWatchlist: false },
    { rank: 12, name: 'Polygon', symbol: 'MATIC', price: 0.85, change24h: 2.7, change7d: 11.3, volume24h: '380M', marketCap: '9.2B', category: 'Layer2', isFavorite: false, inWatchlist: false },
    { rank: 13, name: 'Aave', symbol: 'AAVE', price: 285.40, change24h: -1.5, change7d: 5.9, volume24h: '320M', marketCap: '4.2B', category: 'DeFi', isFavorite: false, inWatchlist: false },
    { rank: 14, name: 'Cosmos', symbol: 'ATOM', price: 12.35, change24h: 4.1, change7d: 8.6, volume24h: '280M', marketCap: '6.8B', category: 'Layer1', isFavorite: false, inWatchlist: false },
    { rank: 15, name: 'Ethereum Classic', symbol: 'ETC', price: 32.80, change24h: 1.9, change7d: 3.4, volume24h: '210M', marketCap: '4.5B', category: 'Layer1', isFavorite: false, inWatchlist: false },
];

let filteredCryptos = [...extendedCryptos];
let currentSort = 'market-cap';
let currentPage = 1;
let itemsPerPage = 25;

// ==========================================
// INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadCryptoTable();
    setupEventListeners();
    updateMarketStats();
});

// ==========================================
// CONFIGURATION DES EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    document.getElementById('searchCrypto').addEventListener('input', applyFilters);
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('sortBy').addEventListener('change', handleSort);
    document.getElementById('displayCount').addEventListener('change', handleDisplayCount);
    
    document.getElementById('convertFrom').addEventListener('change', updateConversion);
    document.getElementById('convertFromAmount').addEventListener('input', updateConversion);
    document.getElementById('convertTo').addEventListener('change', updateConversion);
    
    document.getElementById('alertForm').addEventListener('submit', handleAlertSubmit);
    document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
}

// ==========================================
// CHARGEMENT DU TABLEAU
// ==========================================
function loadCryptoTable() {
    const tableBody = document.getElementById('cryptoTableBody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCryptos = filteredCryptos.slice(startIndex, endIndex);

    paginatedCryptos.forEach((crypto, index) => {
        const changeColor24h = crypto.change24h >= 0 ? 'text-success' : 'text-danger';
        const changeColor7d = crypto.change7d >= 0 ? 'text-success' : 'text-danger';
        const changeIcon24h = crypto.change24h >= 0 ? '↑' : '↓';
        const changeIcon7d = crypto.change7d >= 0 ? '↑' : '↓';
        const starIcon = crypto.isFavorite ? 'star-fill text-warning' : 'star';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${crypto.rank}</strong></td>
            <td>
                <button class="btn btn-sm btn-link p-0" onclick="toggleFavorite(${crypto.rank})">
                    <i class="bi bi-${starIcon}"></i>
                </button>
            </td>
            <td>
                <strong>${crypto.symbol}</strong><br>
                <small class="text-muted">${crypto.name}</small>
            </td>
            <td><strong>$${crypto.price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
            <td class="${changeColor24h}">
                ${changeIcon24h} ${Math.abs(crypto.change24h).toFixed(2)}%
            </td>
            <td class="${changeColor7d}">
                ${changeIcon7d} ${Math.abs(crypto.change7d).toFixed(2)}%
            </td>
            <td>${crypto.volume24h}</td>
            <td>${crypto.marketCap}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="goToTrading('${crypto.symbol}', ${crypto.price})">
                    Trader
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    loadFavoritesTable();
    loadWatchlistTable();
}

// ==========================================
// CHARGEMENT DES FAVORIS
// ==========================================
function loadFavoritesTable() {
    const tableBody = document.getElementById('favoritesTableBody');
    tableBody.innerHTML = '';

    const favorites = filteredCryptos.filter(c => c.isFavorite);

    favorites.forEach((crypto) => {
        const changeColor24h = crypto.change24h >= 0 ? 'text-success' : 'text-danger';
        const changeColor7d = crypto.change7d >= 0 ? 'text-success' : 'text-danger';
        const changeIcon24h = crypto.change24h >= 0 ? '↑' : '↓';
        const changeIcon7d = crypto.change7d >= 0 ? '↑' : '↓';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${crypto.rank}</strong></td>
            <td>
                <button class="btn btn-sm btn-link p-0" onclick="toggleFavorite(${crypto.rank})">
                    <i class="bi bi-star-fill text-warning"></i>
                </button>
            </td>
            <td>
                <strong>${crypto.symbol}</strong><br>
                <small class="text-muted">${crypto.name}</small>
            </td>
            <td><strong>$${crypto.price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
            <td class="${changeColor24h}">
                ${changeIcon24h} ${Math.abs(crypto.change24h).toFixed(2)}%
            </td>
            <td class="${changeColor7d}">
                ${changeIcon7d} ${Math.abs(crypto.change7d).toFixed(2)}%
            </td>
            <td>${crypto.volume24h}</td>
            <td>${crypto.marketCap}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="goToTrading('${crypto.symbol}', ${crypto.price})">
                    Trader
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// ==========================================
// CHARGEMENT DE LA WATCHLIST
// ==========================================
function loadWatchlistTable() {
    const tableBody = document.getElementById('watchlistTableBody');
    tableBody.innerHTML = '';

    const watchlist = filteredCryptos.filter(c => c.inWatchlist);

    watchlist.forEach((crypto) => {
        const changeColor24h = crypto.change24h >= 0 ? 'text-success' : 'text-danger';
        const changeColor7d = crypto.change7d >= 0 ? 'text-success' : 'text-danger';
        const changeIcon24h = crypto.change24h >= 0 ? '↑' : '↓';
        const changeIcon7d = crypto.change7d >= 0 ? '↑' : '↓';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${crypto.rank}</strong></td>
            <td>
                <button class="btn btn-sm btn-link p-0" onclick="toggleWatchlist(${crypto.rank})">
                    <i class="bi bi-eye"></i>
                </button>
            </td>
            <td>
                <strong>${crypto.symbol}</strong><br>
                <small class="text-muted">${crypto.name}</small>
            </td>
            <td><strong>$${crypto.price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
            <td class="${changeColor24h}">
                ${changeIcon24h} ${Math.abs(crypto.change24h).toFixed(2)}%
            </td>
            <td class="${changeColor7d}">
                ${changeIcon7d} ${Math.abs(crypto.change7d).toFixed(2)}%
            </td>
            <td>${crypto.volume24h}</td>
            <td>${crypto.marketCap}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="goToTrading('${crypto.symbol}', ${crypto.price})">
                    Trader
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// ==========================================
// FILTRAGE ET TRI
// ==========================================
function applyFilters() {
    const searchTerm = document.getElementById('searchCrypto').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    filteredCryptos = extendedCryptos.filter(crypto => {
        const matchesSearch = crypto.name.toLowerCase().includes(searchTerm) || 
                             crypto.symbol.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || crypto.category === category;
        return matchesSearch && matchesCategory;
    });

    currentPage = 1;
    applySorting();
    loadCryptoTable();
}

function handleSort() {
    currentSort = document.getElementById('sortBy').value;
    currentPage = 1;
    applySorting();
    loadCryptoTable();
}

function applySorting() {
    switch(currentSort) {
        case 'price-high':
            filteredCryptos.sort((a, b) => b.price - a.price);
            break;
        case 'price-low':
            filteredCryptos.sort((a, b) => a.price - b.price);
            break;
        case 'volume':
            filteredCryptos.sort((a, b) => {
                const aVol = parseFloat(a.volume24h);
                const bVol = parseFloat(b.volume24h);
                return bVol - aVol;
            });
            break;
        case 'change-high':
            filteredCryptos.sort((a, b) => b.change24h - a.change24h);
            break;
        case 'change-low':
            filteredCryptos.sort((a, b) => a.change24h - b.change24h);
            break;
        case 'gainers':
            filteredCryptos.sort((a, b) => b.change24h - a.change24h);
            break;
        case 'losers':
            filteredCryptos.sort((a, b) => a.change24h - b.change24h);
            break;
        default: // market-cap
            filteredCryptos.sort((a, b) => b.rank - a.rank);
    }
}

function handleDisplayCount() {
    const count = document.getElementById('displayCount').value;
    if (count === 'all') {
        itemsPerPage = extendedCryptos.length;
    } else {
        itemsPerPage = parseInt(count);
    }
    currentPage = 1;
    loadCryptoTable();
}

// ==========================================
// FAVORIS ET WATCHLIST
// ==========================================
function toggleFavorite(rank) {
    const crypto = extendedCryptos.find(c => c.rank === rank);
    if (crypto) {
        crypto.isFavorite = !crypto.isFavorite;
        loadCryptoTable();
        showAlert('Favori mis à jour!', 'success');
    }
}

function toggleWatchlist(rank) {
    const crypto = extendedCryptos.find(c => c.rank === rank);
    if (crypto) {
        crypto.inWatchlist = !crypto.inWatchlist;
        loadCryptoTable();
        showAlert('Watchlist mise à jour!', 'success');
    }
}

// ==========================================
// RÉINITIALISER LES FILTRES
// ==========================================
function resetFilters() {
    document.getElementById('searchCrypto').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('sortBy').value = 'market-cap';
    document.getElementById('displayCount').value = '25';
    
    filteredCryptos = [...extendedCryptos];
    currentSort = 'market-cap';
    currentPage = 1;
    itemsPerPage = 25;
    
    loadCryptoTable();
    showAlert('Filtres réinitialisés!', 'info');
}

// ==========================================
// CONVERTISSEUR
// ==========================================
const exchangeRates = {
    'BTC': 45234.50,
    'ETH': 3000.75,
    'BNB': 620.30,
    'USD': 1
};

function updateConversion() {
    const from = document.getElementById('convertFrom').value;
    const to = document.getElementById('convertTo').value;
    const amount = parseFloat(document.getElementById('convertFromAmount').value) || 0;

    const rateFrom = exchangeRates[from] || 1;
    const rateTo = exchangeRates[to] || 1;
    
    const result = (amount * rateFrom / rateTo).toFixed(4);
    document.getElementById('convertToAmount').value = result;
}

function swapConverter() {
    const from = document.getElementById('convertFrom').value;
    const to = document.getElementById('convertTo').value;
    
    document.getElementById('convertFrom').value = to;
    document.getElementById('convertTo').value = from;
    
    updateConversion();
}

// ==========================================
// ALERTES DE PRIX
// ==========================================
function handleAlertSubmit(e) {
    e.preventDefault();

    const crypto = document.getElementById('alertCrypto').value;
    const type = document.getElementById('alertType').value;
    const price = parseFloat(document.getElementById('alertPrice').value);

    if (!crypto || !price) {
        showAlert('Veuillez remplir tous les champs', 'danger');
        return;
    }

    const typeText = type === 'above' ? 'au-dessus de' : 'au-dessous de';
    showAlert(`Alerte créée: ${crypto} ${typeText} $${price}`, 'success');
    
    document.getElementById('alertForm').reset();
}

// ==========================================
// STATISTIQUES DU MARCHÉ
// ==========================================
function updateMarketStats() {
    // Cette fonction peut être étendue pour afficher des stats en temps réel
    console.log('Statistiques du marché mises à jour');
}

// ==========================================
// NAVIGATION
// ==========================================
function goToTrading(symbol, price) {
    // Redirige vers la page d'accueil avec les paramètres
    window.location.href = `index.html#trading?crypto=${symbol}&price=${price}`;
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

function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    showAlert(`Connecté avec: ${email}`, 'success');
    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    modal.hide();
    document.getElementById('loginForm').reset();
}

// Initialiser la conversion
updateConversion();

console.log('Page Marchés chargée avec succès!');
