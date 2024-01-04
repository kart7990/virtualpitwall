# Virtual Pitwall
The Virtual Pitwall platform, displays all relevant iRacing event data on a web-based dashboard.

### Project Frameworks
Core Frameworks, and Libraries:
* [React](https://react.dev/)
* [Next.js](https://nextjs.org/)
* [Redux](https://react-redux.js.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [shadcn/ui](https://ui.shadcn.com/)

### Project URLs
* App Url: https://staging.virtualpitwall.com
* API Url: https://staging.api.virtualpitwall.com

### CI/CD
A passing build and at least one approval is required to merge. Changes merged to main branch will be automatically deployed to https://staging.virtualpitwall.com. This typically takes less than 5 minutes. If the CI build fails, test the build locally and ensure there are no errors or warnings: `npm run build-dev` (or `build-staging`).

### Data Model
The best way to explore the data model is to use redux devtools and explore the chart and leaf object properties. Be sure to select the appropriate web app in the drop down - (At the time of writing it is "Create Next App"). The data model is sure to change, but as long as redux selectors are used, it shouldn't be too painful to update call sites in the app.

![ReduxChart](https://github.com/kart7990/virtualpitwall/assets/15096469/2efaa7f0-82bc-4b62-9e96-41612bba2d07)
![ReduxChartTrackSessionProperties](https://github.com/kart7990/virtualpitwall/assets/15096469/717aab3b-d256-4c3b-9351-aa7df44b387a)

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
