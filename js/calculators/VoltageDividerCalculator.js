/**
 * Voltage Divider Calculator
 * Calcula Vout y corriente del divisor
 */
import { HeaderComponent } from '../components/Header.js';
import notification from '../notification.js';
import { renderResistorBands } from '../utils/resistor.js';

export class VoltageDividerCalculator {
    constructor(state) {
        this.state = state;
        this.id = 'voltage-divider';
        this.name = 'Divisor de Tensión';
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
        subtitle.textContent = 'Vout = Vin × R2 / (R1 + R2)';

        cardHeader.appendChild(title);
        cardHeader.appendChild(subtitle);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const formRow = document.createElement('div');
        formRow.className = 'form-group-row';

        const vinGroup = this.createInputGroup('Voltaje Entrada (V)', 'voltage_in', 'V');
        const r1Group = this.createInputGroup('R1 (Ω)', 'r1', 'Ω');
        const r2Group = this.createInputGroup('R2 (Ω)', 'r2', 'Ω');

        formRow.appendChild(vinGroup);
        formRow.appendChild(r1Group);
        formRow.appendChild(r2Group);

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

        const vinInput = vinGroup.querySelector('input');
        const r1Input = r1Group.querySelector('input');
        const r2Input = r2Group.querySelector('input');

        calcBtn.addEventListener('click', () => {
            const vin = this.parseNumber(vinInput.value);
            const r1 = this.parseNumber(r1Input.value);
            const r2 = this.parseNumber(r2Input.value);

            if (vin === null || r1 === null || r2 === null) {
                notification.error('Todos los campos son requeridos');
                return;
            }

            if (r1 <= 0 || r2 <= 0) {
                notification.error('Las resistencias deben ser positivas');
                return;
            }

            const result = this.calculate(vin, r1, r2);
            this.showResults(result, resultsDiv);

            this.state.addToHistory({
                calculatorId: this.id,
                calculatorName: this.name,
                inputs: { vin, r1, r2 },
                results: result
            });
        });

        clearBtn.addEventListener('click', () => {
            vinInput.value = '';
            r1Input.value = '';
            r2Input.value = '';
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

    calculate(vin, r1, r2) {
        const vout = vin * r2 / (r1 + r2);
        const rtotal = r1 + r2;
        const current = vin / rtotal;

        return {
            vout: vout,
            current: current,
            rtotal: rtotal,
            ratio: r2 / (r1 + r2)
        };
    }

    showResults(result, container) {
        container.innerHTML = `
            <div class="stat-group">
                <div class="stat-item">
                    <div class="stat-value">${result.vout.toFixed(4)}</div>
                    <div class="stat-label">Voltaje Salida (V)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${result.current.toFixed(6)}</div>
                    <div class="stat-label">Corriente (A)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${(result.ratio * 100).toFixed(2)}</div>
                    <div class="stat-label">Ratio (%)</div>
                </div>
            </div>
            <div class="alert alert-success mt-4">
                <div class="alert-icon">✓</div>
                <div class="alert-content">
                    <div class="alert-title">Divisor de Tensión</div>
                    <div class="alert-message">
                        Vout = ${result.vout.toFixed(4)}V<br>
                        Corriente = ${result.current.toFixed(6)}A<br>
                        Ratio = ${(result.ratio * 100).toFixed(2)}%
                    </div>
                </div>
            </div>
        `;

        notification.success('Cálculo realizado correctamente');
    }
}
