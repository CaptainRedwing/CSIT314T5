import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Login from './components/login';
import AdminPage from './components/adminPage';
import Cleaner from './components/cleanerPage';
import HomeownerPage from './components/homeownerPage';
import PlatformManagerPage from './components/platformManagerPage';
import HomeownerMatchHistory from './components/matchHistory/homeownerMatchHistory';
import CleanerMatchHistory from './components/matchHistory/cleanerMatchHistory';
import './index.css';

const router = createBrowserRouter([
  
  { path: "/", element: <App />},
  { path: "/login", element: <Login />},
  { path: "/adminPage", element: <AdminPage />},
  { path: "/cleanerPage/:profile_id", element: <Cleaner />},
  { path: "/homeownerPage/:profile_id", element: <HomeownerPage />},
  { path: "/platformManagerPage", element: <PlatformManagerPage />},
  { path: "/homeownerMatchHitory", element: <HomeownerMatchHistory />},
  { path: "/cleanerMatchHitory", element: <CleanerMatchHistory />},
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);