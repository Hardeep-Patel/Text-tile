import './App.css';
import Login from './Components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import Company from './Components/Company';
import Client from './Components/Client';
import PrivateRoute from './ProtectedRoute/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/dashboard/*" element={<PrivateRoute />}>
          <Route
            path="*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="Company" element={<Company />} />
                  <Route path="Client" element={<Client />} />
                </Routes>
              </>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
