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

### Getting Started

The following steps are for running every project locally for development.

1. Follow the Getting Started sections for the following projects
    - [Web Api](Pitwall.Server.Api/)
    - [Web App](Pitwall.Web.App/)
    - [Windows App](Pitwall.Windows.App/)
2. Open the Pitwall.sln solution in Visual Studio
3. Right click the Pitwall Solution and select "Configure Startup Projects"
![config_startup](https://github.com/kart7990/virtualpitwall/assets/15096469/90670655-f163-48ed-81cb-a73bed78613d)
4. Set the "Action" for `docker-compose` and `Pitwall.Windows.App` to "Start"
Note: if you do not see `docker-compose` as an option, you may need to reload docker at the top of the image given above
![multiple_startup](https://github.com/kart7990/virtualpitwall/assets/15096469/5ca89352-44c3-4c58-86c6-95bef2415839)
5. Start the project using the "Start" command in the top toolbar
![multiple_start](https://github.com/kart7990/virtualpitwall/assets/15096469/812efef8-2632-4121-b823-29ee2680533e)
6. For the Windows App, ensure the [DomainConfiguration](Pitwall.Windows.App/Config/DomainConfiguration.cs) is set to point to the local API.
7. Open the Pitwall.Web.App folder in VS Code.
    - Run the following command `npm run dev-local` which will use the [localserver env file](Pitwall.Web.App/env/env-development-localserver.json)
8. All of the projects should now be running locally and iRacing can be started.

### CI/CD

A passing build and at least one approval is required to merge. Changes merged to main branch will be automatically deployed to the staging environment. This typically takes less than 5 minutes. The Windows App is released and deployed with a version number matching the format [YEAR-2023].[MONTH].[DAY].[MINUTES]. The Windows App will automatically check for updates on app start. 

If the CI build fails, test the build locally with the configuration used on CI to ensure there are no errors or warnings. For the web app, run `npm run build-dev` (or `build-staging`). For the API and Windows App, set the configuration to Release and attempt the build.

### System Overview

![system_overview_dark](https://github.com/kart7990/virtualpitwall/assets/15096469/61111350-1e0f-42c7-821c-b15208f0e0c4)