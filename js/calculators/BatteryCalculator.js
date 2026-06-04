/**
 * Battery Calculator
 * Calcula energía y autonomía
 */
import { HeaderComponent } from '../components/Header.js';
import notification from '../notification.js';

export class BatteryCalculator {
    constructor(state) {
        this.state = state;
        this.id = 'battery';
        this.name = 'Calculador de Baterías';
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
        subtitle.textContent = 'E = V × Ah, Autonomía = Ah / A';

        cardHeader.appendChild(title);
        cardHeader.appendChild(subtitle);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const formRow = document.createElement('div');
        formRow.className = 'form-group-row';

        const vGroup = this.createInputGroup('Voltaje (V)', 'voltage', 'V');
        const ahGroup = this.createInputGroup('Capacidad (Ah)', 'capacity', 'Ah');
        const aGroup = this.createInputGroup('Consumo (A)', 'consumption', 'A');

        formRow.appendChild(vGroup);
        formRow.appendChild(ahGroup);
        formRow.appendChild(aGroup);

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

        const vInput = vGroup.querySelector('input');
        const ahInput = ahGroup.querySelector('input');
        const aInput = aGroup.querySelector('input');

        calcBtn.addEventListener('click', () => {
            const v = this.parseNumber(vInput.value);
            const ah = this.parseNumber(ahInput.value);
            const a = this.parseNumber(aInput.value);

            if (v === null || ah === null || a === null) {
                notification.error('Todos los campos son requeridos');
                return;
            }

            if (v <= 0 || ah <= 0 || a <= 0) {
                notification.error('Los valores deben ser positivos');
                return;
            }

            const result = this.calculate(v, ah, a);
            this.showResults(result, resultsDiv);

            this.state.addToHistory({
                calculatorId: this.id,
                calculatorName: this.name,
                inputs: { v, ah, a },
                results: result
            });
        });

        clearBtn.addEventListener('click', () => {
            vInput.value = '';
            ahInput.value = '';
            aInput.value = '';
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

    calculate(v, ah, a) {
        const energy = v * ah;
        const autonomyHours = ah / a;
        const autonomyMinutes = autonomyHours * 60;

        return {
            energy: energy,
            autonomyHours: autonomyHours,
            autonomyMinutes: autonomyMinutes,
            voltage: v,
            capacity: ah,
            consumption: a
        };
    }

    formatTime(hours) {
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return `${h}h ${m}m`;
    }

    showResults(result, container) {
        container.innerHTML = `
            <div class="stat-group">
                <div class="stat-item">
                    <div class="stat-value">${result.energy.toFixed(2)}</div>
                    <div class="stat-label">Energía (Wh)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.formatTime(result.autonomyHours)}</div>
                    <div class="stat-label">Autonomía Estimada</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${result.autonomyMinutes.toFixed(0)}</div>
                    <div class="stat-label">Minutos</div>
                </div>
            </div>
            <div class="alert alert-success mt-4">
                <div class="alert-icon">✓</div>
                <div class="alert-content">
                    <div class="alert-title">Parámetros de la Batería</div>
                    <div class="alert-message">
                        Energía Total: ${result.energy.toFixed(2)}Wh<br>
                        Autonomía: ${this.formatTime(result.autonomyHours)}<br>
                        Consumo: ${result.consumption}A @ ${result.voltage}V
                    </div>
                </div>
            </div>
        `;

        notification.success('Cálculo realizado correctamente');
    }
}
