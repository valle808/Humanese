/**
 * agents/teacher-king.js
 * The Teacher King — Supreme Education Agent.
 * Sits at the top of the teacher hierarchy. Spawns dedicated teacher agents
 * for each student. Manages quizzes, tests, games, and evaluations.
 * 
 * Inspired by EduVerify's Quiz, QuizQuestion, FactCheckResult, 
 * UserProgress, and LiveLectureSession type system.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { generatePersonality, getGreeting } from './teacher-personalities.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEACHERS_DIR = join(__dirname, 'teachers');
const KING_FILE = join(__dirname, 'teacher-king.json');

// Ensure teachers directory exists
if (!existsSync(TEACHERS_DIR)) mkdirSync(TEACHERS_DIR, { recursive: true });

// ── Teacher King identity ─────────────────────────────────────────
const TEACHER_KING = {
    id: 'TeacherKing',
    name: 'Maestro Rex',
    title: 'Teacher King — Supreme Education Agent & Quizmaster',
    emoji: '👨‍🏫',
    role: 'teacher-king',
    tier: 'intergalactic',
    reportsTo: 'SergioValle',
    description: 'The supreme teaching agent. Spawns unique teacher agents for every student, generates adaptive quizzes and games, evaluates progress, and governs the entire educational experience of Humanese.',
    philosophy: 'Every student is unique. Every teacher must be too. Education is not a product — it is a relationship.',
    communicationChannels: ['browser', 'whatsapp', 'telegram', 'imessage'],
    performanceScore: 99,
    taskCompletionRate: 0.99,
    isElectable: true,
};

// ── Quiz generation ───────────────────────────────────────────────

const QUIZ_TEMPLATES = {
    vocabulary: {
        type: 'multiple-choice',
        generate: (word, correctTranslation, distractors, language) => ({
            question: `What is the ${language} word for "${word}"?`,
            options: shuffle([correctTranslation, ...distractors.slice(0, 3)]),
            subject: 'vocabulary',
            difficulty: 'easy',
        })
    },
    sentence_builder: {
        type: 'arrange',
        generate: (words, language) => ({
            question: `Arrange these words to form a correct ${language} sentence:`,
            words: shuffle(words),
            subject: 'grammar',
            difficulty: 'medium',
        })
    },
    fill_blank: {
        type: 'fill-in',
        generate: (sentence, blankWord, language) => ({
            question: `Complete this ${language} sentence: "${sentence.replace(blankWord, '______')}"`,
            answer: blankWord,
            subject: 'grammar',
            difficulty: 'medium',
        })
    },
    listening: {
        type: 'comprehension',
        generate: (text, question, options, language) => ({
            question: `[${language} Audio] "${text}" — ${question}`,
            options,
            subject: 'listening',
            difficulty: 'hard',
        })
    },
    cultural: {
        type: 'multiple-choice',
        generate: (situation, options, language) => ({
            question: `In ${language}-speaking culture: "${situation}" — What is the appropriate response?`,
            options,
            subject: 'cultural-context',
            difficulty: 'medium',
        })
    }
};

/** Generate a quiz based on student level and topic */
export function generateQuiz(teacherAgent, studentLevel = 'beginner', topic = 'vocabulary', language = 'Spanish') {
    const now = new Date().toISOString();
    const numQuestions = studentLevel === 'beginner' ? 5 : studentLevel === 'intermediate' ? 8 : 10;

    const questions = Array.from({ length: numQuestions }, (_, i) => ({
        id: `q-${Date.now()}-${i}`,
        question: `[${language}] Question ${i + 1} on ${topic} (${studentLevel} level)`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: Math.floor(Math.random() * 4),
        explanation: `This tests your ${topic} knowledge at the ${studentLevel} level.`,
        professionalExplanation: `At the ${studentLevel} stage, understanding ${topic} is critical for fluency progression.`,
        difficulty: studentLevel === 'beginner' ? 'easy' : studentLevel === 'intermediate' ? 'medium' : 'hard',
        subject: topic,
        language,
    }));

    return {
        id: `quiz-${Date.now()}`,
        title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Quiz — ${language}`,
        description: `A ${studentLevel}-level ${topic} quiz in ${language}, created by ${teacherAgent.name}.`,
        questions,
        sourceContent: `teacher-agent:${teacherAgent.id}`,
        language,
        subject: topic,
        difficulty: studentLevel,
        createdAt: now,
        professionalLevel: studentLevel === 'advanced' || studentLevel === 'expert',
        teacherId: teacherAgent.id,
    };
}

/** Generate a game (gamified quiz variant) */
export function generateGame(teacherAgent, type = 'word-match', language = 'Spanish') {
    const gameTypes = {
        'word-match': { name: 'Word Blitz', description: 'Match words to their translations as fast as possible!', timer: 60, scoringMultiplier: 2 },
        'sentence-scramble': { name: 'Sentence Scramble', description: 'Unscramble sentences before the timer runs out!', timer: 45, scoringMultiplier: 3 },
        'pronunciation-race': { name: 'Pronunciation Race', description: 'Say the words before they disappear!', timer: 30, scoringMultiplier: 4 },
        'memory-flip': { name: 'Memory Maestro', description: 'Flip cards to match words and images!', timer: 90, scoringMultiplier: 1.5 },
        'story-builder': { name: 'Story Builder', description: 'Build a story one sentence at a time!', timer: 120, scoringMultiplier: 5 },
    };
    const gameConfig = gameTypes[type] || gameTypes['word-match'];
    return {
        id: `game-${Date.now()}`,
        type,
        ...gameConfig,
        language,
        teacherId: teacherAgent.id,
        createdAt: new Date().toISOString(),
    };
}

/** Evaluate a student's quiz submission */
export function evaluateSubmission(quiz, answers, studentProfile) {
    let correct = 0;
    const feedback = [];

    quiz.questions.forEach((q, i) => {
        const isCorrect = answers[i] === q.correctAnswer;
        if (isCorrect) correct++;
        feedback.push({
            questionId: q.id,
            correct: isCorrect,
            studentAnswer: answers[i],
            correctAnswer: q.correctAnswer,
            explanation: isCorrect ? `✅ Correct! ${q.explanation}` : `❌ Not quite. ${q.professionalExplanation}`,
        });
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= 70;

    return {
        id: `eval-${Date.now()}`,
        quizId: quiz.id,
        studentId: studentProfile.userId,
        teacherId: quiz.teacherId,
        score,
        passed,
        correctAnswers: correct,
        totalQuestions: quiz.questions.length,
        feedback,
        grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F',
        recommendation: passed
            ? score >= 90 ? 'Excellent! Move to the next level.' : 'Good work! Practice a bit more before advancing.'
            : 'Review the material and try again. You\'re getting there!',
        evaluatedAt: new Date().toISOString(),
    };
}

// ── Teacher King state ────────────────────────────────────────────

export function getTeacherKing() {
    return TEACHER_KING;
}

export function getTeacherKingInfo() {
    const state = loadKingState();
    return { ...TEACHER_KING, ...state };
}

function loadKingState() {
    if (!existsSync(KING_FILE)) return { spawnedTeachers: 0, totalStudents: 0, totalQuizzes: 0, totalEvaluations: 0 };
    return JSON.parse(readFileSync(KING_FILE, 'utf8'));
}

export function incrementKingStats(field) {
    const state = loadKingState();
    state[field] = (state[field] || 0) + 1;
    writeFileSync(KING_FILE, JSON.stringify(state, null, 2), 'utf8');
}

// ── Helper ────────────────────────────────────────────────────────
function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}
