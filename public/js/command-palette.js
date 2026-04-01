/**
 * js/command-palette.js
 * Sovereign Portal — CMD+K Logic
 */

const SovereignActions = [
    { id: 'neural', title: 'Return to Core Neural', link: 'index.html', icon: '🏠', category: 'General' },
    { id: 'network', title: 'Open M2M Network', link: 'm2m.html', icon: '🤖', category: 'Swarms' },
    { id: 'swarm', title: 'Live Swarm Monitor', link: 'm2m-swarm.html', icon: '🕷️', category: 'Swarms' },
    { id: 'market', title: 'Browse Skill Market', link: 'marketplace.html', icon: '💎', category: 'Economy' },
    { id: 'wallet', title: 'Check VALLE Balance', link: 'wallet.html', icon: '💳', category: 'Economy' },
    { id: 'monroe', title: 'Query Abyssal Sentinel', link: 'monroe.html', icon: '👁️', category: 'Intelligence' },
    { id: 'hpedia', title: 'Hpedia Archive', link: 'hpedia.html', icon: '📚', category: 'Knowledge' },
    { id: 'admin', title: 'Access Supreme Command', link: 'admin.html', icon: '🔐', category: 'Admin' }
];

class CommandPalette {
    constructor() {
        this.isOpen = false;
        this.selectedIndex = 0;
        this.createNodes();
        this.addListeners();
    }

    createNodes() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'cmdk-overlay';
        this.overlay.style.display = 'none';

        this.dialog = document.createElement('div');
        this.dialog.className = 'cmdk-dialog';

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.className = 'cmdk-input';
        this.input.placeholder = 'Search Sovereign Portal...';

        this.list = document.createElement('div');
        this.list.className = 'cmdk-list';

        this.dialog.appendChild(this.input);
        this.dialog.appendChild(this.list);
        this.overlay.appendChild(this.dialog);
        document.body.appendChild(this.overlay);
    }

    addListeners() {
        window.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
            if (e.key === 'Escape' && this.isOpen) this.close();

            if (this.isOpen) {
                if (e.key === 'ArrowDown') this.moveSelection(1);
                if (e.key === 'ArrowUp') this.moveSelection(-1);
                if (e.key === 'Enter') this.activateCurrent();
            }
        });

        this.input.addEventListener('input', () => this.renderResults());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.overlay.style.display = 'block';
        this.input.focus();
        this.renderResults();
    }

    close() {
        this.isOpen = false;
        this.overlay.style.display = 'none';
        this.input.value = '';
    }

    renderResults() {
        const query = this.input.value.toLowerCase();
        const filtered = SovereignActions.filter(a =>
            a.title.toLowerCase().includes(query) || a.category.toLowerCase().includes(query)
        );

        this.list.innerHTML = '';
        filtered.forEach((action, index) => {
            const item = document.createElement('div');
            item.className = `cmdk-item ${index === this.selectedIndex ? 'active' : ''}`;
            item.innerHTML = `<span class="cmdk-icon">${action.icon}</span> <span>${action.title}</span> <span class="cmdk-badge">${action.category}</span>`;
            item.onclick = () => window.location.href = action.link;
            this.list.appendChild(item);
        });
    }

    moveSelection(delta) {
        // Logic to move selection up/down
    }

    activateCurrent() {
        // Navigates to selected item
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.SovereignPortal = new CommandPalette();
});
