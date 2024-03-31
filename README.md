# Virtual Pitwall

The Virtual Pitwall platform displays relevant iRacing data on a web-based dashboard for race engineers.

### Projects

- [Web Api](Pitwall.Server.Api/)
- [Web App](Pitwall.Web.App/)
- [Windows App](Pitwall.Windows.App/)

### Project URLs

- App Url: https://staging.virtualpitwall.com
- API Url: https://staging.api.virtualpitwall.com
- API Swagger Url (not particularly useful since most data comes from websockets): https://staging.api.virtualpitwall.com/swagger

### Discord

If you plan to work a feature/component, please use the discord for communicating to avoid conflicts and duplicate efforts. It's not the greatest project managemnt plan, but it'll work for now. https://discord.gg/k3A3cTaVNy

### CI/CD

A passing build and at least one approval is required to merge. Changes merged to main branch will be automatically deployed to the staging environment. This typically takes less than 5 minutes. If the CI build fails, test the build locally and ensure there are no errors or warnings. For the web app, run `npm run build-dev` (or `build-staging`).

### System Overview

![system_overview_dark](https://github.com/kart7990/virtualpitwall/assets/15096469/61111350-1e0f-42c7-821c-b15208f0e0c4)