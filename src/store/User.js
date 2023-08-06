import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: null,
  password: null,
  firstName: null,
  lastName: null,
  profilePicture: null,
  gender: null,
  country: null,
  type: null,
  isLoggedIn: false,
  phone: null,
  id: null,

  fcmToken: null,
  deviceName: null,
  deviceCountryCode: null,
  deviceLanguageCode: null,
  deviceIdentifier: "",
};

const LoginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    messageReceived(state) {
      state.messageReceived = !state.messageReceived;
    },
    email(state, action) {
      state.email = action.payload;
    },
    lastName(state, action) {
      state.lastName = action.payload;
    },
    firstName(state, action) {
      state.firstName = action.payload;
    },
    password(state, action) {
      state.password = action.payload;
    },
    isLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    myBookings(state, action) {
      state.myBookings = action.payload;
    },
    id(state, action) {
      state.id = action.payload;
    },

    phone(state, action) {
      state.phone = action.payload;
    },
    country(state, action) {
      state.country = action.payload;
    },
    gender(state, action) {
      state.gender = action.payload;
    },
    fcmToken(state, action) {
      state.fcmToken = action.payload;
    },
    deviceName(state, action) {
      state.deviceName = action.payload;
    },
    deviceCountryCode(state, action) {
      state.deviceCountryCode = action.payload;
    },
    deviceLanguageCode(state, action) {
      state.deviceLanguageCode = action.payload;
    },
    deviceIdentifier(state, action) {
      state.deviceIdentifier = action.payload;
    },
    profilePicture(state, action) {
      state.profilePicture = action.payload;
    },
    type(state, action) {
      state.type = action.payload;
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
      state.countryCode = "";
      state.phone = "";
      state.fcmToken = "";
      state.deviceName = "";
      state.deviceCountryCode = "";
      state.deviceLanguageCode = "";
      state.deviceIdentifier = "";
      state.profilePicture = null;
    },
  },
});

export const UserActions = LoginSlice.actions;

export default LoginSlice.reducer;
