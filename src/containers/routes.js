import React from 'react';
const Home = React.lazy(() => import( '../views/pages/home/Home'));
const Webhooks = React.lazy(() => import( '../views/webhooks/Webhooks'));


const routes = [
  { path: '/home', name: 'Home', component: Home },
  { path: '/settings', name: 'Settings', component: Webhooks }
];

export default routes;
