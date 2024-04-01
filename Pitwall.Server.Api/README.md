# Virtual Pitwall Web API

The Virtual Pitwall web API built with .NET 8.

## Getting Started
1. Install Visual Studio 2022: https://visualstudio.microsoft.com/vs/community/
    - Install the `ASP.NET and web development` and `.NET desktop development` workloads.
2. Install Docker Desktop for Windows: https://docs.docker.com/desktop/install/windows-install/
3. Clone the repo and open the `Pitwall.sln` file in the root of the project.
4. Set the debug target in the dropdown at the top of the IDE to `docker-compose`.
5. Run the app!
    - Note: the first run will take a while as Docker needs to download the sql server and redis images.
6. Environment variables defined in [appsettings.json](appsettings.json) can be overridden in a local appsettings file [which is ignored by git](../.gitignore#L16) in the Pitwall.Server.Api project. Since the environment for debug is defaulted to "Development", the override file would be named `appsettings.Development.json`. In this file you can override specific settings like the `iRacingUsername` and `iRacingPassword` required for retrieving data from iRacing.

```json
//appsettings.Development.json file in Pitwall.Server.Api project
{
  "iRacingUsername": "myiracing@email.com",
  "iRacingPassword": "mypassword"
}
```

### Frameworks

- [.NET Core Web API](https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-8.0&tabs=visual-studio)
- [SignalR](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction?view=aspnetcore-8.0)
- [Entity Framework with SQL Server](https://learn.microsoft.com/en-us/ef/core/)
- [Redis Cache](https://stackexchange.github.io/StackExchange.Redis/)

Project:
- [Pitwall.Server.Api](../Pitwall.Server.Api/): Contains the api controllers and web socket SignalR hubs which map the services from `Pitwall.Server.Core` to and from the network layer.
- [Pitwall.Server.Core](../Pitwall.Server.Core/): Contains services used by the api, most logic should reside here.
- [Pitwall.Core](../Pitwall.Core/): Contains code shared between `Pitwall.Server.Api` and `Pitwall.Windows.App`. This should mostly consist of data models and utility functions.

### Project URLs

- App Url: https://staging.virtualpitwall.com
- API Url: https://staging.api.virtualpitwall.com
- API Swagger Url (not particularly useful since most data comes from websockets): https://staging.api.virtualpitwall.com/swagger

### CI/CD

A passing build and at least one approval is required to merge. Changes merged to main branch will be automatically deployed to https://staging.virtualpitwall.com. This typically takes less than 5 minutes.