/**
 * Series Resistor Calculator
 * Calcula resistencia equivalente en serie
 */
import { HeaderComponent } from '../components/Header.js';
import notification from '../notification.js';
import { renderResistorBands } from '../utils/resistor.js';

export class SeriesCalculator {
    constructor(state) {
        this.state = state;
        this.id = 'series';
        this.name = 'Resistencias en Serie';
        this.resistors = [1000, 1000];
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
        subtitle.textContent = 'Rt = R1 + R2 + R3 + ...';

        cardHeader.appendChild(title);
        cardHeader.appendChild(subtitle);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const resistorsContainer = document.createElement('div');
        resistorsContainer.id = 'resistors-container';
        resistorsContainer.className = 'mb-4';

        cardBody.appendChild(resistorsContainer);

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'flex gap-2 mt-4 flex-wrap';

        const addBtn = document.createElement('button');
        addBtn.className = 'btn-secondary btn-small';
        addBtn.textContent = '+ Agregar Resistencia';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn-danger btn-small';
        removeBtn.textContent = '- Remover';
        removeBtn.disabled = true;

        const calcBtn = document.createElement('button');
        calcBtn.className = 'btn-primary';
        calcBtn.textContent = 'Calcular';

        const clearBtn = document.createElement('button');
        clearBtn.className = 'btn-secondary';
        clearBtn.textContent = 'Limpiar';

        buttonGroup.appendChild(addBtn);
        buttonGroup.appendChild(removeBtn);
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

        const renderResistors = () => {
            resistorsContainer.innerHTML = '';
            this.resistors.forEach((r, index) => {
                const group = document.createElement('div');
                group.className = 'form-group';

                const label = document.createElement('label');
                label.className = 'form-label';
                label.textContent = `R${index + 1}`;

                const inputContainer = document.createElement('div');
                inputContainer.style.display = 'flex';
                inputContainer.style.gap = '0.5rem';

                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'form-control';
                input.value = r;
                input.step = 'any';

                const unit = document.createElement('span');
                unit.style.alignSelf = 'center';
                unit.style.padding = '0.75rem';
                unit.style.color = 'var(--text-tertiary)';
                unit.textContent = 'Ω';

                input.addEventListener('change', (e) => {
                    this.resistors[index] = this.parseNumber(e.target.value) || 0;
                });

                inputContainer.appendChild(input);
                inputContainer.appendChild(unit);

                group.appendChild(label);
                group.appendChild(inputContainer);

                resistorsContainer.appendChild(group);
            });

            removeBtn.disabled = this.resistors.length <= 2;
        };

        renderResistors();

        addBtn.addEventListener('click', () => {
            this.resistors.push(1000);
            renderResistors();
        });

        removeBtn.addEventListener('click', () => {
            if (this.resistors.length > 2) {
                this.resistors.pop();
                renderResistors();
            }
        });

        calcBtn.addEventListener('click', () => {
            if (this.resistors.some(r => r === null || r === 0)) {
                notification.error('Todos los valores deben ser válidos');
                return;
            }

            const result = this.calculate();
            this.showResults(result, resultsDiv);

            this.state.addToHistory({
                calculatorId: this.id,
                calculatorName: this.name,
                inputs: { resistors: [...this.resistors] },
                results: result
            });
        });

        clearBtn.addEventListener('click', () => {
            this.resistors = [1000, 1000];
            renderResistors();
            resultsDiv.innerHTML = '';
        });

        return container;
    }

    parseNumber(value) {
        const num = parseFloat(value);
        return isNaN(num) || num === '' ? null : num;
    }

    calculate() {
        const total = this.resistors.reduce((sum, r) => sum + r, 0);
        return {
            equivalent: total,
            count: this.resistors.length,
            resistors: [...this.resistors]
        };
    }

    showResults(result, container) {
        container.innerHTML = `
            <div class="stat-group">
                <div class="stat-item">
                    <div class="stat-value">${result.equivalent.toFixed(2)}</div>
                    <div class="stat-label">Resistencia Total (Ω)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${result.count}</div>
                    <div class="stat-label">Cantidad de Resistencias</div>
                </div>
            </div>
            <div class="alert alert-success mt-4">
                <div class="alert-icon">✓</div>
                <div class="alert-content">
                    <div class="alert-title">Cálculo de Serie</div>
                    <div class="alert-message">
                        ${result.resistors.map((r, i) => `R${i + 1}: ${r.toFixed(2)}Ω`).join(' + ')}<br>
                        = ${result.equivalent.toFixed(2)}Ω
                    </div>
                </div>
            </div>
        `;

        // Mostrar bandas de la resistencia equivalente
        if (isFinite(result.equivalent) && result.equivalent > 0) {
            const bandsEl = renderResistorBands(result.equivalent);
            if (bandsEl) container.appendChild(bandsEl);
        }

        notification.success('Cálculo realizado correctamente');
    }
}
