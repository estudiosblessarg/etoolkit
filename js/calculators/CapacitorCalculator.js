/**
 * Capacitor Converter Calculator
 * Conversor de unidades de capacitores
 */
import { HeaderComponent } from '../components/Header.js';
import notification from '../notification.js';

export class CapacitorCalculator {
    constructor(state) {
        this.state = state;
        this.id = 'capacitor';
        this.name = 'Conversor de Capacitores';
        this.units = {
            'pF': 1e-12,
            'nF': 1e-9,
            'µF': 1e-6,
            'mF': 1e-3,
            'F': 1
        };
    }

    render() {
        const container = document.createElement('div');
        container.className = 'page-calculator';

        const header = new HeaderComponent(this.state).render(this.name);
        container.appendChild(header);

        const content = document.createElement('div');
        content.className = 'content';

        const card = document.createElement('div');
        card.className = 'card animate-fade-in';

        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';

        const title = document.createElement('h2');
        title.className = 'card-title';
        title.textContent = this.name;

        const subtitle = document.createElement('p');
        subtitle.className = 'card-subtitle';
        subtitle.textContent = 'Convierte entre diferentes unidades de capacitancia';

        cardHeader.appendChild(title);
        cardHeader.appendChild(subtitle);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const inputGroup = document.createElement('div');
        inputGroup.className = 'form-group';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = 'Valor y Unidad';

        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.style.gap = '0.5rem';

        const valueInput = document.createElement('input');
        valueInput.type = 'number';
        valueInput.className = 'form-control';
        valueInput.placeholder = '0';
        valueInput.step = 'any';

        const unitSelect = document.createElement('select');
        unitSelect.className = 'form-control';
        unitSelect.innerHTML = `
            <option value="pF">pF</option>
            <option value="nF">nF</option>
            <option value="µF" selected>µF</option>
            <option value="mF">mF</option>
            <option value="F">F</option>
        `;

        inputContainer.appendChild(valueInput);
        inputContainer.appendChild(unitSelect);

        inputGroup.appendChild(label);
        inputGroup.appendChild(inputContainer);

        cardBody.appendChild(inputGroup);

        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'mt-4';
        resultsDiv.id = 'results';

        cardBody.appendChild(resultsDiv);

        cardHeader.style.borderBottom = 'none';
        card.appendChild(cardHeader);
        card.appendChild(cardBody);

        content.appendChild(card);
        container.appendChild(content);

        const updateConversion = () => {
            const value = this.parseNumber(valueInput.value);
            const fromUnit = unitSelect.value;

            if (value === null) {
                resultsDiv.innerHTML = '';
                return;
            }

            const result = this.convert(value, fromUnit);
            this.showResults(result, resultsDiv);
        };

        valueInput.addEventListener('input', updateConversion);
        unitSelect.addEventListener('change', updateConversion);

        return container;
    }

    parseNumber(value) {
        const num = parseFloat(value);
        return isNaN(num) || num === '' ? null : num;
    }

    convert(value, fromUnit) {
        const farads = value * this.units[fromUnit];

        return {
            pF: farads / this.units['pF'],
            nF: farads / this.units['nF'],
            µF: farads / this.units['µF'],
            mF: farads / this.units['mF'],
            F: farads,
            original: value,
            originalUnit: fromUnit
        };
    }

    showResults(result, container) {
        container.innerHTML = `
            <div class="stat-group">
                <div class="stat-item">
                    <div class="stat-value">${this.formatValue(result.pF)}</div>
                    <div class="stat-label">Picofaradios (pF)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.formatValue(result.nF)}</div>
                    <div class="stat-label">Nanofaradios (nF)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.formatValue(result.µF)}</div>
                    <div class="stat-label">Microfaradios (µF)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.formatValue(result.mF)}</div>
                    <div class="stat-label">Milifaradios (mF)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.formatValue(result.F)}</div>
                    <div class="stat-label">Faradios (F)</div>
                </div>
            </div>
        `;

        notification.success('Conversión realizada');
    }

    formatValue(value) {
        if (Math.abs(value) < 0.001 && value !== 0) {
            return value.toExponential(3);
        }
        return value.toFixed(6).replace(/\.?0+$/, '');
    }
}
