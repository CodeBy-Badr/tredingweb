// ==========================================
// DONNÉES DE CRYPTOMONNAIES
// ==========================================
const cryptos = [
    {
        id: 1,
        name: 'Bitcoin',
        symbol: 'BTC',
        price: 45234,
        change24h: 2.5,
        volume24h: '28.5B',
        marketCap: '880.5B',
        icon: '₿'
    },
    {
        id: 2,
        name: 'Ethereum',
        symbol: 'ETH',
        price: 3000,
        change24h: -1.2,
        volume24h: '15.8B',
        marketCap: '360B',
        icon: 'Ξ'
    },
    {
        id: 3,
        name: 'Binance Coin',
        symbol: 'BNB',
        price: 620,
        change24h: 3.8,
        volume24h: '1.2B',
        marketCap: '95.5B',
        icon: '⬤'
    },
    {
        id: 4,
        name: 'Ripple',
        symbol: 'XRP',
        price: 2.45,
        change24h: 5.2,
        volume24h: '2.3B',
        marketCap: '133B',
        icon: '✕'
    },
    {
        id: 5,
        name: 'Cardano',
        symbol: 'ADA',
        price: 1.12,
        change24h: 1.5,
        volume24h: '890M',
        marketCap: '40.5B',
        icon: '₳'
    },
    {
        id: 6,
        name: 'Solana',
        symbol: 'SOL',
        price: 195,
        change24h: 4.2,
        volume24h: '3.5B',
        marketCap: '68B',
        icon: '◎'
    }
];

// ==========================================
// INITIALISATION LORS DU CHARGEMENT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadCryptoTable();
    setupEventListeners();
    updateTotalEstimate();
    updatePrices();
    // Met à jour les prix toutes les 5 secondes
    setInterval(updatePrices, 5000);
});

// ==========================================
// CHARGEMENT DU TABLEAU DES CRYPTOMONNAIES
// ==========================================
function loadCryptoTable() {
    const tableBody = document.getElementById('cryptoTable');
    tableBody.innerHTML = '';

    cryptos.forEach(crypto => {
        const changeColor = crypto.change24h >= 0 ? 'text-success' : 'text-danger';
        const changeIcon = crypto.change24h >= 0 ? '↑' : '↓';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <strong>${crypto.symbol}</strong><br>
                <small class="text-muted">${crypto.name}</small>
            </td>
            <td><strong>$${crypto.price.toLocaleString()}</strong></td>
            <td class="${changeColor}">
                ${changeIcon} ${crypto.change24h}%
            </td>
            <td>${crypto.volume24h}</td>
            <td>${crypto.marketCap}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="selectCrypto('${crypto.symbol}', ${crypto.price})">
                    Trader
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// ==========================================
// CONFIGURATION DES EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    // Événement pour la sélection de crypto
    document.getElementById('cryptoSelect').addEventListener('change', (e) => {
        const selected = cryptos.find(c => c.name === e.target.value);
        if (selected) {
            document.getElementById('price').value = selected.price;
            updateTotalEstimate();
        }
    });

    // Événement pour le calcul du total
    document.getElementById('price').addEventListener('input', updateTotalEstimate);
    document.getElementById('quantity').addEventListener('input', updateTotalEstimate);

    // Formulaire de trading
    document.getElementById('tradingForm').addEventListener('submit', handleTradingSubmit);

    // Formulaire de contact
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);

    // Formulaire de connexion
    document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);

    // Formulaire d'inscription
    document.getElementById('registerForm').addEventListener('submit', handleRegisterSubmit);

    // Formulaire de dépôt
    document.getElementById('depotForm').addEventListener('submit', handleDepotSubmit);

    // Formulaire de retrait
    document.getElementById('retraitForm').addEventListener('submit', handleRetraitSubmit);

    // Recherche de cryptomonnaies
    document.getElementById('searchCrypto').addEventListener('input', filterCryptos);

    // Filtres
    document.getElementById('filterCrypto').addEventListener('change', filterCryptos);
    document.getElementById('sortCrypto').addEventListener('change', sortCryptos);
}

// ==========================================
// MISE À JOUR DU TOTAL ESTIMÉ
// ==========================================
function updateTotalEstimate() {
    const price = parseFloat(document.getElementById('price').value) || 0;
    const quantity = parseFloat(document.getElementById('quantity').value) || 0;
    const total = (price * quantity).toFixed(2);
    document.getElementById('totalEstimate').textContent = `$${parseFloat(total).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// ==========================================
// MISE À JOUR DES PRIX EN TEMPS RÉEL
// ==========================================
function updatePrices() {
    // Simule une mise à jour des prix (variation aléatoire)
    cryptos.forEach(crypto => {
        const variation = (Math.random() - 0.5) * 2; // Entre -1 et 1
        crypto.price += variation;
        crypto.price = Math.max(0, crypto.price); // S'assure que le prix ne soit pas négatif
    });
    
    loadCryptoTable();
    
    // Met à jour le prix du BTC en haut
    const btcPrice = cryptos.find(c => c.symbol === 'BTC');
    if (btcPrice) {
        document.getElementById('btcPrice').textContent = `$${btcPrice.price.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }
}

