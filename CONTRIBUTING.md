# Contributing to Life@Dev

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to Life@Dev. These are guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## 🚀 Getting Started

### 1. Fork & Clone

Fork the repository to your GitHub account, then clone it locally:

```bash
git clone https://github.com/your-username/life-at-dev.git
cd life-at-dev
```

### 2. Install Dependencies

We use `pnpm` for package management.

```bash
pnpm install
```

### 3. Run Locally

Start the development server:

```bash
pnpm dev
```

## 🛠️ Development Flow

### 1. Create a Branch

Always work on a new branch for your changes:

```bash
# For new features
git checkout -b feat/your-feature-name

# For bug fixes
git checkout -b fix/your-bug-fix
```

### 2. Coding Standards

- **TypeScript**: We use strict mode. No `any` unless absolutely necessary.
- **Formatting**: We use Prettier.
- **Linting**: We use ESLint.

Before committing, ensure your code is clean:

```bash
pnpm lint
pnpm format
```

### 3. Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

```bash
git commit -m "feat: add career pivot logic"
git commit -m "fix: resolve entropy calculation bug"
git commit -m "docs: update readme with new vision"
```

Common types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature

### 4. Push & Pull Request

Push your changes to your fork:

```bash
git push origin feat/your-feature-name
```

Go to the original repository and open a **Pull Request**. Please provide a clear description of your changes and screenshots if applicable.

## 🐛 Reporting Bugs

If you find a bug, please create an issue including:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

## 📄 License

By contributing, you agree that your contributions will be licensed under its MIT License.
