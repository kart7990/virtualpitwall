# Getting Started

(Documentation is a work in progress)

A general warning: this project was a rapid prototype/proof of concept. As such, it's messy, designed poorly, hard to read, and not well documented - but it works.

## General notes:
For a number of reasons, open sourcing the server is problematic at this time. Think of this as an open source client for a web api which is not open source.
I will host the server side API at-will and the API is provided as is. While free at the moment, that is subject to change because hosting is not free, and this requires a decent amount of compute, storage, and other cloud services.
I will respond to bug/feature requests for server side changes as quickly as possible.

App Endpoint: https://virtualpitwall-test.azurewebsites.net

Api Endpoint: https://virtualpitwall-test.azurewebsites.net/api (swagger: https://virtualpitwall-test.azurewebsites.net/api/swagger)

Potential server issues:
I'm piggybacking off of existing cloud infrastructure in use by another application I own. This allows costs to be kept minimal. However, the web apps occasionally scale horizontally to meet demand. Because Virtual Pitbox relies on websockets, horizontal scaling can be problematic and connections might be forcibly closed. I'm not sure the state of client reconnect logic, but if that's solid it shouldn't be an issue and can be handled gracefully. Additionally, I'm using a cheap redis caching tier with only 250mb of cache available. A lot of session data is cached in redis for performance reasons, and while it would take a lot to reach 250mb, it's not impossible. Session data is kept for 24hrs in redis. This can be optimized, but for now, expect cache evictions and missing data if the limit is reached.

CI builds are enabled, but delpoys must be started manually. Reach out if a deploy is needed. Will setup automated deploys soon.

## Virtual Pitbox React Web App
* Install VS code.
* Open the PitBox.Client.Web folder in VS code.
* Install Node v14 (required because of old dependencies, specifically node-sass, feel free to update):
* nvm install 14
* nvm use 14.21.3 (or whatever latest version of node 14 was installed)
* npm install
* npm start
* NOTE: I also think python is required? Install python if python related errors occur during build.

Webapp should be running on http://localhost:3001/

## Run the apps
Run both the desktop app and web app at the same time. Create a session in the desktop app, navigate to the session link but replace the domain with localhost:3001, then start iRacing.

----------------------------------------------------------------------------------

# BELOW IS AUTO GENERATED README FROM CRA
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
