# Contributing to Humanese

Thank you for your interest in contributing to Humanese! We welcome contributions from the community.

## Contributor License Agreement (CLA)

By contributing to this project, you agree to the following terms:

1. **Grant of Rights**: You grant Vaibhav Mishra (vmath20) a perpetual, worldwide, non-exclusive, royalty-free, irrevocable license to use, modify, sublicense, and distribute your contributions.

2. **Ownership**: You retain ownership of your contributions, but grant the project maintainer the right to relicense your contributions in the future, including for commercial purposes.

3. **Original Work**: You confirm that your contribution is your original work and that you have the right to grant this license.

4. **No Warranty**: Your contributions are provided "as is" without warranty of any kind.

By submitting a pull request, you acknowledge that you have read this agreement and agree to its terms.

---

## How to Contribute

### Reporting Issues

- Use GitHub Issues to report bugs or suggest features
- Provide clear reproduction steps
- Include screenshots if relevant

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly** — run `npm test` and ensure `npm run build` passes
5. **Lint your code** — run `npm run lint` and fix any reported issues
6. **Commit your changes** (`git commit -m 'Add amazing feature'`)
7. **Push to your fork** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request** targeting the `main` branch

PRs are reviewed by a maintainer. Please allow up to 3 business days for a review. Address any requested changes promptly. Once approved, your PR will be squash-merged.

### Code Style

- Follow existing code patterns
- Use TypeScript for type safety
- Format code before committing (run `npm run lint` to check with ESLint — see [`.eslintrc.json`](.eslintrc.json))
- Write clear commit messages

### Areas for Contribution

We welcome contributions in these areas:

- 🐛 **Bug fixes**
- 📚 **Documentation improvements**
- ✨ **UI/UX enhancements**
- 🎨 **Design improvements**
- 🧪 **Test coverage**
- 🌐 **Internationalization**
- ♿ **Accessibility improvements**

### What We Don't Accept

- Breaking changes without discussion
- Code that doesn't pass TypeScript compilation
- Features that significantly increase bundle size
- Contributions without proper attribution

---

## Development Setup

See the main README.md for detailed setup instructions.

Quick start:
```bash
npm install
cp .env.local.example .env.local
# Add your API keys
npm run dev
```

---

## Questions?

- Open a GitHub Discussion
- Check existing Issues
- Review closed PRs for examples

---

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to build something great together.

---

**Thank you for contributing to Humanese!** 🚀

