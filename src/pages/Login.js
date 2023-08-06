import {
  Box,
  Button,
  Grid,
  TextField,
  CircularProgress,
  IconButton,
  InputAdornment,
  FormControl,
  Typography,
  Paper,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

import { toast, ToastContainer } from "react-toastify";
import { toastOptions } from "../utils/ToastOptions.js";
import axios from "axios";
import { UserActions } from "../store/User";
import { useDispatch } from "react-redux";
import UAParser from "ua-parser-js";


import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [deviceIdentifier1, setDeviceIdentifier1] = useState("");
  const [deviceCountryData1, setDeviceCountryData1] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [country, setCountry] = useState("");
  const [languageCode, setLanguageCode] = useState("");

  useEffect(() => {
    // Retrieve device name
    const parser = new UAParser();
    const userAgent = parser.getResult();
    setDeviceIdentifier1(userAgent);
    // deviceIdentifier(userAgent);

    // Retrieve country code
    const fetchCountryCode = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        setDeviceCountryData1(data);
      } catch (error) {
        console.log("Error retrieving country code:", error);
      }
    };

    fetchCountryCode();
  }, []);


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const loginHandler = async () => {
    try {
      console.log("1");
      setIsLoading(true);
      console.log("2");
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      console.log("3");
      if (emailRegex.test(email)) {
        console.log("4",{
          email,
          password,
          device: {
            fcmToken:"rt",
            deviceCountryData:deviceCountryData1,
            deviceIdentifier : deviceIdentifier1,
            
          },
        });
          const { data } = await axios.post(
            "https://smoggy-necklace-yak.cyclic.app/user/login",
            {
              email,
              password,
              device: {
                fcmToken:"rt",
                deviceCountryData:deviceCountryData1,
                deviceIdentifier : deviceIdentifier1,
                
              },
            }
          );
          if (data) {
            console.log("tttt",data);
            localStorage.setItem("userId", data.id);
            toast.success("User registered successfully", toastOptions);

            Cookies.set("logger", password);
            localStorage.setItem("token",data.accessToken)
            dispatch(UserActions.isLoggedIn(true));
            dispatch(UserActions.fcmToken("123"));
            dispatch(UserActions.deviceName(deviceIdentifier1));
            dispatch(UserActions.deviceCountryCode(deviceCountryData1));
            dispatch(UserActions.email(email));
            dispatch(UserActions.firstName(data.user.firstName));
            dispatch(UserActions.lastName(data.user.lastName));
            dispatch(UserActions.gender(data.user.gender));
            dispatch(UserActions.phone(data.user.phone));
            dispatch(UserActions.profilePicture(data.user.profilePicture));
            dispatch(UserActions.type(data.user.type));
            dispatch(UserActions.password(password));
            dispatch(UserActions.id(data.user.id));

            // dispatch(UserActions.clear());
            navigate("/login");
            navigate("/");
          }
        
      } else {
        toast.error("Please enter valid email address", toastOptions);
      }
    } catch (error) {
      toast.error("Invalid credentials", toastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Grid container justifyContent="center" alignItems="center">
        <Grid
          item
          xs={12}
          sm={6}
          md={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            marginY: 4,
          }}
        >
          {/* <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <img src={homelogo} alt="roomy logo" width={"100px"} />
          </Box> */}
          <Paper
            elevation={18}
            sx={{
              px: 4,
              py: 3,

              borderRadius: "20px",
            }}
          >
            <Typography
              sx={{
                fontWeight: "700",
                fontSize: "25px",
                textAlign: "center",
                color: "#81201F",
                mb: 5,
              }}
            >
              Login
            </Typography>

            <Box>
              <Typography sx={{ color: "#81201F" }}>Email</Typography>
              <TextField
                // label="Email"
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                placeholder="Email address"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ width: "20px" }}>
                      <EmailOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  focused: false,
                }}
                sx={{
                  bgcolor: "white",
                  borderRadius: "20px", // Add borderRadius explicitly
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px", // Add borderRadius explicitly
                    "&:hover fieldset": {
                      borderColor: "transparent",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "transparent",
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography sx={{ color: "#81201F" }}>Password</Typography>
              <FormControl
                sx={{
                  width: "100%",
                  bgcolor: "white",
                  borderRadius: "20px", // Add borderRadius explicitly
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px", // Add borderRadius explicitly
                    "&:hover fieldset": {
                      borderColor: "transparent",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "transparent",
                    },
                  },
                }}
              >
                <TextField // label="Email"
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{
                          width: "20px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    focused: false,
                  }}
                  sx={{
                    bgcolor: "white",
                    borderRadius: "20px", // Add borderRadius explicitly
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px", // Add borderRadius explicitly
                      "&:hover fieldset": {
                        borderColor: "transparent",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "transparent",
                      },
                    },
                  }}
                />
              </FormControl>
            </Box>

            <Box
              sx={{
                px: { xs: 0, sm: 2 },
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <label>
                <input type="checkbox" />
                <span style={{ color: "#81201F" }}>Remember me</span>
              </label>
              <Button
                sx={{ color: "#81201F" }}
                onClick={() => navigate("/forget-password")}
              >
                Forgot Password
              </Button>
            </Box>
            <Box
              sx={{
                mt: 2,
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="error"
                sx={{
                  width: { md: "180px", xs: "120px" },
                  height: "40px",
                  borderTopRightRadius: "20px",
                  marginTop: "10px",
                  marginBottom: "5px",
                }}
                onClick={loginHandler}
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
                Login
              </Button>
            </Box>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Button
                sx={{ fontWeight: "600", color: "#81201F" }}
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
              <Button
                sx={{ fontWeight: "600", color: "#81201F" }}
                onClick={() => navigate("/")}
              >
                Skip
              </Button>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <ToastContainer />
    </div>
  );
};

export default Login;
