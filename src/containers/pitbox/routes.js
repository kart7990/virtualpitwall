import React from 'react';
const DevDashboard = React.lazy(() => import('./DevDashboard'));
const Dashboard = React.lazy(() => import('./Dashboard'));
const LapComparison = React.lazy(() => import('./laps/LapComparison'));
const HomeLayout = React.lazy(() => import('../Layout'));

const routes = [
  { path: '/pitbox/:id/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/pitbox/:id/lapcomparison', name: 'Lap Comparison', component: LapComparison },
  { path: '/pitbox/:id/devdashboard', name: 'Dashboard', component: DevDashboard }
];

export default routes;
