// ==========================================
// INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

// ==========================================
// CONFIGURATION DES EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);
    document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
}

// ==========================================
// SOUMISSION DU FORMULAIRE DE CONTACT
// ==========================================
function handleContactSubmit(e) {
    e.preventDefault();

    const nom = document.getElementById('nomContact').value.trim();
    const email = document.getElementById('emailContact').value.trim();
    const telephone = document.getElementById('telephoneContact').value.trim();
    const sujet = document.getElementById('sujetContact').value;
    const priorite = document.getElementById('prioriteContact').value;
    const message = document.getElementById('messageContact').value.trim();
    const acceptConditions = document.getElementById('acceptConditions').checked;

    // Validation
    if (!nom || !email || !sujet || !message) {
        showAlert('Veuillez remplir tous les champs obligatoires', 'danger');
        return;
    }

    if (message.length < 10) {
        showAlert('Le message doit contenir au moins 10 caractères', 'danger');
        return;
    }

    if (!isValidEmail(email)) {
        showAlert('Veuillez entrer une adresse email valide', 'danger');
        return;
    }

    if (!acceptConditions) {
        showAlert('Vous devez accepter les conditions d\'utilisation', 'danger');
        return;
    }

    // Préparation des données
    const formData = {
        nom,
        email,
        telephone,
        sujet,
        priorite,
        message,
        date: new Date().toLocaleString('fr-FR'),
        statut: 'En attente'
    };

    // Affichage du succès
    showAlert(
        `Merci ${nom}! Votre message a été envoyé avec succès. Nous vous répondrons dans les 24 heures.`,
        'success'
    );

    console.log('Message envoyé:', formData);

    // Réinitialisation du formulaire
    document.getElementById('contactForm').reset();

    // Optionnel: Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// SOUMISSION DU FORMULAIRE DE CONNEXION
// ==========================================
function handleLoginSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showAlert('Veuillez remplir tous les champs', 'danger');
        return;
    }

    if (!isValidEmail(email)) {
        showAlert('Veuillez entrer une adresse email valide', 'danger');
        return;
    }

    showAlert(`Bienvenue! Vous êtes connecté avec l'email: ${email}`, 'success');
    
    // Ferme la modale
    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    modal.hide();
    
    document.getElementById('loginForm').reset();
}

// ==========================================
// FONCTIONS UTILITAIRES
// ==========================================

/**
 * Affiche une alerte à l'écran
 */
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

    // Supprime l'alerte après 5 secondes
    setTimeout(() => {
        alertContainer.remove();
    }, 5000);
}

/**
 * Valide une adresse email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ==========================================
// VALIDATION EN TEMPS RÉEL
// ==========================================
const emailInput = document.getElementById('emailContact');
if (emailInput) {
    emailInput.addEventListener('blur', function() {
        if (this.value && !isValidEmail(this.value)) {
            this.classList.add('is-invalid');
            showAlert('Format d\'email invalide', 'warning');
        } else {
            this.classList.remove('is-invalid');
        }
    });
}

const messageInput = document.getElementById('messageContact');
if (messageInput) {
    messageInput.addEventListener('input', function() {
        const count = this.value.length;
        const min = 10;
        if (count < min) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });
}

// ==========================================
// ANIMATION DES CARTES AU SCROLL
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

document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

console.log('Page Contact chargée avec succès!');
