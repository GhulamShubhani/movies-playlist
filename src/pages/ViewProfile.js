import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Visibility, VisibilityOff, Edit } from "@mui/icons-material";
import DummyUserImage from "../assets/dummyUserImage.jpg";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { toastOptions } from "../utils/ToastOptions";
import Header from "../components/UI/Header";
import { useNavigate } from "react-router-dom";

import { UserActions } from "../store/User";
import { useSelector, useDispatch } from "react-redux";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/index";
import DeleteProfile from "../components/DeleteProfile";

const ViewProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { firstName, lastName, gender, profilePicture } = useSelector(
    (state) => state.user
  );

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);

  const getUserDetails = async () => {
    const { data } = await axios.get(
      `https://price-my-project-82465.ap-1.evennode.com/api/v1/user/profile?userId=${userId}`
    );
    setUser(data);
    dispatch(UserActions.email(data.email));
    dispatch(UserActions.firstName(data.firstName));
    dispatch(UserActions.lastName(data.lastName));
    dispatch(UserActions.gender(data.gender));
    dispatch(UserActions.phone(data.phone));
    dispatch(UserActions.profilePicture(data.profilePicture));
    dispatch(UserActions.type(data.type));
  };

  const passwordValidationHandler = () => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/;
    if (!oldPassword) {
      toast.error("Please enter old Password", toastOptions);
      return false;
    }

    if (!newPassword) {
      toast.error("Please enter new password", toastOptions);
      return false;
    }

    if (newPassword === oldPassword) {
      toast.error(
        "Old password and new password must be different",
        toastOptions
      );
      return false;
    }

    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "New Password must contain atleast one capital letter, one small letter, one digit and must be greater than 6 characters",
        toastOptions
      );
      return false;
    }
    return true;
  };

  const updatePasswordHandler = async () => {
    try {
      if (passwordValidationHandler()) {
        await axios.put(
          "https://price-my-project-82465.ap-1.evennode.com/api/v1/user/password",
          { oldPassword, newPassword },
          { headers: { Authorization: "bearer " + token } }
        );
        toast.success("Password updated successfully", toastOptions);
        setOldPassword("");
        setNewPassword("");
        setOpenPasswordDialog(false);
      }
    } catch (err) {
      if (err.response.status === 403) {
        toast.error(err.response.data.message, toastOptions);
      }
      console.log(err);
    }
  };

  const deleteAccountHandler = async () => {
    try {
      await axios.delete(
        "https://price-my-project-82465.ap-1.evennode.com/api/v1/user/delete-account",
        { headers: { Authorization: "bearer " + token } }
      );

      toast.success("Account Delete Successfully", toastOptions);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProfilePictureHandler = async () => {
    try {
      const data = await axios.delete(
        "https://price-my-project-82465.ap-1.evennode.com/api/v1/user/remove-profile-picture",
        { headers: { Authorization: "bearer " + token } }
      );

      if (data) {
        toast.success("Profile Picture Delete Successfully", toastOptions);
        getUserDetails();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const editAccountHandler = async () => {
    if (profilePicture) {
      try {
        const { data } = await axios.put(
          "https://price-my-project-82465.ap-1.evennode.com/api/v1/user/profile",
          { firstName, lastName, gender, profilePicture },
          { headers: { Authorization: "bearer " + token } }
        );
        if (data) {
          toast.success("Profile Update Successfully", toastOptions);
          setOpenEditDialog(false);
          getUserDetails();
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (!profilePicture) {
      try {
        const { data } = await axios.put(
          "https://price-my-project-82465.ap-1.evennode.com/api/v1/user/profile",
          { firstName, lastName, gender },
          { headers: { Authorization: "bearer " + token } }
        );
        if (data) {
          toast.success("Profile Update Successfully", toastOptions);
          setOpenEditDialog(false);
          getUserDetails();
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  // handle image for edit profile
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
              dispatch(UserActions.profilePicture(url));
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log("Upload error", err);
        });
    } catch (error) {
      console.log("Error occurred", error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <>
      {/* <Header /> */}
      {!!user ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            maxWidth: "900px",
            margin: "auto",
          }}
        >
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            margin="auto"
            sx={{ maxWidth: isSmallScreen ? "95%" : "70%" }}
          >
            <Grid item xs={12}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "#81201F" }}
              >
                View Profile
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ bgcolor: "#E3E3E3", p: 4, borderRadius: "10px" }}
            >
              <Grid container alignItems="center" justifyContent="flex-end">
                <IconButton
                  aria-label="Edit"
                  onClick={deleteProfilePictureHandler}
                  sx={{ color: "#fff" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
              <Grid container justifyContent="center">
                <Box sx={{ borderRadius: "50%", overflow: "hidden" }}>
                  {!!user && !!user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.firstName}
                      width={"300px"}
                    />
                  ) : (
                    <img
                      src={DummyUserImage}
                      alt="dummy user"
                      width={"200px"}
                    />
                  )}
                </Box>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Button
                  onClick={() => {
                    setOpenPasswordDialog(true);
                  }}
                >
                  Update Password
                </Button>
              </Grid>
            </Grid>

            <Paper elevation={18} sx={{ borderRadius: "20px", mb: 3, my: 5 }}>
              <Grid
                item
                xs={12}
                sx={{ borderRadius: "20px", p: { xs: 2, sm: 5 } }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5" sx={{ color: "#81201F" }}>
                      Personal Information
                    </Typography>
                    <hr />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container justifyContent="space-between">
                      <Typography>Full name</Typography>
                      <Typography>
                        {user.firstName + " " + user.lastName}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container justifyContent="space-between">
                      <Typography>Email</Typography>
                      <Typography>{user.email}</Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container justifyContent="space-between">
                      <Typography>Phone number</Typography>
                      <Typography>{user.phone}</Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container justifyContent="space-between">
                      <Typography>Gender</Typography>
                      <Typography>{user.gender}</Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container justifyContent="space-between">
                      <Typography>Status</Typography>
                      <Typography>{user.type}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container justifyContent="center" mt={2} spacing={2}>
                <Button
                  sx={{
                    m: 2,
                    width: { md: "180px", xs: "120px" },
                    height: "40px",
                    borderTopRightRadius: "20px",
                  }}
                  variant="contained"
                  // color="error"
                  onClick={() => setOpenEditDialog(true)}
                >
                  Edit Account
                </Button>
                {/* <Button
                  sx={{ m: 2 }}
                  variant="contained"
                  color="error"
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  Delete Account
                </Button> */}
                <DeleteProfile />
              </Grid>
            </Paper>

            <ToastContainer />
          </Grid>
        </Box>
      ) : (
        <Grid height="50vh">
          <CircularProgress
            size={48}
            sx={{
              position: "absolute",
              top: "30%",
              left: "50%",
              fontWeight: 900,
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        </Grid>
      )}
      <Dialog
        open={openPasswordDialog}
        onClose={() => {
          setOpenPasswordDialog(false);
          setOldPassword("");
          setNewPassword("");
        }}
      >
        <DialogTitle>Update Password</DialogTitle>
        <Grid sx={{ padding: 5 }}>
          <Grid>
            <TextField
              label="Old Password"
              fullWidth
              type={showPassword ? "text" : "password"}
              value={oldPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
            />
          </Grid>
          <Grid sx={{ my: 2 }}>
            <TextField
              label="New Password"
              fullWidth
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter old password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid container justifyContent="center">
            <Button
              variant="contained"
              color="error"
              sx={{
                width: { md: "180px", xs: "120px" },
                height: "40px",
                borderTopRightRadius: "20px",
              }}
              onClick={updatePasswordHandler}
            >
              Update Password
            </Button>
          </Grid>
        </Grid>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete Account</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button
            sx={{
              width: { md: "180px", xs: "120px" },
              height: "40px",
              borderTopRightRadius: "20px",
            }}
            onClick={() => setOpenDeleteDialog(false)}
          >
            Cancel
          </Button>
          <Button
            sx={{
              width: { md: "180px", xs: "120px" },
              height: "40px",
              borderTopRightRadius: "20px",
            }}
            onClick={deleteAccountHandler}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle fontWeight={700} sx={{ color: "#81201F" }}>
          Edit Profile
        </DialogTitle>

        <DialogActions>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{ width: "100vw" }}
          >
            {/* <Paper > */}
            {/* <CssBaseline /> */}
            <Box
              sx={{
                marginTop: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ mx: { md: 4, sm: 2, xs: 1 } }}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    value={firstName}
                    onChange={(e) =>
                      dispatch(UserActions.firstName(e.target.value))
                    }
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sx={{ mx: { md: 4, sm: 2, xs: 1 } }}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    value={lastName}
                    onChange={(e) =>
                      dispatch(UserActions.lastName(e.target.value))
                    }
                    autoComplete="family-name"
                  />
                </Grid>

                <Grid item xs={12} sx={{ mx: { md: 4, sm: 2, xs: 1 } }}>
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
                        dispatch(UserActions.gender(e.target.value))
                      }
                      // onChange={handleChange}
                    >
                      <MenuItem value={"Male"}>Male</MenuItem>
                      <MenuItem value={"Female"}>Female</MenuItem>
                      <MenuItem value={"Other"}>Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ mx: { md: 4, sm: 2, xs: 1 } }}>
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
                        Image
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
                          dispatch(UserActions.profilePicture(null));
                          // setSelectedFileUrl("");
                        }}
                      >
                        <CloseIcon />
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Box>
            {/* </Paper> */}

            <Grid item spacing={2}>
              <Button
                onClick={editAccountHandler}
                color="secondary"
                variant="outlined"
                style={{
                  backgroundColor: "#B60E0E",
                  color: "#fff",
                  marginRight: "10px",
                  width: { md: "180px", xs: "120px" },
                  height: "40px",
                  borderTopRightRadius: "20px",
                  marginTop: "10px",
                  marginBottom: "5px",
                }}
                sx={{width: { md: "180px", xs: "120px" },
                height: "40px",
                borderTopRightRadius: "20px",}}
              >
                Confirm
              </Button>
              <Button
                onClick={() => setOpenEditDialog(false)}
                color="secondary"
                variant="outlined"
                style={{
                  backgroundColor: "#B60E0E",
                  color: "#fff",
                  
                  marginTop: "10px",
                  marginBottom: "5px",
                }}
                sx={{width: { md: "180px", xs: "120px" },
                height: "40px",
                borderTopRightRadius: "20px",}}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewProfile;
