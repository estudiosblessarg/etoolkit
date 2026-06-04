/**
 * Router System
 * Gestiona la navegación SPA sin recargar página
 */
class Router {
    constructor() {
        this.routes = [];
        this.currentRoute = null;
        this.listeners = new Set();
        this.setupHistoryListener();
    }

    register(pattern, handler) {
        this.routes.push({
            pattern: pattern,
            regex: this.patternToRegex(pattern),
            handler: handler
        });
        return this;
    }

    patternToRegex(pattern) {
        const regexPattern = pattern
            .replace(/\//g, '\\/')
            .replace(/:([a-zA-Z0-9_]+)/g, '([^/]+)');
        return new RegExp(`^${regexPattern}$`);
    }

    extractParams(pattern, path) {
        const paramNames = (pattern.match(/:([a-zA-Z0-9_]+)/g) || [])
            .map(p => p.slice(1));
        const regex = this.patternToRegex(pattern);
        const matches = path.match(regex);

        if (!matches) return null;

        const params = {};
        paramNames.forEach((name, index) => {
            params[name] = matches[index + 1];
        });

        return params;
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notifyListeners(route) {
        this.listeners.forEach(listener => listener(route));
    }

    navigate(path, data = {}) {
        const route = this.routes.find(r => r.regex.test(path));

        if (!route) {
            console.warn(`Route not found: ${path}`);
            return false;
        }

        const params = this.extractParams(route.pattern, path);
        this.currentRoute = { path, data: { ...data, ...params } };

        // Ejecutar handler
        route.handler(this.currentRoute.data);

        // Notificar listeners
        this.notifyListeners(this.currentRoute);

        // Actualizar URL sin recargar
        window.history.pushState(this.currentRoute, '', `#${path}`);

        // Scroll al top
        document.querySelector('.content')?.scrollTo(0, 0);

        return true;
    }

    setupHistoryListener() {
        window.addEventListener('hashchange', () => {
            const path = window.location.hash.slice(1) || '/';
            this.navigate(path, {});
        });

        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.path) {
                this.navigate(event.state.path, event.state.data);
            }
        });
    }

    getCurrentRoute() {
        return this.currentRoute;
    }
}

export default new Router();
