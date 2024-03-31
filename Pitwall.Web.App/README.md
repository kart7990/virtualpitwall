# Virtual Pitwall

The Virtual Pitwall platform displays all relevant iRacing event data on a web-based dashboard for race engineers.

### Project Frameworks

Core Frameworks and Libraries:

- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [Redux](https://react-redux.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

### Project URLs

- App Url: https://staging.virtualpitwall.com
- API Url: https://staging.api.virtualpitwall.com
- API Swagger Url (not particularly useful since most data comes from websockets): https://staging.api.virtualpitwall.com/swagger

### CI/CD

A passing build and at least one approval is required to merge. Changes merged to main branch will be automatically deployed to https://staging.virtualpitwall.com. This typically takes less than 5 minutes. If the CI build fails, test the build locally and ensure there are no errors or warnings: `npm run build-dev` (or `build-staging`).

### Data Model

The best way to explore the data model is to use redux devtools and view the chart and object properties. Be sure to select the appropriate web app in the drop down. The main redux states that will be used for retrieving iRacing event data are `pitwall.gameSession`, `pitwall.liveTiming`, and `pitwall.telemetry`. The `pitwall.session` state is used to track pitwall-specific data, no race event data should be retrieved from there.

Model Overview:
![VirtualPitwallReduxModel](https://github.com/kart7990/virtualpitwall/assets/15096469/b0655a68-975e-4a34-ab87-d76384f1d835)

Game Session Data:
![VirtualPitwallReduxGameSession](https://github.com/kart7990/virtualpitwall/assets/15096469/7d24288b-6535-427d-9454-c0cd08083593)

Live Timing Data:
![VirtualPitwallReduxStandings](https://github.com/kart7990/virtualpitwall/assets/15096469/96dbd8a3-d5cd-4455-9921-018bb01e06c1)

Telemetry Data:
![VirtualPitwallReduxTelemetry](https://github.com/kart7990/virtualpitwall/assets/15096469/8f0d0709-1fa9-4c15-bf42-73c39ac0d118)

### Development Setup

The Virtual Pitwall comes with a [Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) setup for [Visual Studio Code](https://code.visualstudio.com/). This contains all the tools and configurations, that are needed to develop the UI. To use this functionality, you need to have Docker installed, as well as the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension.

#### Code formatting

For code formatting we use [Prettier](https://prettier.io/), to format the code as well as [ESLint](https://eslint.org/), to lint the code.

To make sure, that the code is formatted before being committed, we use [husky](https://typicode.github.io/husky/) as a pre-commit hook in combination with [lint-staged](https://github.com/lint-staged/lint-staged). This formats the code before committing it. Or as the lint-staged repo phrases it:

> Run linters against staged git files and don't let 💩 slip into your code base!

## START OF AUTO GEN Next.js DOCUMENTATION

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