// ==========================================
// SÉLECTION D'UNE CRYPTOMONNAIE
// ==========================================
function selectCrypto(symbol, price) {
    const crypto = cryptos.find(c => c.symbol === symbol);
    document.getElementById('cryptoSelect').value = crypto.name;
    document.getElementById('price').value = price.toFixed(2);
    updateTotalEstimate();
    
    // Fait défiler jusqu'au formulaire de trading
    document.getElementById('trading').scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// FILTRAGE DES CRYPTOMONNAIES
// ==========================================
function filterCryptos() {
    const searchTerm = document.getElementById('searchCrypto').value.toLowerCase();
    const filterValue = document.getElementById('filterCrypto').value;
    
    const filtered = cryptos.filter(crypto => {
        const matchesSearch = crypto.name.toLowerCase().includes(searchTerm) || 
                             crypto.symbol.toLowerCase().includes(searchTerm);
        const matchesFilter = !filterValue || crypto.name === filterValue;
        return matchesSearch && matchesFilter;
    });

    displayFilteredCryptos(filtered);
}

// ==========================================
// TRI DES CRYPTOMONNAIES
// ==========================================
function sortCryptos() {
    const sortValue = document.getElementById('sortCrypto').value;
    let sorted = [...cryptos];

    if (sortValue === 'prix') {
        sorted.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'variation') {
        sorted.sort((a, b) => b.change24h - a.change24h);
    } else if (sortValue === 'volume') {
        sorted.sort((a, b) => {
            const aVol = parseFloat(a.volume24h);
            const bVol = parseFloat(b.volume24h);
            return bVol - aVol;
        });
    }

    displayFilteredCryptos(sorted);
}

// ==========================================
// AFFICHAGE DES CRYPTOMONNAIES FILTRÉES
// ==========================================
function displayFilteredCryptos(filtered) {
    const tableBody = document.getElementById('cryptoTable');
    tableBody.innerHTML = '';

    filtered.forEach(crypto => {
        const changeColor = crypto.change24h >= 0 ? 'text-success' : 'text-danger';
        const changeIcon = crypto.change24h >= 0 ? '↑' : '↓';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <strong>${crypto.symbol}</strong><br>
                <small class="text-muted">${crypto.name}</small>
            </td>
            <td><strong>$${crypto.price.toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}</strong></td>
            <td class="${changeColor}">
                ${changeIcon} ${crypto.change24h}%
            </td>
            <td>${crypto.volume24h}</td>
            <td>${crypto.marketCap}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="selectCrypto('${crypto.symbol}', ${crypto.price})">
                    Trader
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// ==========================================
// GESTION DES FORMULAIRES
// ==========================================

// Soumission du formulaire de trading
function handleTradingSubmit(e) {
    e.preventDefault();

    const orderType = document.querySelector('input[name="orderType"]:checked').value;
    const crypto = document.getElementById('cryptoSelect').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseFloat(document.getElementById('quantity').value);
    const orderTypeSelect = document.getElementById('orderTypeSelect').value;

    if (!crypto || !price || !quantity) {
        showAlert('Veuillez remplir tous les champs', 'danger');
        return;
    }

    const total = (price * quantity).toFixed(2);
    const message = `
        Ordre ${orderType.toUpperCase()} confirmé!
        ${crypto}: ${quantity} unités à $${price}
        Total: $${total}
        Type: ${orderTypeSelect}
    `;

    showAlert(message, 'success');
    document.getElementById('tradingForm').reset();
    updateTotalEstimate();
}

// Soumission du formulaire de contact
function handleContactSubmit(e) {
    e.preventDefault();

    const nom = document.getElementById('nomContact').value;
    const email = document.getElementById('emailContact').value;
    const sujet = document.getElementById('sujetContact').value;
    const message = document.getElementById('messageContact').value;

    if (!nom || !email || !sujet || !message) {
        showAlert('Veuillez remplir tous les champs', 'danger');
        return;
    }

    showAlert(`Merci ${nom}! Votre message a été envoyé avec succès.`, 'success');
    document.getElementById('contactForm').reset();
}

// Soumission du formulaire de connexion
function handleLoginSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showAlert('Veuillez remplir tous les champs', 'danger');
        return;
    }

    showAlert(`Bienvenue! Vous êtes connecté avec l'email: ${email}`, 'success');
    
    // Ferme la modale
    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    modal.hide();
    
    document.getElementById('loginForm').reset();
}

// Soumission du formulaire d'inscription
function handleRegisterSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

    if (!name || !email || !password || !passwordConfirm) {
        showAlert('Veuillez remplir tous les champs', 'danger');
        return;
    }

    if (password !== passwordConfirm) {
        showAlert('Les mots de passe ne correspondent pas', 'danger');
        return;
    }

    showAlert(`Inscription réussie! Bienvenue ${name}!`, 'success');
    
    // Ferme la modale
    const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    modal.hide();
    
    document.getElementById('registerForm').reset();
}

// Soumission du formulaire de dépôt
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

    showAlert(`
        Dépôt de $${montant.toFixed(2)} via ${methode}
        Frais: $${frais}
        Montant final: $${montantFinal}
        Statut: En attente...
    `, 'info');

    document.getElementById('depotForm').reset();

    // Ferme l'offcanvas
    const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('deposer'));
    if (offcanvas) {
        offcanvas.hide();
    }
}

