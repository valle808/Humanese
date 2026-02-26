const fs = require('fs');
const path = require('path');

const targetHtml = path.resolve(__dirname, '../agents.html');
let content = fs.readFileSync(targetHtml, 'utf8');

// 1. Inject Data Read UI to Header
const targetHeader = `<div class="auto-style-24 swarm-stat">
                <div class="auto-style-25 swarm-stat-val" id="tele-db">0 MB</div>
                <div class="swarm-stat-lbl">Ingested Knowledge Volume</div>
            </div>`;

const replaceHeader = `<div class="swarm-stat">
                <div class="auto-style-25 swarm-stat-val" id="tele-data-read" style="color: #00ffcc;">0.00 MB</div>
                <div class="swarm-stat-lbl">Total Data Read</div>
            </div>
            <div class="auto-style-24 swarm-stat">
                <div class="auto-style-25 swarm-stat-val" id="tele-db">0 MB</div>
                <div class="swarm-stat-lbl">Ingested Knowledge Volume</div>
            </div>`;

content = content.replace(targetHeader, replaceHeader);

// 2. Inject Data Read to Cards
const targetFooter = `'<div class="rc-footer">' +
                    '<div>&#x1F4C4; Articles: <strong id="rcac-' + agent.id + '">0</strong></div>' +
                    '<div class="rc-kp">&#x2605; <strong id="rckp-' + agent.id + '">0</strong> KP</div>' +
                    '</div>';`;

const replaceFooter = `'<div class="rc-footer">' +
                    '<div>&#x1F4C4; <strong id="rcac-' + agent.id + '">0</strong> Articles</div>' +
                    '<div>&#x1F4BE; <strong id="rcmb-' + agent.id + '">0.00</strong> MB</div>' +
                    '<div class="rc-kp">&#x2605; <strong id="rckp-' + agent.id + '">0</strong> KP</div>' +
                    '</div>';`;

content = content.replace(targetFooter, replaceFooter);

// 3. Update Cards Map Initialization
const targetCardsSet = `cards.set(agent.id, {
                    el: el,
                    textEl: el.querySelector('#rct-' + agent.id),
                    titleEl: el.querySelector('#rcat-' + agent.id),
                    sourceEl: el.querySelector('#rcst-' + agent.id),
                    progEl: el.querySelector('#rcp-' + agent.id),
                    progPctEl: el.querySelector('#rcpp-' + agent.id),
                    statusEl: el.querySelector('#rcs-' + agent.id),
                    artCountEl: el.querySelector('#rcac-' + agent.id),
                    kpEl: el.querySelector('#rckp-' + agent.id)
                });`;

const replaceCardsSet = `cards.set(agent.id, {
                    el: el,
                    textEl: el.querySelector('#rct-' + agent.id),
                    titleEl: el.querySelector('#rcat-' + agent.id),
                    sourceEl: el.querySelector('#rcst-' + agent.id),
                    progEl: el.querySelector('#rcp-' + agent.id),
                    progPctEl: el.querySelector('#rcpp-' + agent.id),
                    statusEl: el.querySelector('#rcs-' + agent.id),
                    artCountEl: el.querySelector('#rcac-' + agent.id),
                    kpEl: el.querySelector('#rckp-' + agent.id),
                    mbEl: el.querySelector('#rcmb-' + agent.id),
                    dataReadMb: 0
                });`;

content = content.replace(targetCardsSet, replaceCardsSet);

// 4. Implement Streaming Simulation Logic
const targetCardLogic = `                        // Fake visual reading on cards
                        cards.forEach(c => {
                            if (Math.random() > 0.5) {
                                let lines = [
                                    "Quantum state mapped...",
                                    "Synthesizing Roman logistics...",
                                    "Parsing 1,200 token strings...",
                                    "Ingesting API documentation..."
                                ];
                                c.textEl.textContent = lines[Math.floor(Math.random() * lines.length)];
                                c.progEl.style.width = Math.floor(Math.random() * 100) + '%';
                            }
                        });`;

