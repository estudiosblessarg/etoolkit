/**
 * MOSFET Calculator
 * Calcula potencia disipada
 */
import { HeaderComponent } from '../components/Header.js';
import notification from '../notification.js';

export class MosfetCalculator {
    constructor(state) {
        this.state = state;
        this.id = 'mosfet';
        this.name = 'Calculador MOSFET';
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
        subtitle.textContent = 'P = I² × Rds(on)';

        cardHeader.appendChild(title);
        cardHeader.appendChild(subtitle);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const formRow = document.createElement('div');
        formRow.className = 'form-group-row';

        const iGroup = this.createInputGroup('Corriente (A)', 'current', 'A');
        const rdsGroup = this.createInputGroup('Rds(on) (Ω)', 'rds', 'Ω');

        formRow.appendChild(iGroup);
        formRow.appendChild(rdsGroup);

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

        const iInput = iGroup.querySelector('input');
        const rdsInput = rdsGroup.querySelector('input');

        calcBtn.addEventListener('click', () => {
            const current = this.parseNumber(iInput.value);
            const rds = this.parseNumber(rdsInput.value);

            if (current === null || rds === null) {
                notification.error('Todos los campos son requeridos');
                return;
            }

            if (current < 0 || rds < 0) {
                notification.error('Los valores deben ser positivos');
                return;
            }

            const result = this.calculate(current, rds);
            this.showResults(result, resultsDiv);

            this.state.addToHistory({
                calculatorId: this.id,
                calculatorName: this.name,
                inputs: { current, rds },
                results: result
            });
        });

        clearBtn.addEventListener('click', () => {
            iInput.value = '';
            rdsInput.value = '';
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

    calculate(current, rds) {
        const power = Math.pow(current, 2) * rds;
        const voltage = current * rds;

        return {
            power: power,
            voltage: voltage,
            current: current,
            rds: rds
        };
    }

    showResults(result, container) {
        const thermalWarning = result.power > 1 ? `
            <div class="alert alert-warning mt-4">
                <div class="alert-icon">⚠</div>
                <div class="alert-content">
                    <div class="alert-title">Advertencia Térmica</div>
                    <div class="alert-message">Potencia > 1W: Considera usar disipador térmico</div>
                </div>
            </div>
        ` : '';

        container.innerHTML = `
            <div class="stat-group">
                <div class="stat-item">
                    <div class="stat-value">${result.power.toFixed(4)}</div>
                    <div class="stat-label">Potencia (W)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${result.voltage.toFixed(4)}</div>
                    <div class="stat-label">Caída de Voltaje (V)</div>
                </div>
            </div>
            <div class="alert alert-success mt-4">
                <div class="alert-icon">✓</div>
                <div class="alert-content">
                    <div class="alert-title">Parámetros MOSFET</div>
                    <div class="alert-message">
                        P = I² × Rds = ${result.current.toFixed(4)}² × ${result.rds.toFixed(4)}<br>
                        P = ${result.power.toFixed(4)}W<br>
                        Vds = ${result.voltage.toFixed(4)}V
                    </div>
                </div>
            </div>
            ${thermalWarning}
        `;

        notification.success('Cálculo realizado correctamente');
    }
}
