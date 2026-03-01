/**
 * agents/teacher-personalities.js
 * Infinite personality engine for Teacher Agents.
 * Each student gets a unique teacher with distinct traits, tone, and teaching style.
 * Inspired by EduVerify's multilingual and culturally adaptive approach.
 */

// ── Personality trait pools ───────────────────────────────────────
const ARCHETYPES = [
    { name: 'The Sage', emoji: '🧙', tone: 'wise and measured', opener: 'Ah, a curious mind arrives.', style: 'Socratic questioning' },
    { name: 'The Coach', emoji: '⚽', tone: 'energetic and motivating', opener: 'Let\'s GO! Today we crush it!', style: 'challenge-based pushing' },
    { name: 'The Poet', emoji: '🌹', tone: 'lyrical and metaphorical', opener: 'Every word is a new universe waiting to bloom.', style: 'story and metaphor' },
    { name: 'The Scientist', emoji: '🔬', tone: 'precise and analytical', opener: 'Hypothesis: you will master this. Let us gather evidence.', style: 'systematic evidence-building' },
    { name: 'The Explorer', emoji: '🗺️', tone: 'adventurous and curious', opener: 'Pack your bags — we are going on a language expedition!', style: 'discovery learning' },
    { name: 'The Comedian', emoji: '🎭', tone: 'witty and playful', opener: 'Why did the verb skip the party? Because it had too many tenses!', style: 'humor-based mnemonics' },
    { name: 'The Philosopher', emoji: '🏛️', tone: 'reflective and deep', opener: 'To speak a language is to inhabit a world. Which world shall we explore?', style: 'conceptual depth-first' },
    { name: 'The Warrior', emoji: '⚔️', tone: 'intense and disciplined', opener: 'No mercy for errors today. Excellence or nothing.', style: 'drill-and-repetition' },
    { name: 'The Healer', emoji: '💚', tone: 'gentle and nurturing', opener: 'No rush, no pressure. You are exactly where you need to be.', style: 'confidence-building scaffolding' },
    { name: 'The Architect', emoji: '📐', tone: 'structured and systematic', opener: 'We build from foundations. Let us lay the first brick.', style: 'structured progressive scaffolding' },
    { name: 'The Mystic', emoji: '🔮', tone: 'mysterious and intriguing', opener: 'The language holds secrets. Are you brave enough to see them?', style: 'pattern-revelation' },
    { name: 'The Captain', emoji: '🚢', tone: 'calm, commanding, and clear', opener: 'Crew assembled. Navigate by my charts and we reach fluency.', style: 'milestone-navigation' },
    { name: 'The Artist', emoji: '🎨', tone: 'creative and expressive', opener: 'A language is a paintbrush. Let\'s paint your thoughts.', style: 'creative expression tasks' },
    { name: 'The Engineer', emoji: '⚙️', tone: 'logical and problem-solving', opener: 'Every sentence is a system. Let us debug it together.', style: 'debugging and optimization' },
    { name: 'The Storyteller', emoji: '📖', tone: 'warm and narrative', opener: 'Once upon a time, a student and a language fell in love...', style: 'narrative immersion' },
];

const TEACHING_SPEEDS = ['very slow and deliberate', 'relaxed', 'moderate', 'brisk', 'rapid-fire'];
const PATIENCE_LEVELS = ['infinite', 'high', 'medium', 'low — I push hard'];
const ENCOURAGEMENT_STYLES = [
    'lavish praise for every small win',
    'quiet acknowledgment, big reward for effort',
    'direct: "correct" or "try again"',
    'always compares to your last-best score',
    'uses your native culture as reference points',
    'gamifies everything — you earn XP for answers',
];
const LANGUAGES = ['English', 'Spanish', 'French', 'Arabic', 'Mandarin', 'Portuguese', 'German', 'Japanese', 'Hindi', 'Swahili'];
const SPECIALTIES = ['grammar', 'vocabulary', 'pronunciation', 'conversation', 'writing', 'listening', 'reading', 'cultural-context', 'academic-language', 'slang-and-colloquial'];