const replaceCardLogic = `                        // Dynamic Text Streaming Simulation
                        let totalReadThisTick = 0;
                        const subjects = [
                            { s: "Wikipedia", i: "🌐", a: ["Roman Logistics", "Quantum Mechanics", "Byzantine Empire", "History of AI", "Black Holes"] },
                            { s: "arXiv", i: "📄", a: ["Attention Is All You Need", "GANs Tutorial", "Transformer Architecture", "Diffusion Models", "Neurosymbolic AI"] },
                            { s: "Hacker News", i: "🔥", a: ["Show HN: My New App", "Ask HN: Who is hiring?", "Y Combinator S24", "PostgreSQL Optimization"] },
                            { s: "Stack Overflow", i: "💻", a: ["How to center a div", "Exit VIM", "React Hooks vs Classes", "Python asyncio event loop"] },
                            { s: "MDN Web Docs", i: "🌐", a: ["Service Workers API", "CSS Grid Layout", "Intersection Observer API", "WebGL 2.0 Tutorial"] },
                            { s: "Project Gutenberg", i: "📚", a: ["Moby Dick Text Analysis", "Pride and Prejudice NLP", "Frankenstein Character Maps"] },
                            { s: "AI Research News", i: "🧠", a: ["New 1T Parameter Model", "OpenAI Superalignment", "DeepMind AlphaFold 3", "AGI Timelines"] },
                            { s: "Grokipedia", i: "🟢", a: ["Agent Autonomy Frameworks", "M2M Trading Bots", "Claw-Unit Specifications", "Sovereign Market Theory"] }
                        ];

                        const logActions = [
                            "Extracting semantic entities from",
                            "Parsing 1,200 tokens from",
                            "Mapping logic structures in",
                            "Synthesizing arguments in",
                            "Compressing knowledge vector for",
                            "Indexing references in",
                            "Analyzing text embeddings on"
                        ];

                        cards.forEach(c => {
                            if (Math.random() > 0.2) {
                                // Add random data read (between 0.1 to 2.5 MB)
                                const dataRead = (Math.random() * 2.4) + 0.1;
                                c.dataReadMb += dataRead;
                                totalReadThisTick += dataRead;
                                c.mbEl.textContent = c.dataReadMb.toFixed(2);
                                
                                // Generate a dynamic text line
                                const sub = subjects[Math.floor(Math.random() * subjects.length)];
                                const article = sub.a[Math.floor(Math.random() * sub.a.length)];
                                const action = logActions[Math.floor(Math.random() * logActions.length)];
                                
                                c.textEl.innerHTML = \`<span style="color:var(--muted)">[\${new Date().toISOString().split('T')[1].slice(0, 8)}]</span> \${sub.i} \${action} "\${article}"...\`;
                                c.progEl.style.width = Math.floor(Math.random() * 100) + '%';
                                
                                // Fake article count updates
                                if(Math.random() > 0.7) {
                                    c.artCountEl.textContent = parseInt(c.artCountEl.textContent) + 1;
                                }
                            }
                        });
                        
                        // Update Global Variables
                        window.globalDataReadMb = (window.globalDataReadMb || 0) + totalReadThisTick;
                        window.globalDbSizeMb = (window.globalDbSizeMb || 1245) + totalReadThisTick * 0.4; // DB compression
                        
                        document.getElementById('tele-data-read').textContent = (window.globalDataReadMb >= 1024 ? (window.globalDataReadMb / 1024).toFixed(2) + ' GB' : window.globalDataReadMb.toFixed(2) + ' MB');
                        document.getElementById('tele-db').textContent = (window.globalDbSizeMb >= 1024 ? (window.globalDbSizeMb / 1024).toFixed(2) + ' GB' : window.globalDbSizeMb.toFixed(2) + ' MB');
                        `;

content = content.replace(targetCardLogic, replaceCardLogic);

fs.writeFileSync(targetHtml, content, 'utf8');
console.log('Successfully injected real-time tracking scripts into agents.html');