// Soumission du formulaire de retrait
function handleRetraitSubmit(e) {
    e.preventDefault();

    const methode = document.getElementById('methodeRetrait').value;
    const montant = parseFloat(document.getElementById('montantRetrait').value);
    const adresse = document.getElementById('adresseRetrait').value;

    if (!methode || !montant || !adresse) {
        showAlert('Veuillez remplir tous les champs', 'danger');
        return;
    }

    const soldeTotal = 10000; // Solde fictif
    if (montant > soldeTotal) {
        showAlert('Solde insuffisant', 'danger');
        return;
    }

    const frais = (montant * 0.005).toFixed(2);
    const montantFinal = (montant - parseFloat(frais)).toFixed(2);

    showAlert(`
        Retrait de $${montant.toFixed(2)} via ${methode}
        Frais: $${frais}
        Montant reçu: $${montantFinal}
        Statut: En attente de confirmation...
    `, 'info');

    document.getElementById('retraitForm').reset();

    // Ferme l'offcanvas
    const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('retrait'));
    if (offcanvas) {
        offcanvas.hide();
    }
}

// ==========================================
// FONCTIONS UTILITAIRES
// ==========================================

// Affiche une alerte
function showAlert(message, type = 'info') {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show`;
    alertContainer.setAttribute('role', 'alert');
    alertContainer.innerHTML = `
        <strong>${type === 'success' ? '✓ Succès!' : type === 'danger' ? '✗ Erreur!' : 'ℹ Info'}</strong>
        <div>${message}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Insère l'alerte en haut du body
    document.body.insertBefore(alertContainer, document.body.firstChild);

    // Fait défiler vers l'alerte
    alertContainer.scrollIntoView({ behavior: 'smooth' });

    // Supprime l'alerte après 5 secondes
    setTimeout(() => {
        alertContainer.remove();
    }, 5000);
}

// ==========================================
// ANIMATION AU SCROLL
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe toutes les cartes
document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// ==========================================
// NAVIGATION SMOOTH
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// FERMETURE DU MENU MOBILE AU CLIC SUR UN LIEN
// ==========================================
document.querySelectorAll('.navbar-nav a').forEach(link => {
    link.addEventListener('click', () => {
        const navbar = document.querySelector('.navbar-collapse');
        if (navbar.classList.contains('show')) {
            bootstrap.Collapse.getInstance(navbar).hide();
        }
    });
});

// ==========================================
// MISE À JOUR DU SOLDE TOTAL
// ==========================================
function updateTotalBalance() {
    // Simule une mise à jour du solde basée sur les prix
    let total = 0;
    cryptos.forEach(crypto => {
        if (crypto.symbol === 'BTC') total += 0.5 * crypto.price;
        else if (crypto.symbol === 'ETH') total += 5 * crypto.price;
        else if (crypto.symbol === 'BNB') total += 20 * crypto.price;
    });
    total += 5183; // USD en portefeuille
    
    document.getElementById('totalBalance').textContent = `$${total.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// Mise à jour du solde toutes les 5 secondes aussi
setInterval(updateTotalBalance, 5000);

// ==========================================
// VALIDATION EN TEMPS RÉEL DES FORMULAIRES
// ==========================================
document.querySelectorAll('.form-control, .form-select').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value) {
            this.classList.add('is-invalid');
        } else if (this.type === 'email' && !isValidEmail(this.value)) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
        }
    });

    input.addEventListener('input', function() {
        if (this.classList.contains('is-invalid')) {
            this.classList.remove('is-invalid');
        }
    });
});

// Valide un email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ==========================================
// MODE SOMBRE/CLAIR (OPTIONNEL)
// ==========================================
function initDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

initDarkMode();

console.log('Site de trading CryptoTrade chargé avec succès!');
