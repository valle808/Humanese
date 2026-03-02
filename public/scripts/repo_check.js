import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const COLORS = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(msg, color = 'reset') {
    console.log(`${COLORS[color]}${msg}${COLORS.reset}`);
}

function findGitRepos(dir, repos = []) {
    try {
        const files = fs.readdirSync(dir, { withFileTypes: true });

        let hasGit = false;

        for (const file of files) {
            if (file.isDirectory()) {
                if (file.name === '.git') {
                    hasGit = true;
                    repos.push(dir);
                } else if (file.name !== 'node_modules' && file.name !== 'vendor') {
                    try {
                        findGitRepos(path.join(dir, file.name), repos);
                    } catch (err) {
                        // Skip if permission denied or other error
                    }
                }
            }
        }
    } catch (err) {
        // Skip errors reading directory
    }

    return repos;
}

function checkRepo(repoPath) {
    try {
        log(`\n======================================================`, 'cyan');
        log(`Checking Repository: ${repoPath}`, 'blue');

        const status = execSync('git status --short', { cwd: repoPath, encoding: 'utf8' });

        if (status.trim() === '') {
            log('✓ Working tree clean', 'green');
        } else {
            log('✗ Uncommitted changes:', 'yellow');
            console.log(status.trim());
        }

        const branch = execSync('git branch --show-current', { cwd: repoPath, encoding: 'utf8' }).trim();
        log(`Current Branch: ${branch}`, 'cyan');

        try {
            const remotes = execSync('git remote -v', { cwd: repoPath, encoding: 'utf8' });
            if (remotes.trim() !== '') {
                log('Remotes configured:', 'green');
                const uniqueRemotes = [...new Set(remotes.trim().split('\n').map(line => line.split(' ')[0]))];
                log(`  ${uniqueRemotes.join(', ')}`, 'green');
            } else {
                log('No remotes configured.', 'yellow');
            }
        } catch (e) {
            log('Error checking remotes.', 'red');
        }

    } catch (error) {
        log(`Error verifying repository: ${error.message}`, 'red');
    }
}

async function main() {
    log('Starting System-Wide Repository Protocol Analysis...', 'cyan');

    const rootDir = process.argv[2] || process.cwd();
    log(`Scanning from: ${rootDir}`, 'cyan');

    const repos = findGitRepos(rootDir);
    log(`\nFound ${repos.length} Git repositories. Analyzing...`, 'cyan');

    repos.forEach(repo => {
        checkRepo(repo);
    });

    log(`\n======================================================`, 'cyan');
    log('Repository Protocol Analysis Complete.', 'green');
}

main();
