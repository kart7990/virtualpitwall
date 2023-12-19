import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

export default function (ComposedComponent) {
    class AdminOnly extends Component {
        render() {
            if (this.props.roles.indexOf("Admin") > -1) {
                return (
                    <div>
                        <ComposedComponent {...this.props} />
                    </div>
                )
            } else {
                return <h2>Access Denied</h2>;
            }
        }
    }

    function mapStateToProps(state) {
        return { roles: state.auth.roles };
    }

    return withRouter(connect(mapStateToProps)(AdminOnly));
}