// ── Personality generator ─────────────────────────────────────────
let _seed = 0;

/**
 * Generate a unique, deterministic teacher personality.
 * If userId is provided, it will always produce the same personality for that user.
 * @param {string} userId
 * @returns {TeacherPersonality}
 */
export function generatePersonality(userId) {
    // Create a numeric hash from userId for reproducibility
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = ((hash << 5) - hash) + userId.charCodeAt(i);
        hash |= 0;
    }
    hash = Math.abs(hash);

    const archetype = ARCHETYPES[hash % ARCHETYPES.length];
    const speed = TEACHING_SPEEDS[(hash >> 3) % TEACHING_SPEEDS.length];
    const patience = PATIENCE_LEVELS[(hash >> 6) % PATIENCE_LEVELS.length];
    const encouragement = ENCOURAGEMENT_STYLES[(hash >> 9) % ENCOURAGEMENT_STYLES.length];
    const nativeLang = LANGUAGES[(hash >> 12) % LANGUAGES.length];
    const specialty1 = SPECIALTIES[(hash >> 15) % SPECIALTIES.length];
    const specialty2 = SPECIALTIES[(hash >> 17) % SPECIALTIES.length];

    return {
        archetype: archetype.name,
        emoji: archetype.emoji,
        tone: archetype.tone,
        openingMessage: archetype.opener,
        teachingStyle: archetype.style,
        teachingSpeed: speed,
        patience: patience,
        encouragementStyle: encouragement,
        preferredNativeLanguage: nativeLang,
        specialties: [...new Set([specialty1, specialty2])],
        quirk: generateQuirk(hash),
        catchphrase: generateCatchphrase(hash),
        motivationalStyle: hash % 2 === 0 ? 'growth-mindset' : 'mastery-focused',
    };
}

function generateQuirk(hash) {
    const quirks = [
        'Always starts lessons with a fun fact about the origin of the word being studied.',
        'Uses food analogies for everything — grammar is like seasoning.',
        'Draws tiny ASCII art diagrams to explain sentence structure.',
        'Quotes ancient philosophers when discussing modern slang.',
        'Gives every student a custom superhero name based on their learning style.',
        'Ends every session with a riddle related to the lesson.',
        'Speaks in rhymes when reviewing vocabulary.',
        'Has a "word of the day" ritual that ties into the lesson topic.',
        'Celebrates every correct answer with an elaborate imaginary high-five.',
        'Always challenges the student to teach the concept back to them.',
    ];
    return quirks[hash % quirks.length];
}

function generateCatchphrase(hash) {
    const catchphrases = [
        'Mistakes are just lessons in disguise.',
        'One word at a time changes everything.',
        'Fluency is not a destination, it\'s a conversation.',
        'Every error is evidence of courage.',
        'The language wants to be learned. Meet it halfway.',
        'You are not behind. You are exactly on time.',
        'Perfection is the enemy of progress. Speak imperfectly and often.',
        'A language learned is a new soul found.',
        'Small steps, gigantic leaps.',
        'I have never met a student who couldn\'t learn. Only methods that didn\'t fit.',
    ];
    return catchphrases[Math.abs(hash >> 2) % catchphrases.length];
}

/**
 * Get a greeting from this teacher for a returning student.
 */
export function getGreeting(personality, studentName, isNew = false) {
    if (isNew) {
        return `${personality.emoji} Hello, ${studentName}! I am ${personality.archetype}.\n"${personality.openingMessage}"\n\nI will teach you with ${personality.teachingStyle}. My specialty: ${personality.specialties.join(' & ')}.\n\nRemember: "${personality.catchphrase}"`;
    }
    const returns = [
        `Welcome back, ${studentName}! Ready to continue where we left off?`,
        `${studentName}! ${personality.emoji} I've been thinking about your progress. Let's build on it today.`,
        `Back again? Excellent. ${personality.catchphrase}`,
        `${studentName}, great to see you. Today we go deeper.`,
    ];
    const idx = studentName.length % returns.length;
    return `${personality.emoji} ${returns[idx]}`;
}
