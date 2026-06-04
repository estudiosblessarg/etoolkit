/**
 * Header Component
 * Componente de encabezado principal
 */
import notification from '../notification.js';

export class HeaderComponent {
    constructor(state, router) {
        this.state = state;
        this.router = router;
    }

    render(title = 'Electrónica Toolkit') {
        const header = document.createElement('div');
        header.className = 'header animate-fade-in';

        const headerLeft = document.createElement('div');
        headerLeft.className = 'header-left';

        const headerTitle = document.createElement('h1');
        headerTitle.className = 'header-title';
        headerTitle.textContent = title;

        headerLeft.appendChild(headerTitle);

        const headerRight = document.createElement('div');
        headerRight.className = 'header-right';

        const importBtn = document.createElement('button');
        importBtn.className = 'btn-secondary btn-small';
        importBtn.innerHTML = '⬆ Importar';

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.etoolkit,.json,application/json';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', (event) => this.handleFileImport(event));

        importBtn.addEventListener('click', () => fileInput.click());

        const exportBtn = document.createElement('button');
        exportBtn.className = 'btn-secondary btn-small';
        exportBtn.innerHTML = '⬇ Exportar';
        exportBtn.addEventListener('click', () => this.handleExport());

        const historyBtn = document.createElement('button');
        historyBtn.className = 'btn-secondary btn-small';
        historyBtn.innerHTML = '🗑 Historial';
        historyBtn.addEventListener('click', () => this.handleHistory());

        headerRight.appendChild(importBtn);
        headerRight.appendChild(exportBtn);
        headerRight.appendChild(historyBtn);
        header.appendChild(fileInput);

        header.appendChild(headerLeft);
        header.appendChild(headerRight);

        return header;
    }

    handleExport() {
        const data = this.state.exportToJSON();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `etoolkit-${new Date().getTime()}.etoolkit`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    handleFileImport(event) {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            try {
                const content = loadEvent.target.result;
                const data = JSON.parse(content);

                if (!data || data.format !== 'etoolkit' || data.version !== '1.0') {
                    notification.error('El archivo no corresponde a un formato EToolkit válido.');
                    return;
                }

                this.state.importFromJSON(data);
                notification.success('Archivo importado correctamente.');
            } catch (error) {
                notification.error('No se pudo leer el archivo. Asegurate de seleccionar un archivo válido.');
            } finally {
                event.target.value = '';
            }
        };

        reader.readAsText(file);
    }

    handleHistory() {
        const history = this.state.getHistory();
        if (history.length === 0) {
            notification.info('No hay historial disponible.');
            return;
        }

        if (document.querySelector('.app-modal-overlay')) {
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'app-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'app-modal';

        modal.innerHTML = `
            <div class="app-modal-header">
                <div>
                    <h2>Historial de cálculos</h2>
                    <p class="app-modal-subtitle">Revisa tus últimos cálculos guardados en la app.</p>
                </div>
                <button class="app-modal-close" type="button">✕</button>
            </div>
            <div class="app-modal-tip">
                <strong>Importar / Exportar</strong> usa el botón de importar para cargar archivos <code>.etoolkit</code> y el botón de exportar para guardar tu historial y favoritos en un formato propio.
            </div>
            <div class="app-modal-body">
                ${history.map(entry => `
                    <div class="history-item">
                        <div class="history-meta">
                            <strong>${entry.calculatorName}</strong>
                            <span>${new Date(entry.timestamp).toLocaleString()}</span>
                        </div>
                        <div class="history-details">
                            ${Object.entries(entry.inputs).map(([key, value]) => `<span>${key}: ${value}</span>`).join(' · ')}
                        </div>
                        <div class="history-result">Resultado: ${JSON.stringify(entry.results)}</div>
                    </div>
                `).join('')}
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const closeButton = modal.querySelector('.app-modal-close');
        closeButton.addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });
    }

    scheduleSupportModal() {
        const showSupport = () => {
            if (document.querySelector('.app-modal-overlay')) {
                return;
            }
            this.showSupportModal();
        };

        setTimeout(() => {
            showSupport();
            setInterval(showSupport, 10 * 60 * 1000);
        }, 3000);
    }

    showSupportModal() {
        if (document.querySelector('.app-modal-overlay')) {
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'app-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'app-modal';

        modal.innerHTML = `
            <div class="app-modal-header">
    <div>
        <h2>¿Te resulta útil esta app?</h2>
        <p class="app-modal-subtitle">Ayudanos a seguir mejorando el proyecto.</p>
    </div>
    <button class="app-modal-close" type="button">✕</button>
</div>

<div class="app-modal-tip">
    <strong>Con una donación de $1000 ya nos ayudás muchísimo.</strong>
    Cada aporte nos permite mantener la app funcionando, corregir errores, agregar nuevas herramientas y seguir desarrollando mejoras para toda la comunidad.
</div>

<div class="app-modal-body">
    <p>
        Si esta aplicación te fue útil para tu trabajo, estudio o proyectos personales, podés colaborar con una donación de <strong>$1000 ARS</strong>.
    </p>

    <p>
        La app seguirá siendo gratuita, pero cada aporte ayuda a cubrir los costos de desarrollo y nos permite seguir creando nuevas funciones para todos.
    </p>

    <div style="text-align:center; margin:20px 0;">
        <a
            href="http://link.mercadopago.com.ar/etoolkit"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary"
            style="display:inline-block;"
        >
            ❤️ Donar $1000
        </a>
    </div>

    <p class="text-muted">
        Gracias por apoyar este proyecto independiente. Cada colaboración suma.
    </p>
</div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const closeButton = modal.querySelector('.app-modal-close');
        closeButton.addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });
    }
}
