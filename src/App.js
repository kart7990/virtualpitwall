import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory as createHistory } from 'history'
import './scss/style.scss';
import TelemetryProvider from './telemetry/TelemetryProvider';
import { getAppInsights, getReactPlugin } from './telemetry/TelemetryService';

const history = createHistory();

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const Layout = React.lazy(() => import('./containers/Layout'));
const PitBoxLayout = React.lazy(() => import('./containers/pitbox/Layout'));
// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Landing = React.lazy(() => import('./views/pages/landing/Landing'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
// const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));


class App extends Component {

  render() {
    return (
      <Router history={history}>
        <TelemetryProvider instrumentationKey={process.env.REACT_APP_APP_INSIGHTS_KEY} history={history}>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route exact path="/" name="" render={props => <Landing {...props} />} />
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/home" name="" render={props => <Layout {...props} />} />
              <Route exact path="/settings" name="" render={props => <Layout {...props} />} />
              <Route path="/pitbox/:id" name="pitbox" render={props => <PitBoxLayout {...props} />} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props} />} />
              <Route path="*" render={props => <Page404 {...props} />} />
            </Switch>
          </React.Suspense>
        </TelemetryProvider>
      </Router>
    );
  }
}

export default App;
