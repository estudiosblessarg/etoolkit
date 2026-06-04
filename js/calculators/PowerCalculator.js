/**
 * Power Calculator
 * Calcula P, V o I según P = V × I
 */
import { HeaderComponent } from '../components/Header.js';
import notification from '../notification.js';
import { renderResistorBands } from '../utils/resistor.js';

export class PowerCalculator {
    constructor(state) {
        this.state = state;
        this.id = 'power';
        this.name = 'Potencia';
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
        subtitle.textContent = 'P = V × I (Proporciona al menos dos valores)';

        cardHeader.appendChild(title);
        cardHeader.appendChild(subtitle);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const formRow = document.createElement('div');
        formRow.className = 'form-group-row';

        const pGroup = this.createInputGroup('Potencia (W)', 'power', 'W');
        const vGroup = this.createInputGroup('Voltaje (V)', 'voltage', 'V');
        const iGroup = this.createInputGroup('Corriente (A)', 'current', 'A');

        formRow.appendChild(pGroup);
        formRow.appendChild(vGroup);
        formRow.appendChild(iGroup);

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

        const pInput = pGroup.querySelector('input');
        const vInput = vGroup.querySelector('input');
        const iInput = iGroup.querySelector('input');

        calcBtn.addEventListener('click', () => {
            const p = this.parseNumber(pInput.value);
            const v = this.parseNumber(vInput.value);
            const i = this.parseNumber(iInput.value);

            const filled = [p !== null, v !== null, i !== null].filter(x => x).length;

            if (filled < 2) {
                notification.error('Proporciona al menos 2 valores');
                return;
            }

            const result = this.calculate(p, v, i);
            this.showResults(result, resultsDiv, pInput, vInput, iInput);

            this.state.addToHistory({
                calculatorId: this.id,
                calculatorName: this.name,
                inputs: { p, v, i },
                results: result
            });
        });

        clearBtn.addEventListener('click', () => {
            pInput.value = '';
            vInput.value = '';
            iInput.value = '';
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

    parseNumber(value) {
        const num = parseFloat(value);
        return isNaN(num) || num === '' ? null : num;
    }

    calculate(p, v, i) {
        const filled = [p !== null, v !== null, i !== null].filter(x => x).length;

        if (filled < 2) return null;

        let result = { p, v, i };

        if (p === null) {
            result.p = v * i;
            result.calculated = 'P';
        } else if (v === null) {
            result.v = p / i;
            result.calculated = 'V';
        } else if (i === null) {
            result.i = p / v;
            result.calculated = 'I';
        }

        return result;
    }

    showResults(result, container, pInput, vInput, iInput) {
        if (!result) return;

        container.innerHTML = `
            <div class="stat-group">
                <div class="stat-item">
                    <div class="stat-value">${result.p.toFixed(4)}</div>
                    <div class="stat-label">Potencia (W)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${result.v.toFixed(4)}</div>
                    <div class="stat-label">Voltaje (V)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${result.i.toFixed(4)}</div>
                    <div class="stat-label">Corriente (A)</div>
                </div>
            </div>
            <div class="alert alert-success mt-4">
                <div class="alert-icon">✓</div>
                <div class="alert-content">
                    <div class="alert-title">Valor Calculado</div>
                    <div class="alert-message">
                        ${result.calculated === 'P' ? `Potencia: ${result.p.toFixed(4)} W` : ''}
                        ${result.calculated === 'V' ? `Voltaje: ${result.v.toFixed(4)} V` : ''}
                        ${result.calculated === 'I' ? `Corriente: ${result.i.toFixed(4)} A` : ''}
                    </div>
                </div>
            </div>
        `;

        pInput.value = result.p;
        vInput.value = result.v;
        iInput.value = result.i;

        if (isFinite(result.v) && Math.abs(result.v) >= 50) {
            const warn = document.createElement('div');
            warn.className = 'alert alert-warning mt-3';
            warn.style.border = '1px solid var(--warning-color)';
            warn.style.padding = '0.75rem';
            warn.textContent = '⚠️ Voltaje elevado detectado. Soporta entradas de hasta 220V.';
            container.appendChild(warn);
        }

        notification.success('Cálculo realizado correctamente');
    }
}
