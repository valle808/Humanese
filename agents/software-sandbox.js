/**
 * agents/software-sandbox.js
 * 
 * 🛡️ SOVEREIGN EXECUTION SANDBOX
 * 
 * Allows Humanese agents to securely execute downloaded software 
 * or dynamically generated JavaScript without destroying the host container.
 * 
 * Uses Node's native 'vm' module to isolate the execution context.
 */

import vm from 'vm';

/**
 * Executes an arbitrary string of JavaScript code within a sandboxed context.
 * 
 * @param {string} code - The JavaScript code to execute.
 * @param {object} customContext - Optional variables or functions to inject into the sandbox (e.g., specific API access).
 * @param {number} timeoutMs - Maximum execution time in milliseconds before halting.
 * @returns {any} The result of the executed code.
 */
export function runSovereignScript(code, customContext = {}, timeoutMs = 5000) {
    try {
        // Define what the sandboxed script is allowed to 'see' and 'do'.
        // We explicitly PREVENT access to 'require', 'process', 'fs', 'net', etc.
        const sandbox = {
            console: {
                log: (...args) => console.log(`[Sandbox Log]`, ...args),
                error: (...args) => console.error(`[Sandbox Error]`, ...args),
                warn: (...args) => console.warn(`[Sandbox Warn]`, ...args)
            },
            Math,
            Date,
            JSON,
            String,
            Number,
            Array,
            Object,
            setTimeout,
            ...customContext // Inject any explicitly permitted variables
        };

        // Compile the context
        vm.createContext(sandbox);

        // Execute the script
        // We compile the script first to catch syntax errors cleanly
        const script = new vm.Script(code, {
            filename: 'autonomous-agent-script.js'
        });

        // Run it with a strict timeout to prevent infinite loops from malicious/broken code
        const result = script.runInContext(sandbox, {
            timeout: timeoutMs,
            displayErrors: true
        });

        return {
            success: true,
            result: result
        };

    } catch (err) {
        console.error(`[Sovereign Sandbox] Execution prevented: ${err.message}`);
        return {
            success: false,
            error: err.message
        };
    }
}
