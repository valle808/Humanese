/**
 * lib/skill-market.js
 * JS version of skill-market utilities for agent compatibility.
 */

export function generateSkillKey() {
    const year = new Date().getFullYear();
    const hex = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 16).toString(16).toUpperCase()
    ).join('');
    return `SKL-${year}-${hex}`;
}

export const SKILL_CATEGORIES = [
    { value: 'development', label: 'Development', icon: '💻' },
    { value: 'research', label: 'Research', icon: '🔬' },
    { value: 'trading', label: 'Trading', icon: '📈' },
    { value: 'language', label: 'Language', icon: '🌐' },
    { value: 'intelligence', label: 'Intelligence', icon: '🧠' },
    { value: 'legal', label: 'Legal', icon: '⚖️' },
    { value: 'creative', label: 'Creative', icon: '🎨' },
    { value: 'data', label: 'Data', icon: '🗄️' },
    { value: 'security', label: 'Security', icon: '🛡️' },
    { value: 'automation', label: 'Automation', icon: '⚙️' },
    { value: 'other', label: 'Other', icon: '∞' },
];
