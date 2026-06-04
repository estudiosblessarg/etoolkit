/**
 * State Management System
 * Gestiona el estado global de la aplicación
 */
class StateManager {
    constructor() {
        this.state = {
            currentPage: 'dashboard',
            currentCalculator: null,
            sidebarCollapsed: window.innerWidth <= 1024,
            favorites: this.loadFromStorage('favorites') || [],
            history: this.loadFromStorage('history') || [],
            lastResults: {},
            theme: 'dark'
        };

        this.listeners = new Set();
        this.setupWindowResize();
    }

    setupWindowResize() {
        window.addEventListener('resize', () => {
            const shouldCollapse = window.innerWidth <= 1024;
            if (shouldCollapse !== this.state.sidebarCollapsed) {
                this.state.sidebarCollapsed = shouldCollapse;
                this.notifyListeners();
            }
        });
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }

    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.notifyListeners();
    }

    toggleSidebar() {
        this.setState({ sidebarCollapsed: !this.state.sidebarCollapsed });
    }

    setCurrentPage(page) {
        this.setState({ currentPage: page });
    }

    setCurrentCalculator(calculator) {
        this.setState({ currentCalculator: calculator });
    }

    addToFavorites(calculatorId) {
        if (!this.state.favorites.includes(calculatorId)) {
            this.state.favorites.push(calculatorId);
            this.saveToStorage('favorites', this.state.favorites);
            this.notifyListeners();
        }
    }

    removeFromFavorites(calculatorId) {
        this.state.favorites = this.state.favorites.filter(id => id !== calculatorId);
        this.saveToStorage('favorites', this.state.favorites);
        this.notifyListeners();
    }

    toggleFavorite(calculatorId) {
        if (this.state.favorites.includes(calculatorId)) {
            this.removeFromFavorites(calculatorId);
        } else {
            this.addToFavorites(calculatorId);
        }
    }

    isFavorite(calculatorId) {
        return this.state.favorites.includes(calculatorId);
    }

    addToHistory(entry) {
        const historyEntry = {
            id: Date.now(),
            calculatorId: entry.calculatorId,
            calculatorName: entry.calculatorName,
            inputs: entry.inputs,
            results: entry.results,
            timestamp: new Date().toISOString()
        };

        this.state.history.unshift(historyEntry);
        if (this.state.history.length > 50) {
            this.state.history = this.state.history.slice(0, 50);
        }

        this.saveToStorage('history', this.state.history);
        this.notifyListeners();

        return historyEntry;
    }

    clearHistory() {
        this.state.history = [];
        this.saveToStorage('history', []);
        this.notifyListeners();
    }

    getHistory() {
        return this.state.history;
    }

    saveLastResult(calculatorId, result) {
        this.state.lastResults[calculatorId] = result;
    }

    getLastResult(calculatorId) {
        return this.state.lastResults[calculatorId];
    }

    saveToStorage(key, value) {
        try {
            localStorage.setItem(`etoolkit_${key}`, JSON.stringify(value));
        } catch (error) {
            console.error(`Error saving to storage: ${error.message}`);
        }
    }

    loadFromStorage(key) {
        try {
            const item = localStorage.getItem(`etoolkit_${key}`);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error loading from storage: ${error.message}`);
            return null;
        }
    }

    exportToJSON() {
        return {
            format: 'etoolkit',
            version: '1.0',
            favorites: this.state.favorites,
            history: this.state.history,
            exportedAt: new Date().toISOString()
        };
    }

    importFromJSON(data) {
        if (!data || data.format !== 'etoolkit' || data.version !== '1.0') {
            return false;
        }

        if (Array.isArray(data.favorites)) {
            this.state.favorites = data.favorites;
            this.saveToStorage('favorites', this.state.favorites);
        }
        if (Array.isArray(data.history)) {
            this.state.history = data.history;
            this.saveToStorage('history', this.state.history);
        }
        this.notifyListeners();
        return true;
    }
}

export default new StateManager();
