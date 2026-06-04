/**
 * RC Calculator
 * Calcula tau, tiempo 63% y tiempo 99%
 */
import { HeaderComponent } from '../components/Header.js';
import notification from '../notification.js';

export class RcCalculator {
    constructor(state) {
        this.state = state;
        this.id = 'rc';
        this.name = 'Circuito RC';
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
        subtitle.textContent = 'Tau = R × C (Constante de tiempo)';

        cardHeader.appendChild(title);
        cardHeader.appendChild(subtitle);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const formRow = document.createElement('div');
        formRow.className = 'form-group-row';

        const rGroup = this.createInputGroup('Resistencia (Ω)', 'resistance', 'Ω');
        const cGroup = this.createCapacitorInput('Capacitor', 'capacitance');

        formRow.appendChild(rGroup);
        formRow.appendChild(cGroup);

        cardBody.appendChild(formRow);

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'flex gap-2 mt-4';

        const calcBtn = document.createElement('button');
        calcBtn.className = 'btn-primary';
        calcBtn.textContent = 'Calcular';

        const clearBtn = document.createElement('button');
        clearBtn.className = 'btn-secondary';
        clearBtn.textContent = 'Limpiar';

        buttonGroup.appendChild(calcBtn);
        buttonGroup.appendChild(clearBtn);

        cardBody.appendChild(buttonGroup);

        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'mt-4';
        resultsDiv.id = 'results';

        cardBody.appendChild(resultsDiv);

        cardHeader.style.borderBottom = 'none';
        card.appendChild(cardHeader);
        card.appendChild(cardBody);

        content.appendChild(card);
        container.appendChild(content);

        const rInput = rGroup.querySelector('input');
        const cValueInput = cGroup.querySelector('[data-name="cap-value"]');
        const cUnitSelect = cGroup.querySelector('[data-name="cap-unit"]');

        calcBtn.addEventListener('click', () => {
            const r = this.parseNumber(rInput.value);
            const cValue = this.parseNumber(cValueInput.value);

            if (r === null || cValue === null) {
                notification.error('Todos los campos son requeridos');
                return;
            }

            const cUnit = cUnitSelect.value;
            const c = this.capacitorToFarads(cValue, cUnit);

            const result = this.calculate(r, c);
            this.showResults(result, resultsDiv);

            this.state.addToHistory({
                calculatorId: this.id,
                calculatorName: this.name,
                inputs: { r, c: `${cValue}${cUnit}` },
                results: result
            });
        });

        clearBtn.addEventListener('click', () => {
            rInput.value = '';
            cValueInput.value = '';
            cUnitSelect.value = 'µF';
            resultsDiv.innerHTML = '';
        });

        return container;
    }

    createInputGroup(label, name, unit) {
        const group = document.createElement('div');
        group.className = 'form-group';

        const labelEl = document.createElement('label');
        labelEl.className = 'form-label';
        labelEl.textContent = label;

        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.style.gap = '0.5rem';

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'form-control';
        input.placeholder = '0';
        input.dataset.name = name;
        input.step = 'any';

        const unitLabel = document.createElement('span');
        unitLabel.style.alignSelf = 'center';
        unitLabel.style.padding = '0.75rem';
        unitLabel.style.color = 'var(--text-tertiary)';
        unitLabel.textContent = unit;

        inputContainer.appendChild(input);
        inputContainer.appendChild(unitLabel);

        group.appendChild(labelEl);
        group.appendChild(inputContainer);

        return group;
    }

    createCapacitorInput(label, name) {
        const group = document.createElement('div');
        group.className = 'form-group';

        const labelEl = document.createElement('label');
        labelEl.className = 'form-label';
        labelEl.textContent = label;

        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.style.gap = '0.5rem';

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'form-control';
        input.placeholder = '0';
        input.dataset.name = 'cap-value';
        input.step = 'any';

        const select = document.createElement('select');
        select.className = 'form-control';
        select.dataset.name = 'cap-unit';
        select.innerHTML = `
            <option value="pF">pF</option>
            <option value="nF">nF</option>
            <option value="µF" selected>µF</option>
            <option value="mF">mF</option>
            <option value="F">F</option>
        `;

        inputContainer.appendChild(input);
        inputContainer.appendChild(select);

        group.appendChild(labelEl);
        group.appendChild(inputContainer);

        return group;
    }

    parseNumber(value) {
        const num = parseFloat(value);
        return isNaN(num) || num === '' ? null : num;
    }

    capacitorToFarads(value, unit) {
        const units = {
            'pF': 1e-12,
            'nF': 1e-9,
            'µF': 1e-6,
            'mF': 1e-3,
            'F': 1
        };
        return value * (units[unit] || 1e-6);
    }

    calculate(r, c) {
        const tau = r * c;
        const time63 = tau;
        const time99 = tau * 4.605;

        return {
            tau: tau,
            time63: time63,
            time99: time99,
            frequency: 1 / (2 * Math.PI * tau)
        };
    }

    formatTime(seconds) {
        if (seconds < 1e-6) return `${(seconds * 1e9).toFixed(3)} ns`;
        if (seconds < 1e-3) return `${(seconds * 1e6).toFixed(3)} µs`;
        if (seconds < 1) return `${(seconds * 1e3).toFixed(3)} ms`;
        return `${seconds.toFixed(3)} s`;
    }

    showResults(result, container) {
        container.innerHTML = `
            <div class="stat-group">
                <div class="stat-item">
                    <div class="stat-value">${this.formatTime(result.tau)}</div>
                    <div class="stat-label">Tau (τ)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.formatTime(result.time63)}</div>
                    <div class="stat-label">Tiempo 63%</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.formatTime(result.time99)}</div>
                    <div class="stat-label">Tiempo 99%</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${result.frequency.toFixed(3)}</div>
                    <div class="stat-label">Frecuencia (Hz)</div>
                </div>
            </div>
            <div class="alert alert-success mt-4">
                <div class="alert-icon">✓</div>
                <div class="alert-content">
                    <div class="alert-title">Resultados RC</div>
                    <div class="alert-message">
                        τ = ${this.formatTime(result.tau)}<br>
                        63% = ${this.formatTime(result.time63)}<br>
                        99% = ${this.formatTime(result.time99)}
                    </div>
                </div>
            </div>
        `;

        notification.success('Cálculo realizado correctamente');
    }
}
