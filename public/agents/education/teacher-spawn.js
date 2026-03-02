/**
 * agents/teacher-spawn.js
 * Teacher Agent Spawner — creates and manages dedicated teacher agents per student.
 * 
 * Each user gets ONE unique teacher agent with a fixed personality (reproducible from userId).
 * The Teacher King oversees all spawned agents.
 * Teacher agents store all interactions and evaluations for persistent memory.
 * 
 * Communication channels (configured per student preference):
 *   - browser (default, always available)
 *   - whatsapp (requires phone number)
 *   - telegram (requires telegram username)
 *   - imessage (requires Apple ID / phone)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { generatePersonality, getGreeting } from './teacher-personalities.js';
import { generateQuiz, generateGame, evaluateSubmission, incrementKingStats } from './teacher-king.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEACHERS_DIR = join(__dirname, 'teachers');

if (!existsSync(TEACHERS_DIR)) mkdirSync(TEACHERS_DIR, { recursive: true });

// ── File paths ───────────────────────────────────────────────────
function teacherFile(userId) { return join(TEACHERS_DIR, `teacher-${userId}.json`); }
function memoryFile(userId) { return join(TEACHERS_DIR, `memory-${userId}.json`); }

// ── Spawn or retrieve teacher agent ──────────────────────────────

/**
 * Get (or create) the dedicated teacher agent for a student.
 * If the student already has a teacher, returns the existing one.
 * @param {string} userId
 * @param {string} studentName
 * @param {object} [opts] — { preferredChannel, learnLang, nativeLang, level }
 */
export function getOrSpawnTeacher(userId, studentName, opts = {}) {
    const tFile = teacherFile(userId);

    if (existsSync(tFile)) {
        return JSON.parse(readFileSync(tFile, 'utf8'));
    }

    // Generate unique personality deterministically from userId
    const personality = generatePersonality(userId);

    const teacher = {
        id: `teacher-${userId}`,
        studentId: userId,
        studentName,
        name: `${personality.archetype} (Your Personal Teacher)`,
        emoji: personality.emoji,
        personality,
        greeting: getGreeting(personality, studentName, true),
        preferredChannel: opts.preferredChannel || 'browser',
        learnLang: opts.learnLang || 'Spanish',
        nativeLang: opts.nativeLang || 'English',
        currentLevel: opts.level || 'beginner',
        spawnedAt: new Date().toISOString(),
        spawnedBy: 'TeacherKing',
        lastSeen: null,
        totalSessions: 0,
        totalQuizzes: 0,
        totalGames: 0,
        currentStreak: 0,
        bestStreak: 0,
    };

    writeFileSync(tFile, JSON.stringify(teacher, null, 2), 'utf8');
    incrementKingStats('spawnedTeachers');
    incrementKingStats('totalStudents');

    return teacher;
}

/** Update teacher's last-seen and session count */
export function recordSession(userId) {
    const tFile = teacherFile(userId);
    if (!existsSync(tFile)) return;
    const teacher = JSON.parse(readFileSync(tFile, 'utf8'));
    teacher.lastSeen = new Date().toISOString();
    teacher.totalSessions = (teacher.totalSessions || 0) + 1;
    teacher.currentStreak = (teacher.currentStreak || 0) + 1;
    teacher.bestStreak = Math.max(teacher.bestStreak || 0, teacher.currentStreak);
    writeFileSync(tFile, JSON.stringify(teacher, null, 2), 'utf8');
    return teacher;
}

// ── Memory (persistent interactions) ─────────────────────────────

/**
 * Store an interaction in the teacher's memory for this student.
 * This is the persistent memory that lets the teacher "remember" everything.
 */
export function storeInteraction(userId, interaction) {
    const mFile = memoryFile(userId);
    let memory = { userId, interactions: [], evaluations: [], achievements: [] };
    if (existsSync(mFile)) memory = JSON.parse(readFileSync(mFile, 'utf8'));

    memory.interactions.push({
        id: `int-${Date.now()}`,
        type: interaction.type || 'message',
        content: interaction.content,
        channel: interaction.channel || 'browser',
        timestamp: new Date().toISOString(),
        teacherNote: interaction.teacherNote || null,
    });

    // Keep last 500 interactions
    if (memory.interactions.length > 500) memory.interactions = memory.interactions.slice(-500);
    writeFileSync(mFile, JSON.stringify(memory, null, 2), 'utf8');
    return memory;
}

/** Store a quiz evaluation in memory */
export function storeEvaluation(userId, evaluation) {
    const mFile = memoryFile(userId);
    let memory = { userId, interactions: [], evaluations: [], achievements: [] };
    if (existsSync(mFile)) memory = JSON.parse(readFileSync(mFile, 'utf8'));

    memory.evaluations.push(evaluation);

    // Check for achievements
    const newAchievements = checkAchievements(memory);
    memory.achievements = [...(memory.achievements || []), ...newAchievements];

    writeFileSync(mFile, JSON.stringify(memory, null, 2), 'utf8');
    incrementKingStats('totalEvaluations');
    return { evaluation, newAchievements };
}

