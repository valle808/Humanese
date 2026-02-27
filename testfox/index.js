#!/usr/bin/env node
/**
 * testfox/index.js
 * CLI entry point for TestFox continuous testing.
 *
 * Usage:
 *   node testfox/index.js [--suite chat-agent] [--suite admin-flow] [--report-dir ./testfox-reports]
 *
 * Environment variables:
 *   TEST_BASE_URL      Base URL of the server under test (default: http://localhost:3000)
 *   TESTFOX_API_KEY    (Reserved) Official TestFox AI SDK key
 *
 * All scenarios in testfox/scenarios/*.scenarios.json are loaded by default.
 * Pass --suite <name> to run only matching suites.
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { runTestFox } from './runner.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
    const suiteFilters = [];
    let reportDir = join(__dirname, '../testfox-reports');

    for (let i = 2; i < argv.length; i++) {
        if (argv[i] === '--suite' && argv[i + 1]) {
            suiteFilters.push(argv[++i]);
        } else if (argv[i] === '--report-dir' && argv[i + 1]) {
            reportDir = resolve(argv[++i]);
        }
    }
    return { suiteFilters, reportDir };
}

function loadScenarios(suiteFilters) {
    const scenariosDir = join(__dirname, 'scenarios');
    const files = readdirSync(scenariosDir).filter(f => f.endsWith('.scenarios.json'));
    let all = [];

    for (const file of files) {
        const scenarios = JSON.parse(readFileSync(join(scenariosDir, file), 'utf8'));
        all = all.concat(scenarios);
    }

    if (suiteFilters.length > 0) {
        all = all.filter(s => suiteFilters.includes(s.suite));
    }
    return all;
}

const { suiteFilters, reportDir } = parseArgs(process.argv);
const scenarios = loadScenarios(suiteFilters);

if (scenarios.length === 0) {
    console.error('No scenarios found. Check --suite filter or scenarios directory.');
    process.exit(1);
}

const summary = await runTestFox(scenarios, reportDir);

// Exit with non-zero code if any scenario failed (for CI)
if (summary.failed > 0) {
    process.exit(1);
}
