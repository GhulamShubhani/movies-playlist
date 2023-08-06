import { configureStore } from "@reduxjs/toolkit";
import Signup from "./Signup";
import User from "./User";

const store = configureStore({
  reducer: {
    signup: Signup,
   
    user:User
  },
});

export default store;
