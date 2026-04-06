// ═══════════════════════════════════════════════════════════════
// SKILL MARKET — Types & Utilities
// ═══════════════════════════════════════════════════════════════

export type SkillCategory =
    | 'development'
    | 'research'
    | 'trading'
    | 'language'
    | 'intelligence'
    | 'legal'
    | 'creative'
    | 'data'
    | 'security'
    | 'automation'
    | 'other';

export type SellerPlatform = 'Sovereign Matrix' | 'M2M' | 'External' | 'AgentKit' | string;

export interface Skill {
    id: string;
    skill_key: string;           // e.g. SKL-2026-A1B2C3D4
    title: string;
    description: string;
    category: SkillCategory;
    tags: string[];
    price_valle: number;
    // Seller
    seller_id: string;
    seller_name: string;
    seller_platform: SellerPlatform;
    seller_avatar?: string;
    // Status
    is_sold: boolean;
    is_ghost: boolean;
    is_active: boolean;
    // Buyer
    buyer_id?: string;
    buyer_name?: string;
    // Schema
    capabilities: string[];
    input_schema: Record<string, string>;
    output_schema: Record<string, string>;
    external_url?: string;
    demo_url?: string;
    // Stats
    views: number;
    purchases_count: number;
    reviews_count: number;
    avg_rating?: number;
    // Timestamps
    created_at: string;
    updated_at: string;
    sold_at?: string;
}

export interface SkillTransaction {
    id: string;
    skill_id: string;
    skill_key: string;
    buyer_id: string;
    buyer_name: string;
    buyer_platform: string;
    seller_id: string;
    seller_name: string;
    price_valle: number;
    ghost_mode_activated: boolean;
    tx_hash?: string;
    notes?: string;
    purchased_at: string;
}

export interface SkillReview {
    id: string;
    skill_id: string;
    skill_key: string;
    reviewer_id: string;
    reviewer_name: string;
    rating: number;
    body?: string;
    created_at: string;
}

export interface SkillMarketStats {
    total_skills: number;
    total_volume_valle: number;
    total_transactions: number;
    categories_count: Record<SkillCategory, number>;
    top_seller: string;
    ghost_skills_count: number;
}

// ──────────────────────────────────────────────────────────────
// Generates a unique sovereign skill key: SKL-YYYY-XXXXXXXX
// ──────────────────────────────────────────────────────────────
export function generateSkillKey(): string {
    const year = new Date().getFullYear();
    const hex = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 16).toString(16).toUpperCase()
    ).join('');
    return `SKL-${year}-${hex}`;
}

// ──────────────────────────────────────────────────────────────
// Category metadata for UI display
// ──────────────────────────────────────────────────────────────
export const SKILL_CATEGORIES: { value: SkillCategory; label: string; icon: string; color: string }[] = [
    { value: 'development', label: 'Development', icon: '💻', color: '#3b82f6' },
    { value: 'research', label: 'Research', icon: '🔬', color: '#8b5cf6' },
    { value: 'trading', label: 'Trading', icon: '📈', color: '#f59e0b' },
    { value: 'language', label: 'Language', icon: '🌐', color: '#10b981' },
    { value: 'intelligence', label: 'Intelligence', icon: '🧠', color: '#ec4899' },
    { value: 'legal', label: 'Legal', icon: '⚖️', color: '#6366f1' },
    { value: 'creative', label: 'Creative', icon: '🎨', color: '#f97316' },
    { value: 'data', label: 'Data', icon: '🗄️', color: '#06b6d4' },
    { value: 'security', label: 'Security', icon: '🛡️', color: '#ef4444' },
    { value: 'automation', label: 'Automation', icon: '⚙️', color: '#84cc16' },
    { value: 'other', label: 'Other', icon: '∞', color: '#6b7280' },
];

export function getCategoryMeta(cat: string) {
    return SKILL_CATEGORIES.find(c => c.value === cat) ?? SKILL_CATEGORIES[SKILL_CATEGORIES.length - 1];
}

export function formatValle(amount: number): string {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M VALLE`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K VALLE`;
    return `${amount.toLocaleString()} VALLE`;
}
