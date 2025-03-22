import './App.css';
import Login from './Components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import Company from './Components/Company';
import Client from './Components/Client';
import PrivateRoute from './ProtectedRoute/PrivateRoute';
import AdminDashboard from './Components/AdminDashboard';
import UserHome from './Components/userside/UserHome';
// import UserLogin from "./Components/userside/UserLogin";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/dashboard/*" element={<PrivateRoute />}>
          <Route
            path=""
            element={
              <>
                <AdminDashboard />  {/* Show Admin Dashboard as default */}
              </>
            }
          />
          <Route
            path="Company"
            element={
              <>
                <Header />
                <Company />
              </>
            }
          />
          <Route
            path="Client"
            element={
              <>
                <Header />
                <Client />
              </>
            }
          />
        </Route>
        <Route path="/user/home" element={<UserHome />} />
        {/* <Route path="/userlogin" element={<UserLogin />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
