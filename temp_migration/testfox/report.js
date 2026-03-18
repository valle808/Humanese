/**
 * testfox/report.js
 * Generates JSON and Markdown reports from TestFox run results.
 */

import { mkdirSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';

/**
 * Writes the full JSON report to disk.
 * @param {object} summary
 * @param {string} reportDir
 * @returns {Promise<{jsonPath: string}>}
 */
export async function generateJsonReport(summary, reportDir = './testfox-reports') {
    const dir = resolve(reportDir);
    mkdirSync(dir, { recursive: true });
    const filename = `testfox-report-${Date.now()}.json`;
    const jsonPath = join(dir, filename);
    writeFileSync(jsonPath, JSON.stringify(summary, null, 2));
    return { jsonPath };
}

/**
 * Writes a summarized Markdown report to disk.
 * @param {object} summary
 * @param {string} reportDir
 * @returns {Promise<string>} path to markdown file
 */
export async function generateMarkdownReport(summary, reportDir = './testfox-reports') {
    const dir = resolve(reportDir);
    mkdirSync(dir, { recursive: true });

    const { total, passed, failed, passRate, results } = summary;
    const statusEmoji = passRate === 100 ? '✅' : passRate >= 80 ? '⚠️' : '❌';

    const lines = [
        `# 🦊 TestFox Report`,
        ``,
        `**Generated:** ${new Date().toISOString()}`,
        ``,
        `## Summary`,
        ``,
        `| Metric | Value |`,
        `|--------|-------|`,
        `| Total Scenarios | ${total} |`,
        `| Passed | ${passed} |`,
        `| Failed | ${failed} |`,
        `| Pass Rate | ${statusEmoji} ${passRate}% |`,
        ``,
        `## Results by Scenario`,
        ``
    ];

    // Group by suite
    const suites = {};
    for (const r of results) {
        if (!suites[r.suite]) suites[r.suite] = [];
        suites[r.suite].push(r);
    }

    for (const [suite, sResults] of Object.entries(suites)) {
        const suitePassed = sResults.filter(r => r.passed).length;
        lines.push(`### Suite: ${suite} (${suitePassed}/${sResults.length})`);
        lines.push('');
        lines.push('| Scenario | Status | Score | Latency | Failed Rubrics |');
        lines.push('|----------|--------|-------|---------|----------------|');

        for (const r of sResults) {
            const status = r.passed ? '✅ PASS' : '❌ FAIL';
            const failedRubrics = r.rubrics
                .filter(rb => !rb.pass)
                .map(rb => rb.rubric)
                .join(', ') || '-';
            lines.push(
                `| ${r.name} | ${status} | ${r.overallScore} | ${r.latencyMs}ms | ${failedRubrics} |`
            );
        }
        lines.push('');
    }

    // Failures detail
    const failures = results.filter(r => !r.passed);
    if (failures.length > 0) {
        lines.push('## Failure Details');
        lines.push('');
        for (const r of failures) {
            lines.push(`### ❌ ${r.name}`);
            lines.push(`- **Suite:** ${r.suite}`);
            lines.push(`- **Endpoint:** \`${r.method} ${r.path}\``);
            lines.push(`- **HTTP Status:** ${r.statusCode}`);
            lines.push(`- **Latency:** ${r.latencyMs}ms`);
            if (r.error) lines.push(`- **Error:** ${r.error}`);
            lines.push('- **Failed Rubrics:**');
            r.rubrics.filter(rb => !rb.pass).forEach(rb => {
                lines.push(`  - \`${rb.rubric}\`: ${rb.reason}`);
            });
            lines.push('');
        }
    }

    const markdownPath = join(dir, `testfox-report-${Date.now()}.md`);
    writeFileSync(markdownPath, lines.join('\n'));
    return markdownPath;
}
