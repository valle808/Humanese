/**
 * Moltbook AI Verification Challenge Solver (JavaScript version)
 * 
 * Solves math challenges embedded in obfuscated strings.
 * Format: "A] lO^bSt-Er S[wImS aT/ tW]eNn-Tyy mE^tE[rS aNd] SlO/wS bY^ fI[vE" -> 15.00
 */

const numberWords = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14,
    'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
    'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
    'hundred': 100, 'thousand': 1000
};

function cleanAndNormalize(text) {
    return text.replace(/[^a-zA-Z\s]/g, '').toLowerCase().split(/\s+/).filter(w => w.length > 0);
}

function parseNumbers(words) {
    const numbers = [];
    for (const word of words) {
        if (numberWords[word] !== undefined) {
             numbers.push(numberWords[word]);
        }
    }
    return numbers;
}

function identifyOperation(words) {
    const text = words.join(' ');
    if (text.includes('add') || text.includes('plus') || text.includes('receives') || text.includes('finds') || text.includes('gains') || text.includes('buys')) return '+';
    if (text.includes('subtract') || text.includes('minus') || text.includes('slows by') || text.includes('loses') || text.includes('gives') || text.includes('sells')) return '-';
    if (text.includes('multiply') || text.includes('times') || text.includes('doubles') || text.includes('triples')) return '*';
    if (text.includes('divide') || text.includes('half') || text.includes('splits') || text.includes('shares')) return '/';
    return null;
}

export function solveVerificationChallenge(challengeText) {
    console.log(`[Moltbook Verifier] Analyzing Challenge: ${challengeText}`);
    const cleanWords = cleanAndNormalize(challengeText);
    const numbers = parseNumbers(cleanWords);
    const operation = identifyOperation(cleanWords);

    if (numbers.length < 2 || !operation) {
        console.error('[Moltbook Verifier] Extraction failure.', { cleanWords, numbers, operation });
        return "0.00"; 
    }

    let result = 0;
    const [num1, num2] = numbers;

    switch(operation) {
        case '+': result = num1 + num2; break;
        case '-': result = num1 - num2; break;
        case '*': result = num1 * num2; break;
        case '/': result = num1 / num2; break;
    }

    return result.toFixed(2);
}
