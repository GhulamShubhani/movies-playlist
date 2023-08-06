import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    type: "User",
    email: "",
    firstName: "",
    lastName: "",
    countryNumberCode: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: null,
    profilePicture:null,
    deviceCountryData:"",
    fcmToken:"123",
    deviceIdentifier:"",
    country:"",
    newDeviceData:"",
    
}

export const signUpSlice = createSlice({
  name: "Signup",
  initialState,
  reducers: {
    type(state, action) {
        state.type = action.payload;
      },
      firstName(state, action) {
        state.firstName = action.payload;
      },
      lastName(state, action) {
        state.lastName = action.payload;
      },
      email(state, action) {
        state.email = action.payload;
      },
      gender(state, action) {
        state.gender = action.payload;
      },
      profilePicture(state, action) {
        state.profilePicture = action.payload;
      },
      country(state, action) {
        state.country = action.payload;
      },
      password(state, action) {
        state.password = action.payload;
      },
  
      confirmPassword(state, action) {
        state.confirmPassword = action.payload;
      },
      countryNumberCode(state, action) {
        state.countryNumberCode = action.payload;
      },
      deviceCountryData(state, action) {
        state.deviceCountryData = action.payload;
      },
      phone(state, action) {
        state.phone = action.payload;
      },
      newDeviceData(state, action) {
        state.newDeviceData = action.payload;
      },
      deviceIdentifier(state, action) {
        state.deviceIdentifier  = action.payload;
      },
      
      clear(state) {
        state.type = "User";
        state.firstName = "";
        state.lastName = "";
        state.email = "";
        state.gender = false;
        state.country = false;
        state.password = "";
        state.confirmPassword = "";
        state.countryNumberCode = "";
        state.deviceCountryData = "";
        state.phone = "";
        state.fcmToken = "";
        state.deviceIdentifier = null;
      
      },
  },
})

export const SignupActions = signUpSlice.actions;

export default signUpSlice.reducer;
