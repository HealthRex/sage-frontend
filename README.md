# assist-pc-frontend

## Overview

**assist-pc-frontend** is a modern, modular front-end application built using Next.js and Type script. It provides a streamlined development environment with integrated tools for linting, testing, Docker support, and deployment workflows. This project is tailored for building responsive and accessible web applications.

---

## Getting Started

### Prerequisites

- **Node.js**: Install [Node.js](https://nodejs.org/en/download) (LTS version recommended).
- **npm**: Comes bundled with Node.js.

### Installation

Clone the repository and install the required dependencies:

```bash
# Clone the repository
git clone https://github.com/HealthRex/assist-pc-frontend
cd assist-pc-frontend

# Install dependencies
npm install
```

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000].

---

## Project Structure

This project uses a modular architecture to separate functionality into smaller, reusable components. The main application resides in the `/app` directory, while local packages are in `/packages` for better code organization.

---


## Scripts

Here are some useful npm scripts:

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.


---

## Deployment

Deployment pipelines are managed using GitHub Actions. Each commit to the `main` branch triggers an automated build and deployment process. Ensure proper configuration of secrets (e.g., API keys) in the repository settings.

---

## Learn More

To dive deeper into the technologies used:

- [Next.js Documentation](https://nextjs.org/docs): Learn about the framework's features.
- [GitHub Actions](https://docs.github.com/en/actions): Automate workflows.

---


## Contributors

This project is actively maintained by Vishnu Ravi, Kanav Chopra and contributors. Feel free to open an issue or submit a pull request for improvements.

