import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Login from './components/login';
import AdminPage from './components/adminPage';
import Cleaner from './components/cleanerPage';
import HomeownerPage from './components/homeownerPage';
import PlatformManagerPage from './components/platformManagerPage';
import UserPage from './components/adminComponents/userPage';
import './index.css';

const router = createBrowserRouter([
  { path: "/", element: <App />},
  { path: "/login", element: <Login />},
  { path: "/adminPage", element: <AdminPage />},
  { path: "/cleanerPage", element: <Cleaner />},
  { path: "/homeownerPage", element: <HomeownerPage />},
  { path: "/platformManagerPage", element: <PlatformManagerPage />},
  { path: "/userPage/:userId", element: <UserPage />}

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);