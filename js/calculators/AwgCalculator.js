/**
 * AWG Calculator
 * Conversión AWG ↔ mm²
 */
import { HeaderComponent } from '../components/Header.js';
import notification from '../notification.js';

export class AwgCalculator {
    constructor(state) {
        this.state = state;
        this.id = 'awg';
        this.name = 'Conversor AWG';
        this.awgData = [
            { awg: '4/0', mm2: 120, amperes: 195 },
            { awg: '3/0', mm2: 95, amperes: 165 },
            { awg: '2/0', mm2: 70, amperes: 145 },
            { awg: '1/0', mm2: 50, amperes: 125 },
            { awg: '1', mm2: 42, amperes: 110 },
            { awg: '2', mm2: 33, amperes: 95 },
            { awg: '3', mm2: 26, amperes: 85 },
            { awg: '4', mm2: 21, amperes: 70 },
            { awg: '6', mm2: 13, amperes: 55 },
            { awg: '8', mm2: 8.4, amperes: 40 },
            { awg: '10', mm2: 5.26, amperes: 30 },
            { awg: '12', mm2: 3.31, amperes: 20 },
            { awg: '14', mm2: 2.08, amperes: 15 },
            { awg: '16', mm2: 1.31, amperes: 13 },
            { awg: '18', mm2: 0.823, amperes: 10 },
            { awg: '20', mm2: 0.518, amperes: 7 },
            { awg: '22', mm2: 0.326, amperes: 5 }
        ];
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
        subtitle.textContent = 'Convierte entre AWG y milímetros cuadrados';

        cardHeader.appendChild(title);
        cardHeader.appendChild(subtitle);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'flex gap-2 mb-4 border-bottom';

        const tab1 = document.createElement('button');
        tab1.className = 'btn-secondary active';
        tab1.textContent = 'AWG a mm²';
        tab1.dataset.tab = 'awg-to-mm2';

        const tab2 = document.createElement('button');
        tab2.className = 'btn-secondary';
        tab2.textContent = 'mm² a AWG';
        tab2.dataset.tab = 'mm2-to-awg';

        tabsContainer.appendChild(tab1);
        tabsContainer.appendChild(tab2);

        cardBody.appendChild(tabsContainer);

        // Tab 1: AWG to mm2
        const tab1Content = document.createElement('div');
        tab1Content.dataset.tab = 'awg-to-mm2';

        const awgSelect = document.createElement('select');
        awgSelect.className = 'form-control mb-3';
        awgSelect.innerHTML = '<option value="">Selecciona AWG...</option>' +
            this.awgData.map(d => `<option value="${d.awg}">${d.awg} AWG</option>`).join('');

        tab1Content.appendChild(awgSelect);

        // Tab 2: mm2 to AWG
        const tab2Content = document.createElement('div');
        tab2Content.dataset.tab = 'mm2-to-awg';
        tab2Content.style.display = 'none';

        const mm2Input = document.createElement('input');
        mm2Input.type = 'number';
        mm2Input.className = 'form-control';
        mm2Input.placeholder = 'Ingresa mm²';
        mm2Input.step = 'any';

        tab2Content.appendChild(mm2Input);

        cardBody.appendChild(tab1Content);
        cardBody.appendChild(tab2Content);

        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'mt-4';
        resultsDiv.id = 'results';

        cardBody.appendChild(resultsDiv);

        cardHeader.style.borderBottom = 'none';
        card.appendChild(cardHeader);
        card.appendChild(cardBody);

        content.appendChild(card);
        container.appendChild(content);

        // Tab switching
        tab1.addEventListener('click', () => {
            tab1Content.style.display = 'block';
            tab2Content.style.display = 'none';
            tab1.classList.add('active');
            tab2.classList.remove('active');
        });

        tab2.addEventListener('click', () => {
            tab1Content.style.display = 'none';
            tab2Content.style.display = 'block';
            tab2.classList.add('active');
            tab1.classList.remove('active');
        });

        // Conversions
        awgSelect.addEventListener('change', () => {
            if (!awgSelect.value) {
                resultsDiv.innerHTML = '';
                return;
            }

            const data = this.awgData.find(d => d.awg === awgSelect.value);
            this.showResults(data, resultsDiv, 'awg');

            this.state.addToHistory({
                calculatorId: this.id,
                calculatorName: this.name,
                inputs: { awg: awgSelect.value },
                results: { mm2: data.mm2, amperes: data.amperes }
            });
        });

        mm2Input.addEventListener('input', () => {
            const value = this.parseNumber(mm2Input.value);
            if (value === null) {
                resultsDiv.innerHTML = '';
                return;
            }

            const closest = this.findClosestAWG(value);
            this.showResults(closest, resultsDiv, 'mm2');
        });

        return container;
    }

    parseNumber(value) {
        const num = parseFloat(value);
        return isNaN(num) || num === '' ? null : num;
    }

    findClosestAWG(mm2) {
        let closest = this.awgData[0];
        let minDiff = Math.abs(closest.mm2 - mm2);

        for (let i = 1; i < this.awgData.length; i++) {
            const diff = Math.abs(this.awgData[i].mm2 - mm2);
            if (diff < minDiff) {
                minDiff = diff;
                closest = this.awgData[i];
            }
        }

        return closest;
    }

    showResults(data, container, mode) {
        if (mode === 'awg') {
            container.innerHTML = `
                <div class="stat-group">
                    <div class="stat-item">
                        <div class="stat-value">${data.mm2}</div>
                        <div class="stat-label">Área (mm²)</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${data.amperes}</div>
                        <div class="stat-label">Corriente (A)</div>
                    </div>
                </div>
                <div class="alert alert-success mt-4">
                    <div class="alert-icon">✓</div>
                    <div class="alert-content">
                        <div class="alert-title">Conversión</div>
                        <div class="alert-message">
                            ${data.awg} AWG = ${data.mm2} mm²<br>
                            Capacidad: ${data.amperes}A
                        </div>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="stat-group">
                    <div class="stat-item">
                        <div class="stat-value">${data.awg}</div>
                        <div class="stat-label">AWG Más Cercano</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${data.amperes}</div>
                        <div class="stat-label">Corriente (A)</div>
                    </div>
                </div>
                <div class="alert alert-success mt-4">
                    <div class="alert-icon">✓</div>
                    <div class="alert-content">
                        <div class="alert-title">Conversión</div>
                        <div class="alert-message">
                            ${data.mm2} mm² ≈ ${data.awg} AWG<br>
                            Capacidad: ${data.amperes}A
                        </div>
                    </div>
                </div>
            `;
        }

        notification.success('Conversión realizada');
    }
}
