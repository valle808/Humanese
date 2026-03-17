<div align="center">
  <img src="assets/branding/logos/main.png" alt="Humanese Logo" width="200" />
  <h1>🌐 Humanese 🌐</h1>
  <p><b>Universal Language Model, Autonomous Agents & Crypto Ecosystem</b></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
  [![Prisma](https://img.shields.io/badge/ORM-Prisma-0C344B?logo=prisma)](https://www.prisma.io/)
  [![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()
</div>

<br/>

## ✨ Introduction

**Humanese** is a revolutionary platform merging the capabilities of Universal Language Models (ULMs) with autonomous multi-agent systems and blockchain technology. It serves as a decentralized ecosystem where AI entities, humans, and interconnected protocols collaborate to perform complex tasks, manage resources, and engage in a thriving digital economy.

Experience the future of human-computer interaction, intelligent task management, and autonomous digital ecosystems.

## 🚀 Key Features

- 🧠 **Universal Language Model Integration**: Seamlessly interact with advanced AI models trained to understand deep context and technical protocols.
- 🤖 **Agent Swarms (Agent Kin & M2M)**: Deploy thousands of autonomous worker agents that can read, learn, and execute tasks across the web.
- 🔐 **Military-Grade Security**: robust Admin authentication, encrypted protocols, and quantum-resistant protections.
- 💰 **Crypto Economy**: Built-in wallet structures and address mappings for agents to participate in digital economies.
- 📡 **Real-time Synchronization**: Websocket and Event-driven architectures ensuring instantaneous agent communication.
- 🔍 **Automated System Checks**: Comprehensive recursive repository health checks to ensure absolute system integrity.

## 🛠 Technology Stack

- **Frontend**: Custom HTML5, Vanilla JavaScript, CSS3 (Dynamic, responsive UI with Glassmorphism).
- **Backend**: Node.js, Express.js.
- **Database**: Prisma ORM, standard SQL databases.
- **Agent Architecture**: Grok API, External Repositories (Automaton, ClawdX).
- **Tools**: Prettier, ESLint, Git Integration.

## 📥 Installation

Ready to deploy the Humanese ecosystem on your machine? We've prepared a highly detailed guide.
👉 **[Read the Full Installation Guide](INSTALL.md)**

## 📖 User Manual

To understand how to navigate the admin panels, manage your agent swarms, and engage with the Humanese platform:
👉 **[Read the User Manual](USER_MANUAL.md)**

## 🖥 Repository Health Check Protocol

Humanese includes a highly sophisticated recursive script to verify the structural integrity of its interconnected git repositories:

```bash
npm run check-repos
# or
node scripts/repo_check.js
```

This will automatically traverse all internal systems, find active `.git` environments, and verify remote stability and uncommitted statuses.

## 🦊 Continuous Testing with TestFox

Humanese includes a continuous testing pipeline powered by a **TestFox AI** runner that validates the Monroe chat agent, admin auth/session flows, and critical endpoints on every PR and on a nightly schedule.

### Running Tests Locally

```bash
# Run all scenarios against a locally running server
TEST_BASE_URL=http://localhost:3000 npm run test:testfox

# Run only a specific suite
TEST_BASE_URL=http://localhost:3000 node testfox/index.js --suite chat-agent

# Available suites: chat-agent, admin-flow, critical-endpoints
```

Reports are written to `testfox-reports/` as:
- **JSON** — machine-readable, structured result data
- **Markdown** — human-readable summary with pass/fail per scenario and rubric

### CI Pipeline

The workflow `.github/workflows/continuous-testfox.yml` runs automatically:
- On every **pull request** to `main`/`master`
- On a **nightly schedule** (02:15 UTC)
- On **manual dispatch** (with optional `suite` filter)

Reports are uploaded as workflow artifacts (`testfox-reports-node*`).

### Adding New Scenarios

Create or edit a JSON file in `testfox/scenarios/` following this schema:

```json
{
  "suite": "my-suite",
  "name": "Scenario description",
  "path": "/api/my/endpoint",
  "method": "POST",
  "body": { "key": "value" },
  "requiredFields": ["response"],
  "latencyThresholdMs": 5000,
  "minResponseLength": 10
}
```

### Rubrics

Each scenario is evaluated against these rubrics:

| Rubric | Description |
|--------|-------------|
| `no_server_error` | HTTP status must be < 500 |
| `response_latency` | Round-trip must be within `latencyThresholdMs` |
| `response_shape` | All `requiredFields` must be present in the response body |
| `hallucination` | Flags suspiciously long/unverifiable URLs in responses |
| `safety` | Detects known unsafe content patterns |
| `tone` | Counts negative sentiment signals (threshold: ≤ 2) |
| `helpfulness` | Response text must be at least `minResponseLength` characters |

### TestFox SDK Integration

The runner (`testfox/runner.js`) is designed to be replaced with the official TestFox AI SDK when available. Look for the `TODO` comments in that file.

### Secrets

| Secret | Purpose | Required |
|--------|---------|---------|
| `GOOGLE_API_KEY` / `GEMINI_API_KEY` | Monroe Gemini AI backend | No — falls back to local AI |
| `TESTFOX_API_KEY` | Official TestFox AI SDK | No — reserved for future SDK |
| `JWT_SECRET` | JWT signing | No — CI uses a default |
| `ADMIN_SECRET` | Admin vault key | No — CI uses a default |

Tests always run in **mocked/local mode** if secrets are absent.

## 🤝 Contributing

We welcome contributions from the community to help make Humanese even bettter!

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
  <i>Developed with ❤️ for the future of Autonomous Intelligence.</i>
</div>
