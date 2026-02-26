/**
 * js/theme-toggle.js
 */
document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('humanese-theme') || 'dark';
    applyTheme(theme);

    // Create the toggle if it doesn't exist
    if (!document.getElementById('theme-toggle-container')) {
        const toggleContainer = document.createElement('div');
        toggleContainer.id = 'theme-toggle-container';
        toggleContainer.innerHTML = `
            <input type="checkbox" id="theme-switch" class="day-night-switch" ${theme === 'light' ? 'checked' : ''}>
            <label for="theme-switch" class="day-night-switch-label">
                <div class="celestial sun"></div>
                <div class="celestial moon">
                    <div class="craters">
                        <div class="crater"></div>
                        <div class="crater"></div>
                        <div class="crater"></div>
                    </div>
                </div>
                <div class="decorations">
                    <div class="decoration"></div>
                    <div class="decoration"></div>
                    <div class="decoration"></div>
                </div>
                <div class="mountains">
                    <div></div>
                    <div></div>
                </div>
            </label>
        `;
        document.body.appendChild(toggleContainer);

        document.getElementById('theme-switch').addEventListener('change', (e) => {
            const newTheme = e.target.checked ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('humanese-theme', newTheme);
        });
    }
});

function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.classList.add('light-mode');
    } else {
        document.documentElement.classList.remove('light-mode');
    }
}
