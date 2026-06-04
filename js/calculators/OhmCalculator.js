/**
 * Ohm Calculator
 * Calcula V, I o R según V = I × R
 */
import { HeaderComponent } from '../components/Header.js';
import notification from '../notification.js';
import { renderResistorBands } from '../utils/resistor.js';

export class OhmCalculator {
    constructor(state) {
        this.state = state;
        this.id = 'ohm';
        this.name = 'Ley de Ohm';
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
        subtitle.textContent = 'V = I × R (Proporciona al menos dos valores)';

        cardHeader.appendChild(title);
        cardHeader.appendChild(subtitle);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        // Inputs
        const formRow = document.createElement('div');
        formRow.className = 'form-group-row';

        const vGroup = this.createInputGroup('Voltaje (V)', 'voltage', 'V');
        const iGroup = this.createInputGroup('Corriente (A)', 'current', 'A');
        const rGroup = this.createInputGroup('Resistencia (Ω)', 'resistance', 'Ω');

        formRow.appendChild(vGroup);
        formRow.appendChild(iGroup);
        formRow.appendChild(rGroup);

        cardBody.appendChild(formRow);

        // Buttons
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

        // Results
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'mt-4';
        resultsDiv.id = 'results';

        cardBody.appendChild(resultsDiv);

        cardHeader.style.borderBottom = 'none';
        card.appendChild(cardHeader);
        card.appendChild(cardBody);

        content.appendChild(card);
        container.appendChild(content);

        // Event listeners
        const voltageInput = vGroup.querySelector('input');
        const currentInput = iGroup.querySelector('input');
        const resistanceInput = rGroup.querySelector('input');

        calcBtn.addEventListener('click', () => {
            const v = this.parseNumber(voltageInput.value);
            const i = this.parseNumber(currentInput.value);
            const r = this.parseNumber(resistanceInput.value);

            const filled = [v !== null, i !== null, r !== null].filter(x => x).length;

            if (filled < 2) {
                notification.error('Proporciona al menos 2 valores');
                return;
            }

            let result = this.calculate(v, i, r);
            this.showResults(result, resultsDiv, voltageInput, currentInput, resistanceInput);

            this.state.addToHistory({
                calculatorId: this.id,
                calculatorName: this.name,
                inputs: { v, i, r },
                results: result
            });
        });

        clearBtn.addEventListener('click', () => {
            voltageInput.value = '';
            currentInput.value = '';
            resistanceInput.value = '';
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

    calculate(v, i, r) {
        const filled = [v !== null, i !== null, r !== null].filter(x => x).length;

        if (filled < 2) return null;

        let result = { v, i, r };

        if (v === null) {
            result.v = i * r;
            result.calculated = 'V';
        } else if (i === null) {
            result.i = v / r;
            result.calculated = 'I';
        } else if (r === null) {
            result.r = v / i;
            result.calculated = 'R';
        }

        return result;
    }

    showResults(result, container, vInput, iInput, rInput) {
        if (!result) return;

        container.innerHTML = `
            <div class="stat-group">
                <div class="stat-item">
                    <div class="stat-value">${result.v.toFixed(4)}</div>
                    <div class="stat-label">Voltaje (V)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${result.i.toFixed(4)}</div>
                    <div class="stat-label">Corriente (A)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${result.r.toFixed(4)}</div>
                    <div class="stat-label">Resistencia (Ω)</div>
                </div>
            </div>
            <div class="alert alert-success mt-4">
                <div class="alert-icon">✓</div>
                <div class="alert-content">
                    <div class="alert-title">Valor Calculado</div>
                    <div class="alert-message">
                        ${result.calculated === 'V' ? `Voltaje: ${result.v.toFixed(4)} V` : ''}
                        ${result.calculated === 'I' ? `Corriente: ${result.i.toFixed(4)} A` : ''}
                        ${result.calculated === 'R' ? `Resistencia: ${result.r.toFixed(4)} Ω` : ''}
                    </div>
                </div>
            </div>
        `;

        vInput.value = result.v;
        iInput.value = result.i;
        rInput.value = result.r;

        // Mostrar bandas de la resistencia si existe
        if (isFinite(result.r) && result.r > 0) {
            const bandsEl = renderResistorBands(result.r);
            if (bandsEl) container.appendChild(bandsEl);
        }

        // Aviso para alto voltaje (soportado hasta 220V)
        if (isFinite(result.v) && Math.abs(result.v) >= 50) {
            const warn = document.createElement('div');
            warn.className = 'alert alert-warning mt-3';
            warn.style.border = '1px solid var(--warning-color)';
            warn.style.padding = '0.75rem';
            warn.textContent = '⚠️ Alto voltaje detectado. Ten cuidado al trabajar con tensiones hasta 220V.';
            container.appendChild(warn);
        }

        notification.success('Cálculo realizado correctamente');
    }
}
