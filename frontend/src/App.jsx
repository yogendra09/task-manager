import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Login from './screens/Login'
import Register from './screens/Register'
import Board from './screens/Board'
import BoardListing from './screens/BoardListing'
import { useDispatch, useSelector } from 'react-redux'
import { loggedInUser } from './store/slice/authSlice'
import { Navigate, Outlet } from 'react-router-dom'
import { jwtDecode } from "jwt-decode";
import Profile from './screens/Profile'


const App = () => {
  const PrivateRoute = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const token = localStorage.getItem("token");

    useEffect(() => {
      if (token) {
        (async () => {
          await dispatch(loggedInUser());
        })();
      }
    }, [dispatch, token]);

    if (!token || typeof token !== "string") {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    
    const decoded = jwtDecode(token);
    if (!decoded) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace state={{ from: location }} />;
    }



    return (
      <>
        <Outlet />
      </>
    );
  };

  return (
    <div>
      <Routes>
        <Route element={<PrivateRoute />}>
        <Route path="/" element={<BoardListing />} />
        <Route path="/board" element={<Board />} />
        <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App