/**
 * Main Application Entry Point
 * Integra todos los componentes, calculadoras y páginas
 */
import state from './state.js';
import router from './router.js';
import notification from './notification.js';

import { SidebarComponent } from './components/Sidebar.js';
import { HeaderComponent } from './components/Header.js';
import { SearchBarComponent } from './components/SearchBar.js';
import { DashboardPage } from './pages/Dashboard.js';
import { CalculatorCardComponent } from './components/CalculatorCard.js';
import { OhmCalculator } from './calculators/OhmCalculator.js';
import { PowerCalculator } from './calculators/PowerCalculator.js';
import { LedCalculator } from './calculators/LedCalculator.js';
import { SeriesCalculator } from './calculators/SeriesCalculator.js';
import { ParallelCalculator } from './calculators/ParallelCalculator.js';
import { VoltageDividerCalculator } from './calculators/VoltageDividerCalculator.js';
import { RcCalculator } from './calculators/RcCalculator.js';
import { CapacitorCalculator } from './calculators/CapacitorCalculator.js';
import { Lm317Calculator } from './calculators/Lm317Calculator.js';
import { MosfetCalculator } from './calculators/MosfetCalculator.js';
import { AwgCalculator } from './calculators/AwgCalculator.js';
import { BatteryCalculator } from './calculators/BatteryCalculator.js';

class ElectronicaToolkit {
    constructor() {
        this.app = document.getElementById('app');
        this.currentPage = null;
        this.calculators = {
            ohm: new OhmCalculator(state),
            power: new PowerCalculator(state),
            led: new LedCalculator(state),
            series: new SeriesCalculator(state),
            parallel: new ParallelCalculator(state),
            'voltage-divider': new VoltageDividerCalculator(state),
            rc: new RcCalculator(state),
            capacitor: new CapacitorCalculator(state),
            lm317: new Lm317Calculator(state),
            mosfet: new MosfetCalculator(state),
            awg: new AwgCalculator(state),
            battery: new BatteryCalculator(state)
        };
    }

    init() {
        this.setupRouter();
        this.setupStateListener();
        this.renderLayout();
        this.navigateToDashboard();
    }

    setupRouter() {
        router.register('/', () => this.renderDashboard());
        router.register('/favorites', () => this.renderFavorites());
        router.register('/calculator/:calculatorId', (data) => this.renderCalculator(data));
    }

    setupStateListener() {
        state.subscribe(() => {
            this.updateLayout();
        });
    }

    renderLayout() {
        this.app.innerHTML = '';
        this.app.style.display = 'flex';
        this.app.style.height = '100vh';

        // Sidebar
        const sidebar = new SidebarComponent(state);
        const sidebarEl = sidebar.render();
        this.app.appendChild(sidebarEl);

        // Main content
        const mainContent = document.createElement('div');
        mainContent.className = 'main-content';
        mainContent.style.display = 'flex';
        mainContent.style.flexDirection = 'column';
        mainContent.style.flex = '1';

        // Header with back/home and search
        const headerContainer = document.createElement('div');
        headerContainer.className = 'header';
        headerContainer.style.display = 'flex';
        headerContainer.style.alignItems = 'center';
        headerContainer.style.justifyContent = 'space-between';
        headerContainer.style.gap = '1rem';
        headerContainer.style.padding = '1rem 2rem';

        const leftControls = document.createElement('div');
        leftControls.style.display = 'flex';
        leftControls.style.alignItems = 'center';
        leftControls.style.gap = '0.5rem';

        const backBtn = document.createElement('button');
        backBtn.className = 'btn-secondary btn-small';
        backBtn.innerHTML = '← Volver';
        backBtn.addEventListener('click', () => {
            window.history.length > 1 ? window.history.back() : this.navigateToDashboard();
        });

        const homeBtn = document.createElement('button');
        homeBtn.className = 'btn-secondary btn-small';
        homeBtn.innerHTML = '🏠 Inicio';
        homeBtn.addEventListener('click', () => this.navigateToDashboard());

        const favoritesBtn = document.createElement('button');
        favoritesBtn.className = 'btn-secondary btn-small';
        favoritesBtn.innerHTML = '⭐ Favoritos';
        favoritesBtn.addEventListener('click', () => {
            state.setCurrentPage('favorites');
            router.navigate('/favorites', {});
        });

        leftControls.appendChild(backBtn);
        leftControls.appendChild(homeBtn);
        leftControls.appendChild(favoritesBtn);

        const searchBar = new SearchBarComponent(state);
        const searchEl = searchBar.render();

        headerContainer.appendChild(leftControls);
        headerContainer.appendChild(searchEl);

        mainContent.appendChild(headerContainer);

        // Page content
        const pageContainer = document.createElement('div');
        pageContainer.id = 'page-container';
        pageContainer.style.flex = '1';
        pageContainer.style.overflow = 'auto';

        mainContent.appendChild(pageContainer);

        // Footer
        const footer = document.createElement('footer');
        footer.className = 'app-footer';
        footer.innerHTML = `
            <div class="footer-content">
                <p>Desarrollado por Rodrigo Nicolás Mercado © 2026</p>
            </div>
        `;
        mainContent.appendChild(footer);

        this.app.appendChild(mainContent);

        this.pageContainer = pageContainer;
    }

    updateLayout() {
        // El layout se actualiza automáticamente mediante subscripciones
    }

    renderDashboard() {
        const dashboard = new DashboardPage(state);
        const pageEl = dashboard.render();

        this.pageContainer.innerHTML = '';
        this.pageContainer.appendChild(pageEl);
    }

    renderCalculator(data) {
        const calculatorId = data.calculatorId;

        if (!this.calculators[calculatorId]) {
            notification.error(`Calculadora no encontrada: ${calculatorId}`);
            this.navigateToDashboard();
            return;
        }

        const calculator = this.calculators[calculatorId];
        const pageEl = calculator.render();

        this.pageContainer.innerHTML = '';
        this.pageContainer.appendChild(pageEl);
    }

    renderFavorites() {
        const container = document.createElement('div');
        container.className = 'page-favorites';

        const header = new HeaderComponent(state).render('Favoritos');
        container.appendChild(header);

        const content = document.createElement('div');
        content.className = 'content';

        const title = document.createElement('h2');
        title.textContent = '⭐ Tus Favoritos';
        content.appendChild(title);

        const favorites = state.state.favorites || [];

        if (favorites.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.textContent = 'Aún no tienes favoritos. Marca ⭐ en cualquier calculadora para agregarlos.';
            content.appendChild(empty);
        } else {
            const cardComp = new CalculatorCardComponent(state);
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-4';
            const favoritesList = cardComp.calculators.filter(c => favorites.includes(c.id));
            favoritesList.forEach(calc => {
                const card = cardComp.renderCard(calc);
                grid.appendChild(card);
            });
            content.appendChild(grid);
        }

        container.appendChild(content);

        this.pageContainer.innerHTML = '';
        this.pageContainer.appendChild(container);
    }

    navigateToDashboard() {
        state.setCurrentPage('dashboard');
        router.navigate('/', {});
    }
}

// Iniciar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new ElectronicaToolkit();
    app.init();

    const headerComponent = new HeaderComponent(state);
    headerComponent.scheduleSupportModal();

    console.log('%c⚡ Electrónica Toolkit PRO', 'font-size: 20px; color: #6366f1; font-weight: bold;');
    console.log('Aplicación cargada correctamente');
});
