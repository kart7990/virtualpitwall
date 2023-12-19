import React, { Component, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { withRouter, useLocation, matchPath, Redirect, useHistory } from 'react-router';
import { getTokens } from './authCore';


function requireAuth(Component) {
  return (props) => {
    // Let's assume we have a hook for getting auth state
    const authentication = useSelector(state => state.authentication)

    const history = useHistory()
    let redirect = useLocation().pathname + useLocation().search;

    useEffect(() => {
      // Redirect if not signed in
      if (authentication.isAuthenticated === false || getTokens() === null) {
        if (authentication.isUserLogout) {
          // Use replace instead of push so you don't break back button
          history.replace("/");
        } else {
          history.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
        }
      }
    }, [authentication]);

    return authentication.isAuthenticated === true
      // Render component passed into requireAuth
      ? <Component {...props} />
      // Show loading if not signed in (redirect is about to happen)
      // or while waiting on auth state (isAuthenticated is undefined)
      : <> redirecting </>
  };
};

export default requireAuth
