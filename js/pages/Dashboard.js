/**
 * Dashboard Page
 * Página principal con grid de calculadoras
 */
import { CalculatorCardComponent } from '../components/CalculatorCard.js';
import { HeaderComponent } from '../components/Header.js';

export class DashboardPage {
    constructor(state) {
        this.state = state;
    }

    render() {
        const container = document.createElement('div');
        container.className = 'page-dashboard';

        // Header
        const header = new HeaderComponent(this.state).render('Electrónica Toolkit PRO');
        container.appendChild(header);

        // Content
        const content = document.createElement('div');
        content.className = 'content';

        // Welcome section
        const welcomeSection = document.createElement('div');
        welcomeSection.className = 'mb-4';

        const welcomeTitle = document.createElement('h2');
        welcomeTitle.textContent = '¡Bienvenido a tu kit de herramientas electrónicas!';
        welcomeTitle.className = 'animate-fade-in';

        const welcomeDesc = document.createElement('p');
        welcomeDesc.textContent = 'Selecciona una calculadora para comenzar. Puedes marcar como favorito con ⭐ tus herramientas preferidas.';
        welcomeDesc.className = 'text-muted animate-fade-in';

        welcomeSection.appendChild(welcomeTitle);
        welcomeSection.appendChild(welcomeDesc);

        content.appendChild(welcomeSection);

        // Hero section
        const heroSection = document.createElement('div');
        heroSection.className = 'hero-card mb-4';
        heroSection.innerHTML = `
            <div class="hero-badge">🚀</div>
            <div class="hero-copy">
                <h3>Tu ayuda hace esto posible.</h3>
                <p>Ver un video breve sobre nuestra app nos ayuda a sustentar el proyecto y crear más herramientas útiles para todos.</p>
            </div>
        `;
        content.appendChild(heroSection);

        // Support section
        const supportSection = document.createElement('div');
        supportSection.className = 'promo-card mb-4';
        supportSection.innerHTML = `
            <div class="promo-card-badge">💡</div>
            <div class="promo-card-content">
                <h4>¿Nos apoyas?</h4>
                <p>Si te gusta nuestra app y querés colaborar, podés hacerlo <a class="donation-link" href="#" target="_blank" rel="noopener noreferrer">aquí</a>.</p>
            </div>
        `;
        content.appendChild(supportSection);

        // Promo section
        const promoSection = document.createElement('div');
        promoSection.className = 'promo-card mb-4';
        promoSection.innerHTML = `
            <div class="promo-card-badge">✨</div>
            <div class="promo-card-content">
                <h4>Consejo PRO</h4>
                <p>Usa las estrellas ⭐ para guardar tus calculadoras preferidas y accede a ellas desde tu dashboard con un solo toque.</p>
            </div>
        `;
        content.appendChild(promoSection);

        // Favorites section
        const favorites = this.state.state.favorites;
        if (favorites.length > 0) {
            const favoritesSection = document.createElement('div');
            favoritesSection.className = 'mb-4';

            const favoritesTitle = document.createElement('h3');
            favoritesTitle.textContent = '⭐ Favoritos';
            favoritesSection.appendChild(favoritesTitle);

            const favoritesGrid = document.createElement('div');
            favoritesGrid.className = 'grid grid-cols-4 mb-4';

            const cardComponent = new CalculatorCardComponent(this.state);
            const favoritesCalcs = cardComponent.calculators.filter(calc =>
                favorites.includes(calc.id)
            );

            favoritesCalcs.forEach(calc => {
                const card = cardComponent.renderCard(calc);
                favoritesGrid.appendChild(card);
            });

            favoritesSection.appendChild(favoritesGrid);
            content.appendChild(favoritesSection);
        }

        // All calculators section
        const allCalcsSection = document.createElement('div');

        const allCalcsTitle = document.createElement('h3');
        allCalcsTitle.textContent = 'Todas las Calculadoras';
        allCalcsSection.appendChild(allCalcsTitle);

        const cardComponent = new CalculatorCardComponent(this.state);
        const grid = cardComponent.renderAll();
        allCalcsSection.appendChild(grid);

        content.appendChild(allCalcsSection);

        container.appendChild(content);

        return container;
    }
}
