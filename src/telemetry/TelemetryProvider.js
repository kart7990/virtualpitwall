import React, { Component, Fragment } from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { AppInsightsErrorBoundary, AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { ai, getReactPlugin } from './TelemetryService';
import { withRouter } from 'react-router-dom';

/**
 * This Component provides telemetry with Azure App Insights
 *
 * NOTE: the package '@microsoft/applicationinsights-react-js' has a HOC withAITracking that requires this to be a Class Component rather than a Functional Component
 */
let reactPlugin = null;

class TelemetryProvider extends Component {
    state = {
        initialized: false
    };

    componentDidMount() {
        const { history } = this.props;
        const { initialized } = this.state;
        const AppInsightsInstrumentationKey = this.props.instrumentationKey; // PUT YOUR KEY HERE
        if (!Boolean(initialized) && Boolean(AppInsightsInstrumentationKey) && Boolean(history)) {
            ai.initialize(AppInsightsInstrumentationKey, history);
            reactPlugin = getReactPlugin()
            this.setState({ initialized: true });
        }
    }

    render() {
        const { children } = this.props;
        return (
            <AppInsightsErrorBoundary
                onError={() => {
                    return <h1>Something went wrong. Error details have been logged. Please try refreshing the page or starting a new PitBox session if error persists.</h1>
                }}
                appInsights={reactPlugin}>
                <Fragment>
                    {children}
                </Fragment>
            </AppInsightsErrorBoundary>
        );
    }
}

export default withRouter(withAITracking(ai.reactPlugin, TelemetryProvider));