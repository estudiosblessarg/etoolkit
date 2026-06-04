/**
 * Search Bar Component
 * Buscador de calculadoras
 */
import router from '../router.js';

export class SearchBarComponent {
    constructor(state) {
        this.state = state;
        this.calculators = [
            { id: 'ohm', name: 'Ley de Ohm', category: 'Básico' },
            { id: 'power', name: 'Potencia', category: 'Básico' },
            { id: 'led', name: 'Resistencia LED', category: 'LEDs' },
            { id: 'series', name: 'Resistencias Serie', category: 'Resistencias' },
            { id: 'parallel', name: 'Resistencias Paralelo', category: 'Resistencias' },
            { id: 'voltage-divider', name: 'Divisor de Tensión', category: 'Resistencias' },
            { id: 'rc', name: 'RC', category: 'Capacitores' },
            { id: 'capacitor', name: 'Conversor Capacitores', category: 'Capacitores' },
            { id: 'lm317', name: 'LM317', category: 'Fuentes' },
            { id: 'mosfet', name: 'MOSFET', category: 'Fuentes' },
            { id: 'battery', name: 'Baterías', category: 'Fuentes' },
            { id: 'awg', name: 'AWG', category: 'Conversores' }
        ];
        this.currentHighlightedIndex = -1;
    }

    render() {
        const container = document.createElement('div');
        container.className = 'search-container';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'search-input';
        input.placeholder = 'Buscar calculadora...';

        const icon = document.createElement('div');
        icon.className = 'search-icon';
        icon.innerHTML = '🔍';

        const clearBtn = document.createElement('button');
        clearBtn.className = 'search-clear';
        clearBtn.innerHTML = '✕';

        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';

        input.addEventListener('input', (e) => {
            this.handleSearch(e.target.value, resultsContainer);
            if (e.target.value.length > 0) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });

        input.addEventListener('keydown', (e) => {
            this.handleKeyboard(e, resultsContainer);
        });

        clearBtn.addEventListener('click', () => {
            input.value = '';
            input.classList.remove('has-value');
            resultsContainer.innerHTML = '';
            resultsContainer.classList.remove('visible');
            input.focus();
        });

        container.appendChild(icon);
        container.appendChild(input);
        container.appendChild(clearBtn);
        container.appendChild(resultsContainer);

        return container;
    }

    handleSearch(query, resultsContainer) {
        if (query.trim().length === 0) {
            resultsContainer.classList.remove('visible');
            resultsContainer.innerHTML = '';
            this.currentHighlightedIndex = -1;
            return;
        }

        const filtered = this.calculators.filter(calc =>
            calc.name.toLowerCase().includes(query.toLowerCase()) ||
            calc.category.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length === 0) {
            resultsContainer.innerHTML = '<div class="search-no-results">No se encontraron calculadoras</div>';
            resultsContainer.classList.add('visible');
            return;
        }

        resultsContainer.innerHTML = filtered.map((calc, index) => `
            <div class="search-result-item" data-index="${index}" data-id="${calc.id}">
                <div class="search-result-title">${calc.name}</div>
                <div class="search-result-category">${calc.category}</div>
            </div>
        `).join('');

        resultsContainer.classList.add('visible');

        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const calcId = item.dataset.id;
                this.selectCalculator(calcId);
            });
        });

        this.currentHighlightedIndex = -1;
    }

    handleKeyboard(event, resultsContainer) {
        if (!resultsContainer.classList.contains('visible')) return;

        const items = resultsContainer.querySelectorAll('.search-result-item');
        if (items.length === 0) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.currentHighlightedIndex = Math.min(
                    this.currentHighlightedIndex + 1,
                    items.length - 1
                );
                this.updateHighlight(items);
                break;

            case 'ArrowUp':
                event.preventDefault();
                this.currentHighlightedIndex = Math.max(this.currentHighlightedIndex - 1, -1);
                this.updateHighlight(items);
                break;

            case 'Enter':
                event.preventDefault();
                if (this.currentHighlightedIndex >= 0) {
                    const calcId = items[this.currentHighlightedIndex].dataset.id;
                    this.selectCalculator(calcId);
                }
                break;

            case 'Escape':
                event.preventDefault();
                resultsContainer.classList.remove('visible');
                event.target.value = '';
                this.currentHighlightedIndex = -1;
                break;
        }
    }

    updateHighlight(items) {
        items.forEach((item, index) => {
            if (index === this.currentHighlightedIndex) {
                item.classList.add('highlighted');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('highlighted');
            }
        });
    }

    selectCalculator(calculatorId) {
        this.state.setCurrentCalculator(calculatorId);
        router.navigate(`/calculator/${calculatorId}`, { calculatorId });
    }
}
