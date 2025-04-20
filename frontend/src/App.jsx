import { Outlet } from 'react-router-dom';
import Login from './components/login';
import AdminPage from './components/adminPage';

export default function App() {
  return (
    <div className="app-container">
      <Login />
    </div>
  );
}

// Additional route configuration can be added here using createRoutesFromElements