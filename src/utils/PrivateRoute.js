import React from "react";
import { Route, Navigate } from "react-router-dom";
import { UserActions } from "../store/User";
import { useSelector, useDispatch } from "react-redux";

const PrivateRoute = ({ Component, ...rest }) => {

  const {
    isLoggedIn,
    
  } = useSelector((state) => state.user);
  // Add your authentication logic here
  const token = localStorage.getItem("token");
  
  const tokenExpiration = localStorage.getItem("tokenExpiration");


  return token && isLoggedIn === true  ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
