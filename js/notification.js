/**
 * Notification System
 * Sistema de notificaciones toast
 */
class NotificationManager {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.toasts = new Map();
    }

    show(message, type = 'info', duration = 3000) {
        const id = Date.now();
        const toast = this.createToastElement(id, message, type);

        this.container.appendChild(toast);
        this.toasts.set(id, toast);

        if (duration > 0) {
            setTimeout(() => this.remove(id), duration);
        }

        return id;
    }

    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 3000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 3000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }

    createToastElement(id, message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type} animate-slide-in-right`;
        toast.dataset.toastId = id;

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-message">${this.escapeHtml(message)}</div>
            <button class="toast-close" data-close="${id}">✕</button>
        `;

        const closeBtn = toast.querySelector('[data-close]');
        closeBtn.addEventListener('click', () => this.remove(id));

        return toast;
    }

    remove(id) {
        const toast = this.toasts.get(id);
        if (toast) {
            toast.style.animation = 'slideInRight 0.3s ease-in-out reverse';
            setTimeout(() => {
                toast.remove();
                this.toasts.delete(id);
            }, 300);
        }
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

export default new NotificationManager();