/** Get the full memory (interaction history + evaluations) for a student */
export function getStudentMemory(userId) {
    const mFile = memoryFile(userId);
    if (!existsSync(mFile)) return { userId, interactions: [], evaluations: [], achievements: [], summary: buildMemorySummary(userId, []) };
    const memory = JSON.parse(readFileSync(mFile, 'utf8'));
    memory.summary = buildMemorySummary(userId, memory.evaluations || []);
    return memory;
}

/** Get UserProgress-compatible summary (EduVerify type) */
function buildMemorySummary(userId, evaluations) {
    const quizzesCompleted = evaluations.length;
    const avgScore = quizzesCompleted > 0
        ? Math.round(evaluations.reduce((s, e) => s + e.score, 0) / quizzesCompleted)
        : 0;
    const subjects = [...new Set(evaluations.map(e => e.subject).filter(Boolean))];
    return { quizzesCompleted, averageScore: avgScore, subjectsStudied: subjects };
}

/** Get a contextual reminder for the teacher based on memory */
export function getTeacherContext(userId) {
    const memory = getStudentMemory(userId);
    const recent = memory.evaluations.slice(-5);
    const avgRecent = recent.length > 0
        ? Math.round(recent.reduce((s, e) => s + e.score, 0) / recent.length)
        : null;

    return {
        lastInteraction: memory.interactions.at(-1) || null,
        recentAverageScore: avgRecent,
        totalInteractions: memory.interactions.length,
        totalEvaluations: memory.evaluations.length,
        achievements: memory.achievements || [],
        suggestion: avgRecent !== null
            ? avgRecent >= 80 ? 'Student is excelling. Increase difficulty.'
                : avgRecent >= 60 ? 'Student is progressing. Reinforce weak spots.'
                    : 'Student is struggling. Return to basics with encouragement.'
            : 'New student. Start with a diagnostic quiz.',
    };
}

// ── Achievement engine ────────────────────────────────────────────
function checkAchievements(memory) {
    const newOnes = [];
    const existingIds = new Set((memory.achievements || []).map(a => a.id));
    const evals = memory.evaluations || [];

    const candidates = [
        { id: 'first-quiz', title: '🎉 First Step!', description: 'Completed your first quiz.', condition: evals.length >= 1 },
        { id: 'ten-quizzes', title: '🏅 Dedicated Learner', description: 'Completed 10 quizzes.', condition: evals.length >= 10 },
        { id: 'perfect-score', title: '⭐ Perfectionist', description: 'Scored 100% on a quiz.', condition: evals.some(e => e.score === 100) },
        { id: 'high-avg', title: '🔥 Consistent Performer', description: 'Maintained average score above 85% across 5+ quizzes.', condition: evals.length >= 5 && evals.slice(-5).reduce((s, e) => s + e.score, 0) / 5 >= 85 },
        { id: 'comeback', title: '💪 The Comeback', description: 'Scored 90%+ after scoring below 60%.', condition: evals.length >= 2 && evals.at(-1)?.score >= 90 && evals.slice(-5).some(e => e.score < 60) },
        { id: 'twenty-quizzes', title: '🎓 Quiz Master', description: 'Completed 20 quizzes.', condition: evals.length >= 20 },
    ];

    for (const c of candidates) {
        if (c.condition && !existingIds.has(c.id)) {
            newOnes.push({ ...c, unlockedAt: new Date().toISOString(), category: 'learning', icon: c.title.split(' ')[0] });
        }
    }
    return newOnes;
}

// ── Communication channel simulators ─────────────────────────────
export function sendMessage(userId, message, channel = 'browser') {
    const interaction = {
        type: 'teacher-message',
        content: message,
        channel,
        teacherNote: `Sent via ${channel}`,
    };
    storeInteraction(userId, interaction);

    // In production these would connect to real APIs:
    // WhatsApp: Twilio WhatsApp API
    // Telegram: Telegram Bot API
    // iMessage: Apple Business Chat API
    // Browser: WebSocket push or polling endpoint
    return {
        sent: true,
        channel,
        message,
        note: channel === 'browser'
            ? 'Delivered in-app.'
            : `[${channel.toUpperCase()} STUB] In production: message sent to student\'s ${channel} account.`
    };
}

/** List all spawned teacher agents */
export function listAllTeachers() {
    try {
        const files = readdirSync(TEACHERS_DIR).filter(f => f.startsWith('teacher-') && f.endsWith('.json'));
        return files.map(f => JSON.parse(readFileSync(join(TEACHERS_DIR, f), 'utf8')));
    } catch { return []; }
}
