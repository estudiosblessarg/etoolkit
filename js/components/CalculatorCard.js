/**
 * Calculator Card Component
 * Tarjeta para mostrar calculadora en el dashboard
 */
import router from '../router.js';

export class CalculatorCardComponent {
    constructor(state) {
        this.state = state;
        this.calculators = [
            {
                id: 'ohm',
                name: 'Ley de Ohm',
                description: 'Calcula V, I o R según la fórmula V = I × R',
                icon: '⚙',
                category: 'Básico'
            },
            {
                id: 'power',
                name: 'Potencia',
                description: 'Calcula P, V o I según la fórmula P = V × I',
                icon: '🔌',
                category: 'Básico'
            },
            {
                id: 'led',
                name: 'Resistencia LED',
                description: 'Calcula la resistencia recomendada para un LED',
                icon: '💡',
                category: 'LEDs'
            },
            {
                id: 'series',
                name: 'Resistencias Serie',
                description: 'Calcula la resistencia equivalente en serie',
                icon: '〰',
                category: 'Resistencias'
            },
            {
                id: 'parallel',
                name: 'Resistencias Paralelo',
                description: 'Calcula la resistencia equivalente en paralelo',
                icon: '⫽',
                category: 'Resistencias'
            },
            {
                id: 'voltage-divider',
                name: 'Divisor de Tensión',
                description: 'Calcula Vout y corriente del divisor',
                icon: '⊕',
                category: 'Resistencias'
            },
            {
                id: 'rc',
                name: 'RC',
                description: 'Calcula tau, tiempo 63% y tiempo 99%',
                icon: '⏱',
                category: 'Capacitores'
            },
            {
                id: 'capacitor',
                name: 'Conversor Capacitores',
                description: 'Convierte entre pF, nF, µF, mF y F',
                icon: '📦',
                category: 'Capacitores'
            },
            {
                id: 'lm317',
                name: 'LM317',
                description: 'Calcula R2 para voltaje deseado',
                icon: '🔩',
                category: 'Fuentes'
            },
            {
                id: 'mosfet',
                name: 'MOSFET',
                description: 'Calcula potencia disipada (P = I² × R)',
                icon: '🎛',
                category: 'Fuentes'
            },
            {
                id: 'battery',
                name: 'Baterías',
                description: 'Calcula energía y autonomía estimada',
                icon: '🔋',
                category: 'Fuentes'
            },
            {
                id: 'awg',
                name: 'AWG',
                description: 'Convierte entre AWG y mm²',
                icon: '📐',
                category: 'Conversores'
            }
        ];
    }

    renderCard(calculator) {
        const card = document.createElement('div');
        card.className = 'calculator-card animate-fade-in';
        card.dataset.calculatorId = calculator.id;

        const isFavorite = this.state.isFavorite(calculator.id);

        card.innerHTML = `
            <button class="calculator-card-favorite ${isFavorite ? 'active' : ''}" data-id="${calculator.id}">
                ${isFavorite ? '⭐' : '☆'}
            </button>
            <span class="calculator-card-icon">${calculator.icon}</span>
            <h3 class="calculator-card-title">${calculator.name}</h3>
            <p class="calculator-card-description">${calculator.description}</p>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.closest('.calculator-card-favorite')) return;
            this.openCalculator(calculator.id);
        });

        const favoriteBtn = card.querySelector('.calculator-card-favorite');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.state.toggleFavorite(calculator.id);
            favoriteBtn.classList.toggle('active');
            favoriteBtn.textContent = this.state.isFavorite(calculator.id) ? '⭐' : '☆';
        });

        return card;
    }

    openCalculator(calculatorId) {
        this.state.setCurrentCalculator(calculatorId);
        router.navigate(`/calculator/${calculatorId}`, { calculatorId });
    }

    renderAll() {
        const container = document.createElement('div');
        container.className = 'grid grid-cols-4';

        this.calculators.forEach(calc => {
            const card = this.renderCard(calc);
            container.appendChild(card);
        });

        return container;
    }
}
