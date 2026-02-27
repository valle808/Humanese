/**
 * testfox/runner.js
 * TestFox AI Runner — interface layer for continuous testing.
 *
 * This module provides a generic HTTP + rubric-evaluator approach.
 * TODO: Replace the HTTP fetch + heuristic rubrics with calls to the official
 *       TestFox AI SDK once it is publicly available:
 *         import TestFox from '@testfox/sdk';
 *         const tf = new TestFox({ apiKey: process.env.TESTFOX_API_KEY });
 *         const result = await tf.runScenario(scenario);
 */

import fetch from 'node-fetch';
import { evaluateResult } from './rubrics.js';
import { generateJsonReport, generateMarkdownReport } from './report.js';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const TESTFOX_API_KEY = process.env.TESTFOX_API_KEY || null;  // reserved for official SDK

/**
 * Executes a single HTTP request scenario and returns the raw result.
 * @param {object} scenario
 * @returns {Promise<object>} { statusCode, latencyMs, body, error? }
 */
async function executeRequest(scenario) {
    const url = `${BASE_URL}${scenario.path}`;
    const options = {
        method: scenario.method || 'GET',
        headers: { 'Content-Type': 'application/json', ...(scenario.headers || {}) },
        signal: AbortSignal.timeout(scenario.timeoutMs || 10000)
    };
    if (scenario.body) {
        options.body = JSON.stringify(scenario.body);
    }

    const start = Date.now();
    try {
        const res = await fetch(url, options);
        const latencyMs = Date.now() - start;
        let body;
        try {
            body = await res.json();
        } catch {
            body = await res.text().catch(() => null);
        }
        return { statusCode: res.status, latencyMs, body };
    } catch (err) {
        const latencyMs = Date.now() - start;
        return { statusCode: 0, latencyMs, body: null, error: err.message };
    }
}

/**
 * Runs a single scenario: execute request + evaluate rubrics.
 * @param {object} scenario
 * @returns {Promise<object>} scenario result with rubric evaluations
 */
async function runScenario(scenario) {
    console.log(`  ▶ [${scenario.suite}] ${scenario.name}`);
    const result = await executeRequest(scenario);
    const rubricResults = evaluateResult(result, scenario);

    const allPassed = rubricResults.every(r => r.pass);
    const overallScore = rubricResults.reduce((s, r) => s + r.score, 0) / rubricResults.length;

    return {
        suite: scenario.suite,
        name: scenario.name,
        path: scenario.path,
        method: scenario.method || 'GET',
        statusCode: result.statusCode,
        latencyMs: result.latencyMs,
        passed: allPassed,
        overallScore: Math.round(overallScore * 100) / 100,
        rubrics: rubricResults,
        error: result.error || null,
        timestamp: new Date().toISOString()
    };
}

/**
 * Runs all scenarios in a suite and returns aggregated results.
 * @param {object[]} scenarios
 * @returns {Promise<object[]>}
 */
async function runSuite(scenarios) {
    const results = [];
    for (const scenario of scenarios) {
        results.push(await runScenario(scenario));
    }
    return results;
}

/**
 * Main entry point: loads scenarios, runs them, writes reports.
 * @param {object[]} scenarios - array of scenario objects
 * @param {string} reportDir - directory to write reports to
 * @returns {Promise<object>} summary object
 */
export async function runTestFox(scenarios, reportDir = './testfox-reports') {
    // If TESTFOX_API_KEY is set, future versions will delegate to official SDK here.
    if (TESTFOX_API_KEY) {
        console.log('[TestFox] TESTFOX_API_KEY detected — using official SDK (TODO: plug in SDK calls)');
    }

    console.log(`\n🦊 TestFox Runner starting — ${scenarios.length} scenarios against ${BASE_URL}\n`);
    const allResults = await runSuite(scenarios);

    const passed = allResults.filter(r => r.passed).length;
    const failed = allResults.length - passed;
    const summary = {
        total: allResults.length,
        passed,
        failed,
        passRate: allResults.length > 0 ? Math.round((passed / allResults.length) * 100) : 0,
        results: allResults
    };

    await generateJsonReport(summary, reportDir);
    const mdPath = await generateMarkdownReport(summary, reportDir);

    console.log(`\n✅ TestFox complete: ${passed}/${allResults.length} passed (${summary.passRate}%)`);
    console.log(`   📝 Markdown report: ${mdPath}`);

    return summary;
}
