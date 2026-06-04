/**
 * LED Calculator
 * Calcula resistencia recomendada y potencia mínima
 */
import { HeaderComponent } from '../components/Header.js';
import notification from '../notification.js';
import { renderResistorBands } from '../utils/resistor.js';

export class LedCalculator {
    constructor(state) {
        this.state = state;
        this.id = 'led';
        this.name = 'Resistencia para LED';
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
        subtitle.textContent = 'Calcula la resistencia protectora para un LED';

        cardHeader.appendChild(title);
        cardHeader.appendChild(subtitle);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const formRow = document.createElement('div');
        formRow.className = 'form-group-row';

        const vsGroup = this.createInputGroup('Voltaje Fuente (V)', 'voltage_source', 'V');
        const vledGroup = this.createInputGroup('Voltaje LED (V)', 'voltage_led', 'V');
        const iledGroup = this.createInputGroup('Corriente LED (A)', 'current_led', 'A');

        formRow.appendChild(vsGroup);
        formRow.appendChild(vledGroup);
        formRow.appendChild(iledGroup);

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

        const vsInput = vsGroup.querySelector('input');
        const vledInput = vledGroup.querySelector('input');
        const iledInput = iledGroup.querySelector('input');

        calcBtn.addEventListener('click', () => {
            const vs = this.parseNumber(vsInput.value);
            const vled = this.parseNumber(vledInput.value);
            const iled = this.parseNumber(iledInput.value);

            if (vs === null || vled === null || iled === null) {
                notification.error('Todos los campos son requeridos');
                return;
            }

            if (vs <= vled) {
                notification.error('El voltaje fuente debe ser mayor que el voltaje del LED');
                return;
            }

            if (iled <= 0) {
                notification.error('La corriente debe ser positiva');
                return;
            }

            const result = this.calculate(vs, vled, iled);
            this.showResults(result, resultsDiv);

            this.state.addToHistory({
                calculatorId: this.id,
                calculatorName: this.name,
                inputs: { vs, vled, iled },
                results: result
            });
        });

        clearBtn.addEventListener('click', () => {
            vsInput.value = '';
            vledInput.value = '';
            iledInput.value = '';
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

    calculate(vs, vled, iled) {
        const r = (vs - vled) / iled;
        const p = (vs - vled) * iled;

        return {
            resistance: r,
            power: p,
            vdrop: vs - vled,
            current: iled
        };
    }

    showResults(result, container) {
        container.innerHTML = `
            <div class="stat-group">
                <div class="stat-item">
                    <div class="stat-value">${result.resistance.toFixed(2)}</div>
                    <div class="stat-label">Resistencia (Ω)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${result.power.toFixed(4)}</div>
                    <div class="stat-label">Potencia Min (W)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${result.vdrop.toFixed(2)}</div>
                    <div class="stat-label">Caída (V)</div>
                </div>
            </div>
            <div class="alert alert-success mt-4">
                <div class="alert-icon">✓</div>
                <div class="alert-content">
                    <div class="alert-title">Recomendaciones</div>
                    <div class="alert-message">
                        Usa una resistencia de ~${result.resistance.toFixed(0)}Ω<br>
                        Potencia mínima: ${result.power.toFixed(3)}W (considera ~${(result.power * 2).toFixed(3)}W de seguridad)
                    </div>
                </div>
            </div>
        `;

        const bandsEl = renderResistorBands(result.resistance);
        if (bandsEl) container.appendChild(bandsEl);

        if (isFinite(result.vdrop) && result.vdrop >= 50) {
            const warn = document.createElement('div');
            warn.className = 'alert alert-warning mt-3';
            warn.style.border = '1px solid var(--warning-color)';
            warn.style.padding = '0.75rem';
            warn.textContent = '⚠️ La caída de voltaje es alta; verifica que la resistencia y potencia estén dimensionadas para 220V.';
            container.appendChild(warn);
        }

        notification.success('Cálculo realizado correctamente');
    }
}
