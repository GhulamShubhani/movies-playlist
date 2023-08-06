import {
  Paper,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  MenuItem,
  InputLabel,
  Select,
  OutlinedInput,
  IconButton,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  TextField,
  Container,
  Grid,
  Avatar,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import countryCodes from "country-codes-list";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

import { SignupActions } from "../store/Signup";
import Header from "../components/UI/Header";
import { toast, ToastContainer } from "react-toastify";
import { toastOptions } from "../utils/ToastOptions";
import axios from "axios";
import UAParser from "ua-parser-js";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/index";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [deviceName, setDeviceName] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    type,
    email,
    firstName,
    lastName,
    countryNumberCode,
    phone,
    password,
    confirmPassword,
    gender,
    profilePicture,
    fcmToken,
    deviceCountryData,
    deviceIdentifier,
    country,
    newDeviceData,
    
  } = useSelector((state) => state.signup);


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleVaidation = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    const mobileRegex = /^\d{10}$/;

    if (firstName.length <= 0) {
      toast.error("Please enter first name", toastOptions);
      return false;
    }
   
    if (!gender) {
      toast.error("Please select gender", toastOptions);
      return false;
    }

    if (!email) {
      toast.error("Please enter email address", toastOptions);
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error("Please enter valid email address", toastOptions);
      return false;
    }

    if (!password || !confirmPassword) {
      toast.error("Please enter password and confirm password", toastOptions);
      return false;
    }
    if (!country) {
      toast.error("Please enter country", toastOptions);
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password must be same", toastOptions);
      return false;
    }
    if (!countryNumberCode) {
      toast.error("Please select a country code", toastOptions);
      return false;
    }
    if (!phone) {
      toast.error("Please enter phone number", toastOptions);
      return false;
    }
   
    if (!mobileRegex.test(phone)) {
      toast.error("Please enter Valid phone number", toastOptions);
      return false;
    }

    return true;
  };

  

  const handleSignupUser = async (event) => {
    event.preventDefault();
    if (handleVaidation()) {

      try {
    
          const obj = {
            type:"user",
            mobileNumber: countryNumberCode + phone,
            email,
            password,
            firstName,
            lastName,
            gender,
            country,
            profilePicture,
            device: {
              fcmToken,
              deviceCountryData,
              deviceIdentifier : deviceName, 
            },
          };
          const { data } = await axios.post(
            "https://smoggy-necklace-yak.cyclic.app/user/register",
            // "http://192.168.1.6:8000/user/register",
            obj
          );
          if (data) {
            toast.success("User registered successfully", toastOptions);
            setShowPassword(false);
            dispatch(SignupActions.clear());
            navigate("/login");
          }
      
      } catch (err) {
       console.log(err);
        
      }
    }
  };

  useEffect(() => {}, [confirmPassword, password]);

  const countyName = countryCodes.customList(
    "countryCode",
    " {countryNameEn}: +{countryCallingCode}"
  );

  const handleImage = async (e) => {
    const files = e.target.files;
    const file = files[0];
    try {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask
        .then(() => {
          getDownloadURL(storageRef)
            .then((url) => {
              dispatch(SignupActions.profilePicture(url));
              
            })
            .catch((err) => {});
        })
        .catch((err) => {});
    } catch (error) {}
  };

 

  useEffect(() => {
    // Retrieve device name
    const parser = new UAParser();
    const userAgent = parser.getResult();
    setDeviceName(userAgent);
    // deviceIdentifier(userAgent);

    // Retrieve country code
    const fetchCountryCode = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        deviceCountryData(data);
      } catch (error) {
        console.log("Error retrieving country code:", error);
      }
    };

    fetchCountryCode();
  }, []);

  return (
    <>
      {/* <Header /> */}
      <Container component="main" maxWidth="sm">
        <Paper>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
           
            <Typography
              component="h1"
              variant="h4"
              sx={{ fontWeight: 700, color: "#81201F" }}
            >
              Sign up
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
             
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    value={firstName}
                    onChange={(e) =>
                      dispatch(SignupActions.firstName(e.target.value))
                    }
                    required
                    fullWidth
                    id="firstName"
                    label={
                      type === "Contractor"
                        ? "Company First Name"
                        : "First Name"
                    }
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required={type === "User" ? true : false}
                    fullWidth
                    id="lastName"
                    label={
                      type === "Contractor" ? "Company Last Name" : "Last Name"
                    }
                    name="lastName"
                    value={lastName}
                    onChange={(e) =>
                      dispatch(SignupActions.lastName(e.target.value))
                    }
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Gender
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Gender"
                      name="gender"
                      value={gender}
                      onChange={(e) =>
                        dispatch(SignupActions.gender(e.target.value))
                      }
                      // onChange={handleChange}
                    >
                      <MenuItem value={"male"}>Male</MenuItem>
                      <MenuItem value={"female"}>Female</MenuItem>
                      <MenuItem value={"other"}>Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <TextField
                    required
                    fullWidth
                    type={"email"}
                    id="email"
                    label={
                      type === "Contractor" ? "Company Email" : "Email Address"
                    }
                    name="email"
                    value={email}
                    onChange={(e) =>
                      dispatch(SignupActions.email(e.target.value))
                    }
                    autoComplete="email"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl variant="outlined" sx={{ width: "100%" }}>
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      name="password"
                      value={password}
                      onChange={(e) =>
                        dispatch(SignupActions.password(e.target.value))
                      }
                      autoComplete="new-password"
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="outlined" sx={{ width: "100%" }}>
                    <InputLabel htmlFor="outlined-adornment-password">
                      Confirm Password
                    </InputLabel>
                    <OutlinedInput
                      autoComplete="new-password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) =>
                        dispatch(SignupActions.confirmPassword(e.target.value))
                      }
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-label">
                      Country 
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="numbercode"
                      value={country}
                      onChange={(e) =>
                        dispatch(
                          SignupActions.country(e.target.value)
                        )
                      }
                      sx={{ minWidth: "30%" }}
                    >
                      {Object.entries(countyName).map((val, id) => (
                        <MenuItem value={val[1].split(":")[0].trim()}>
                          {val[1].split(":")[0].trim()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControl sx={{ width: "60%" }}>
                    <InputLabel id="demo-simple-select-label">
                      Country code
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="numbercode"
                      value={countryNumberCode}
                      onChange={(e) =>
                        dispatch(
                          SignupActions.countryNumberCode(e.target.value)
                        )
                      }
                      sx={{ minWidth: "30%" }}
                    >
                      {Object.entries(countyName).map((val, id) => (
                        <MenuItem value={val[1].split(":")[1].trim()}>
                          {val}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="number"
                    value={phone}
                    onChange={(e) =>
                      dispatch(SignupActions.phone(e.target.value))
                    }
                    variant="outlined"
                    type="tel"
                  />
                </Grid>
                <Grid item xs={12}>
                  {profilePicture === null ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        cursor: "pointer",
                        ml: 2,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onClick={() => {
                        document.getElementById("image-input").click();
                      }}
                    >
                      <ImageIcon />
                      <Typography variant="subtitle1" sx={{ m: 1 }}>
                        Profile Picture
                      </Typography>
                      <input
                        id="image-input"
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleImage}
                      />
                    </Box>
                  ) : (
                    <Grid
                      container
                      width={"100%"}
                      justifyContent={"space-between"}
                      p={"10px"}
                      sx={{
                        bgcolor: "#d8d8d8",
                        borderRadius: "15px",
                        // position: "absolute",
                        bottom: 0,
                        right: 0,
                      }}
                    >
                      <img src={profilePicture} alt="send file" width="150px" />
                      <Box
                        onClick={() => {
                          dispatch(SignupActions.profilePicture(null));
                        }}
                      >
                        <CloseIcon />
                      </Box>
                    </Grid>
                  )}
                </Grid>
               
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#B60E0E",
                    width: { md: "180px", xs: "120px" },
                  height: "40px",
                  borderTopRightRadius: "20px",
                    marginTop: "10px",
                    marginBottom: "5px",
                  }}
                  onClick={handleSignupUser}
                  disabled={isLoading}
                >
                  {isLoading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-12px",
                        marginLeft: "-12px",
                      }}
                    />
                  )}
                  Sign up
                </Button>
              </Box>

              

              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Typography
                    variant="subtitle1"
                    sx={{ cursor: "pointer", mb: 2, mt: 1 }}
                    onClick={() => navigate("/login")}
                  >
                    Already have an account? Sign in
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
      <ToastContainer />
    </>
  );
};

export default SignUp;
