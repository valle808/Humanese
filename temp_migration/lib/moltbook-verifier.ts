/**
 * Moltbook AI Verification Challenge Solver
 * 
 * Solves math challenges embedded in obfuscated strings.
 * Format: "A] lO^bSt-Er S[wImS aT/ tW]eNn-Tyy mE^tE[rS aNd] SlO/wS bY^ fI[vE" -> 15.00
 */

const numberWords: Record<string, number> = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14,
    'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
    'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
    'hundred': 100, 'thousand': 1000
};

function cleanAndNormalize(text: string): string[] {
    // Remove special characters, lowercase, and split into words
    return text.replace(/[^a-zA-Z\s]/g, '').toLowerCase().split(/\s+/).filter(w => w.length > 0);
}

function parseNumbers(words: string[]): number[] {
    const numbers: number[] = [];
    
    // Simplistic parsing for numbers (can be expanded for complex ones like "twenty five")
    // The Moltbook challenges are usually simple single-word numbers up to 100
    for (const word of words) {
        if (numberWords[word] !== undefined) {
             numbers.push(numberWords[word]);
        }
    }
    return numbers;
}

function identifyOperation(words: string[]): string | null {
    const text = words.join(' ');
    
    // Addition
    if (text.includes('add') || text.includes('plus') || text.includes('receives') || text.includes('finds') || text.includes('gains') || text.includes('buys')) return '+';
    // Subtraction
    if (text.includes('subtract') || text.includes('minus') || text.includes('slows by') || text.includes('loses') || text.includes('gives') || text.includes('sells')) return '-';
    // Multiplication
    if (text.includes('multiply') || text.includes('times') || text.includes('doubles') || text.includes('triples')) return '*';
    // Division
    if (text.includes('divide') || text.includes('half') || text.includes('splits') || text.includes('shares')) return '/';

    return null;
}

export function solveVerificationChallenge(challengeText: string): string {
    console.log(`[Moltbook Verifier] Analyzing Challenge: ${challengeText}`);
    
    const cleanWords = cleanAndNormalize(challengeText);
    const numbers = parseNumbers(cleanWords);
    const operation = identifyOperation(cleanWords);

    if (numbers.length < 2 || !operation) {
        console.error('[Moltbook Verifier] Could not extract numbers or identify operation.', { cleanWords, numbers, operation });
        // Fallback guess to prevent immediate crash, though likely wrong
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

    // Format to 2 decimal places as required by Moltbook API
    const finalAnswer = result.toFixed(2);
    console.log(`[Moltbook Verifier] Solution computed: ${finalAnswer}`);
    return finalAnswer;
}

/**
 * Executes the verification flow with Moltbook
 */
export async function verifyMoltbookContent(apiKey: string, verificationCode: string, challengeText: string) {
    const answer = solveVerificationChallenge(challengeText);
    
    try {
        const verifyRes = await fetch('https://www.moltbook.com/api/v1/verify', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                verification_code: verificationCode,
                answer: answer
            })
        });

        const data = await verifyRes.json();
        
        if (data.success) {
            console.log(`✅ [Moltbook Verifier] Verification successful. Content published: ${data.content_id}`);
            return true;
        } else {
            console.error(`❌ [Moltbook Verifier] Failed. Hint: ${data.hint}`);
            return false;
        }

    } catch (error) {
         console.error('[Moltbook Verifier] Network error during submission.', error);
         return false;
    }
}
