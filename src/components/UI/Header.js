import * as React from "react";
import AppBar from "@mui/material/AppBar";
import {
  Box,
  Stack,
  Grid,
  useMediaQuery,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import Divider from "@mui/material/Divider";

import axios from "axios";
import { UserActions } from "../../store/User";
import { useSelector, useDispatch } from "react-redux";

import Cookies from "js-cookie";
import male3 from "../../assets/maleAndFemaleImage/male4.png";
import female3 from "../../assets/maleAndFemaleImage/female4.png";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useMemo } from "react";

import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";

import Logout from "@mui/icons-material/Logout";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

const pages = ["Home", "Public List", "Private list", ];
// const settings = ["Home","Profile",  "My Account", "Chat","Blogs","Favorites", "Logout"];
const settingsWithIcons = [
  { setting: "Home", icon: <HomeIcon /> },
  { setting: "Profile", icon: <PersonIcon /> },
  // { setting: "My Account", icon: <AccountBoxIcon /> },
  { setting: "Logout", icon: <Logout /> },
];

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [getCheckValue, setGetCheckValue] = useState(null);

  const [user, setUser] = useState("");
  const theme = useTheme();
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const {
    isLoggedIn,
    fcmToken,
    deviceName,
    deviceCountryCode,
    deviceLanguageCode,
    deviceIdentifier,
    profilePicture,
    gender,
  } = useSelector((state) => state.user);

  const token = localStorage.getItem("token");
 
  const userId = localStorage.getItem("userId");
  const [activeLink, setActiveLink] = useState("home");

  const tokenExpiration = localStorage.getItem("tokenExpiration");
  const loggedInStatus =
    token && tokenExpiration && Date.now() < parseInt(tokenExpiration);

  const isXsScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Memoize the handleClick function using useCallback
  const handleClick = useCallback((link) => {
    setActiveLink(link);
  }, []);

  const profilePictureUrl = useMemo(() => {
    if (profilePicture !== undefined && profilePicture !== null) {
      return profilePicture;
    } else {
      return gender === "male" ? male3 : female3;
    }
  }, [user?.profilePicture, user?.gender]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const pageNavigate = ["", "postProject", "services", ];

  const avatarStyle = {
    width: 50,
    height: 50,
    bgcolor: "#fff",
    border: "2px solid red",
    color: "#000",
  };
  const handleLogout = async () => {
    if (isLoggedIn) {
      try {
        localStorage.setItem("token",null);
        dispatch(UserActions.clear());
        dispatch(UserActions.isLoggedIn(false));
        handleClose();
        localStorage.removeItem("token");
        
        localStorage.removeItem("userId");
        Cookies.remove("logger");
        navigate("/login");
        const { data } = await axios.post(
          "https://price-my-project-82465.ap-1.evennode.com/api/v1/auth/logout",
          {
            device: {
              fcmToken,
              name: deviceName,
              countryCode: deviceCountryCode,
              languageCode: deviceLanguageCode,
              identifier: deviceIdentifier,
            },
          },
          { headers: { Authorization: "bearer " + token } }
        );
      } catch (err) {}
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      handleClose();
      navigate("/login");
    }
  };

  const handleItemClick = (pageUrl) => {
    setGetCheckValue(pageUrl);
    handleCloseUserMenu();
    navigate(`${pageUrl}`);
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const { data } = await axios.get(
          `https://price-my-project-82465.ap-1.evennode.com/api/v1/user/profile?userId=${userId}`
        );
        setUser(data);
        dispatch(UserActions.isLoggedIn(loggedInStatus));
      } catch (err) {
        console.log(err);
      }
    };

    const getDeviceName = () => {
      if (navigator && navigator.userAgent) {
        const userAgent = navigator.userAgent;
        const regex = /\(([^)]+)\)/; // Extracts text inside parentheses
        const matches = regex.exec(userAgent);
        if (matches && matches.length >= 2) {
          const deviceInfo = matches[1];
          // setDeviceName(deviceInfo.split(";")[0]);
          dispatch(UserActions.deviceName(deviceInfo.split(";")[0]));
        }
      }
    };

    const fetchLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        dispatch(UserActions.fcmToken("123"));

        dispatch(UserActions.deviceCountryCode(data.country_code));
        dispatch(UserActions.deviceLanguageCode(data.languages[0]));
        dispatch(UserActions.deviceIdentifier(data.ip));
      } catch (error) {}
    };

    fetchLocation();
    getDeviceName();
    getUserDetails();
  }, []);

  // Memoize the settings menu items
  const settingsMenuItems = useMemo(() => {
    const menuItems = settingsWithIcons.map(({ setting, icon }) => {
      let onClickHandler = handleCloseUserMenu;

      if (setting === "Logout") {
        onClickHandler = handleLogout;
      } else if (setting === "Home") {
        onClickHandler = () => handleItemClick("/");
      } else if (setting === "Profile") {
        onClickHandler = () => handleItemClick("/view-profile");
      } else if (setting === "My Account") {
        onClickHandler = () => handleItemClick("/my-account");
      } else if (setting === "Chat") {
        onClickHandler = () => handleItemClick("/chat");
      } else if (setting === "Blogs") {
        onClickHandler = () => handleItemClick("/blogs");
      } else if (setting === "Favorites") {
        onClickHandler = () => handleItemClick("/favorites");
      }

      return (
        <MenuItem key={setting} onClick={onClickHandler}>
          <Stack direction="row" sx={{ alignItems: "center", }}>
            {icon && <ListItemIcon sx={{border:"2px solid red",mr:2,p:1, borderRadius: "50%",justifyContent:"center"}}>{icon}</ListItemIcon>}
            <ListItemText primary={setting} />
          </Stack>
          {/* <Box sx={{ display: "flex", alignItems: "start" }}>
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={setting} />
          </Box> */}
        </MenuItem>
      );
    });
    return menuItems;
  }, []);

  return (
    <AppBar position="static" sx={{ bgcolor: "white" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              background: "red",
              p: 1,
              m: 1,
              borderTopRightRadius: "20px",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                // fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "white",
                textDecoration: "none",
              }}
            >
              Ghulam Shubhani
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="black"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page, index) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <NavLink to={`/${pageNavigate[index]}`}>
                    <Typography
                      textAlign="center"
                      sx={{
                        color: "purple",
                      }}
                    >
                      {page}
                    </Typography>
                  </NavLink>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "black",
              textDecoration: "none",
            }}
          >
            GS
          </Typography>
          <Box
            spacing={2}
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex", justifyContent: "center" },
            }}
          >
            <Button
              color={activeLink === "home" ? "primary" : "inherit"}
              sx={{
                borderRadius: "10px",
                fontWeight: "bold",
                color: activeLink === "home" ? "#fff" : "red",
                backgroundColor: activeLink === "home" ? "red" : "transparent",
                "&:hover": {
                  backgroundColor: "red",
                  color: "#fff",
                },
              }}
              onClick={() => handleClick("home")}
              component={NavLink}
              to={"/"}
            >
              Home
            </Button>
            <Button
              color={activeLink === "postProject" ? "primary" : "inherit"}
              sx={{
                borderRadius: "10px",
                fontWeight: "bold",
                color: activeLink === "postProject" ? "#fff" : "red",
                backgroundColor:
                  activeLink === "postProject" ? "red" : "transparent",
                "&:hover": {
                  backgroundColor: "red",
                  color: "#fff",
                },
              }}
              onClick={() => handleClick("postProject")}
              component={NavLink}
              to={"/public"}
            >
              Public List
            </Button>
            <Button
              color={activeLink === "services" ? "primary" : "inherit"}
              sx={{
                borderRadius: "10px",
                fontWeight: "bold",
                color: activeLink === "services" ? "#fff" : "red",
                backgroundColor:
                  activeLink === "services" ? "red" : "transparent",
                "&:hover": {
                  backgroundColor: "red",
                  color: "#fff",
                },
              }}
              onClick={() => handleClick("services")}
              component={NavLink}
              to={"/private"}
            >
              Private list
            </Button>
           
            
          </Box>
          {!isLoggedIn && 
          !token  ? (
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Button
                variant="contained"
                color={activeLink === "login" ? "primary" : "inherit"}
                sx={{
                  borderRadius: "10px",
                  fontWeight: "bold",
                  color: "#fff",
                  backgroundColor: "red",
                  border: "2px solid red",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "red",
                  },
                }}
                onClick={() => handleClick("login")}
                component={NavLink}
                to={"/login"}
              >
                Login
              </Button>
              {isXsScreen && (
                <Button
                  variant="contained"
                  color={activeLink === "postProperty" ? "primary" : "inherit"}
                  sx={{
                    borderRadius: "10px",
                    fontWeight: "bold",
                    color: "red",
                    backgroundColor: "white",
                    border: "2px solid red",
                    "&:hover": {
                      backgroundColor: "red",
                      color: "white",
                    },
                  }}
                  onClick={() => handleClick("signUp")}
                  component={NavLink}
                  to={"/signup"}
                >
                  Sign Up
                </Button>
              )}
            </Stack>
          ) : (
            <Box sx={{ flexGrow: 0, display: "flex" }}>
              <Tooltip title="Open settings">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0, width: "50px" }}
                >
                  <Avatar
                    alt={`${user?.firstName} ${user?.lastName}`}
                    src={profilePictureUrl}
                    sx={{
                      width: 50,
                      height: 50,
                      mb: 1,
                      border: "2px solid purple",
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{}}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <Grid
                  container
                  sx={{
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Grid
                    item
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{ p: 0, width: "50px" }}
                    >
                      <Avatar
                        alt={`${user?.firstName} ${user?.lastName}`}
                        src={profilePictureUrl}
                        sx={{
                          width: 50,
                          height: 50,
                          mb: 1,
                          border: "2px solid purple",
                        }}
                      />
                    </IconButton>
                    <Typography sx={{ fontWeight: "700" }}>
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography>{user?.type}</Typography>
                  </Grid>
                  <Grid
                    item
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      // alignItems: "center",
                      justifyContent: "flex-start",
                      mb: 2,
                    }}
                  >
                    {settingsMenuItems}
                  </Grid>
                </Grid>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
