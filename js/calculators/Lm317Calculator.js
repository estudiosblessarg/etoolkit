/**
 * LM317 Calculator
 * Calcula R2 para voltaje deseado
 */
import { HeaderComponent } from '../components/Header.js';
import notification from '../notification.js';

export class Lm317Calculator {
    constructor(state) {
        this.state = state;
        this.id = 'lm317';
        this.name = 'Regulador LM317';
        this.R1 = 240;
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
        subtitle.textContent = 'Vout = 1.25 × (1 + R2/R1), R1 = 240Ω';

        cardHeader.appendChild(title);
        cardHeader.appendChild(subtitle);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const infoAlert = document.createElement('div');
        infoAlert.className = 'alert alert-info mb-4';
        infoAlert.innerHTML = `
            <div class="alert-icon">ℹ</div>
            <div class="alert-content">
                <div class="alert-title">Parámetro Fijo</div>
                <div class="alert-message">R1 = 240Ω (valor recomendado por defecto)</div>
            </div>
        `;

        cardBody.appendChild(infoAlert);

        const formRow = document.createElement('div');
        formRow.className = 'form-group-row-3';

        const r1Group = this.createInputGroup('R1 (Ω)', 'r1', 'Ω', this.R1);
        const voutGroup = this.createInputGroup('Vout Deseado (V)', 'vout', 'V');
        const r2Group = this.createInputGroup('R2 Calculado (Ω)', 'r2', 'Ω');
        r2Group.querySelector('input').disabled = true;

        formRow.appendChild(r1Group);
        formRow.appendChild(voutGroup);
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

        const r1Input = r1Group.querySelector('input');
        const voutInput = voutGroup.querySelector('input');
        const r2Input = r2Group.querySelector('input');

        calcBtn.addEventListener('click', () => {
            const r1 = this.parseNumber(r1Input.value);
            const vout = this.parseNumber(voutInput.value);

            if (r1 === null || vout === null) {
                notification.error('Todos los campos son requeridos');
                return;
            }

            if (r1 <= 0 || vout <= 1.25) {
                notification.error('R1 debe ser positivo y Vout debe ser >= 1.25V');
                return;
            }

            const result = this.calculate(r1, vout);
            this.showResults(result, resultsDiv, r2Input);

            this.state.addToHistory({
                calculatorId: this.id,
                calculatorName: this.name,
                inputs: { r1, vout },
                results: result
            });
        });

        clearBtn.addEventListener('click', () => {
            r1Input.value = this.R1;
            voutInput.value = '';
            r2Input.value = '';
            resultsDiv.innerHTML = '';
        });

        r1Input.value = this.R1;

        return container;
    }

    createInputGroup(label, name, unit, defaultValue = '') {
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
        if (defaultValue) input.value = defaultValue;

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

    calculate(r1, vout) {
        const r2 = r1 * (vout / 1.25 - 1);
        const actualVout = 1.25 * (1 + r2 / r1);

        return {
            r2: r2,
            actualVout: actualVout,
            r1: r1,
            vref: 1.25
        };
    }

    showResults(result, container, r2Input) {
        r2Input.value = result.r2.toFixed(2);

        container.innerHTML = `
            <div class="stat-group">
                <div class="stat-item">
                    <div class="stat-value">${result.r2.toFixed(2)}</div>
                    <div class="stat-label">R2 Calculado (Ω)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${result.actualVout.toFixed(4)}</div>
                    <div class="stat-label">Vout Actual (V)</div>
                </div>
            </div>
            <div class="alert alert-success mt-4">
                <div class="alert-icon">✓</div>
                <div class="alert-content">
                    <div class="alert-title">Configuración LM317</div>
                    <div class="alert-message">
                        R1 = ${result.r1.toFixed(0)}Ω<br>
                        R2 = ${result.r2.toFixed(2)}Ω<br>
                        Vout = ${result.actualVout.toFixed(4)}V
                    </div>
                </div>
            </div>
        `;

        notification.success('Cálculo realizado correctamente');
    }
}
