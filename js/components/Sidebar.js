/**
 * Sidebar Component
 * Navegación lateral con categorías
 */
import router from '../router.js';
import notification from '../notification.js';

export class SidebarComponent {
    constructor(state) {
        this.state = state;
        this.calculators = [
            {
                id: 'ohm',
                name: 'Ley de Ohm',
                category: 'Básico',
                categoryIcon: '⚡',
                icon: '⚙'
            },
            {
                id: 'power',
                name: 'Potencia',
                category: 'Básico',
                categoryIcon: '⚡',
                icon: '🔌'
            },
            {
                id: 'led',
                name: 'Resistencia LED',
                category: 'LEDs',
                categoryIcon: '🔴',
                icon: '💡'
            },
            {
                id: 'series',
                name: 'Resistencias Serie',
                category: 'Resistencias',
                categoryIcon: '📏',
                icon: '〰'
            },
            {
                id: 'parallel',
                name: 'Resistencias Paralelo',
                category: 'Resistencias',
                categoryIcon: '📏',
                icon: '⫽'
            },
            {
                id: 'voltage-divider',
                name: 'Divisor de Tensión',
                category: 'Resistencias',
                categoryIcon: '📏',
                icon: '⊕'
            },
            {
                id: 'rc',
                name: 'RC',
                category: 'Capacitores',
                categoryIcon: '🧲',
                icon: '⏱'
            },
            {
                id: 'capacitor',
                name: 'Conversor Capacitores',
                category: 'Capacitores',
                categoryIcon: '🧲',
                icon: '📦'
            },
            {
                id: 'lm317',
                name: 'LM317',
                category: 'Fuentes',
                categoryIcon: '🔋',
                icon: '🔩'
            },
            {
                id: 'mosfet',
                name: 'MOSFET',
                category: 'Fuentes',
                categoryIcon: '🔋',
                icon: '🎛'
            },
            {
                id: 'battery',
                name: 'Baterías',
                category: 'Fuentes',
                categoryIcon: '🔋',
                icon: '🔋'
            },
            {
                id: 'awg',
                name: 'AWG',
                category: 'Conversores',
                categoryIcon: '🛠',
                icon: '📐'
            }
        ];
    }

    render() {
        const sidebar = document.createElement('div');
        sidebar.className = `sidebar animate-slide-in-left ${this.state.state.sidebarCollapsed ? 'collapsed' : ''}`;

        // Header
        const header = document.createElement('div');
        header.className = 'sidebar-header';

        const brand = document.createElement('div');
        brand.className = 'sidebar-brand';
        brand.innerHTML = '<span>⚡</span><span>ETOOLKIT</span>';

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.innerHTML = '☰';
        toggleBtn.addEventListener('click', () => {
            this.state.toggleSidebar();
        });

        header.appendChild(brand);
        header.appendChild(toggleBtn);

        // Content
        const content = document.createElement('div');
        content.className = 'sidebar-content';

        // Agrupar calculadoras por categoría
        const grouped = this.groupByCategory();
        grouped.forEach(({ category, categoryIcon, items }) => {
            const section = document.createElement('div');
            section.className = 'sidebar-section';

            const title = document.createElement('div');
            title.className = 'sidebar-section-title';
            title.textContent = `${categoryIcon} ${category}`;

            section.appendChild(title);

            items.forEach(calc => {
                const link = document.createElement('div');
                link.className = 'nav-link';
                link.innerHTML = `<span class="nav-icon">${calc.icon}</span><span class="nav-link-text">${calc.name}</span>`;

                link.addEventListener('click', () => {
                    this.selectCalculator(calc.id);
                });

                section.appendChild(link);
            });

            content.appendChild(section);
        });

        const promoPanel = document.createElement('div');
        promoPanel.className = 'sidebar-promo';
        promoPanel.innerHTML = `
            <div class="sidebar-promo-title">🔎 Recomendado</div>
            <p class="sidebar-promo-text">Guarda tus calculadoras favoritas y mantén tu flujo de trabajo organizado sin perder tiempo.</p>
        `;
        content.appendChild(promoPanel);

        sidebar.appendChild(header);
        sidebar.appendChild(content);

        // Subscribe to state changes
        this.unsubscribe = this.state.subscribe((state) => {
            sidebar.classList.toggle('collapsed', state.sidebarCollapsed);
        });

        return sidebar;
    }

    groupByCategory() {
        const grouped = [];
        const categories = {};

        this.calculators.forEach(calc => {
            if (!categories[calc.category]) {
                categories[calc.category] = {
                    category: calc.category,
                    categoryIcon: calc.categoryIcon,
                    items: []
                };
                grouped.push(categories[calc.category]);
            }
            categories[calc.category].items.push(calc);
        });

        return grouped;
    }

    selectCalculator(calculatorId) {
        this.state.setCurrentCalculator(calculatorId);
        router.navigate(`/calculator/${calculatorId}`, { calculatorId });
    }

    openFavorites() {
        this.state.setCurrentPage('favorites');
        router.navigate('/favorites', {});
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}
