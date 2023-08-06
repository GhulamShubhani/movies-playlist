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

const UploadMovies = () => {
  const [title, setTitle] = useState(null);
  const [imageUrl, setimageUrl] = useState(null);
  const [date, setdate] = useState(null);

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
              setimageUrl(url);
            })
            .catch((err) => {});
        })
        .catch((err) => {});
    } catch (error) {}
  };

  const handleSubmit = async ()=>{
    const response  = await axios.post("http://192.168.1.5:8000/add/createList1",{
        movieTitle:title,
        movieYear:date,
        movieImage:imageUrl
    })
    console.log(response,"67890");
  }

  return (
    <Grid container sx={{margin:8}}>
      <Grid item xs={12} sm={6}>
        <TextField
          autoComplete="given-name"
          name="firstName"
          value={title}
          required
          fullWidth
          onChange={(e)=>{setTitle(e.target.value)}}
          id="title"
          label={"Title"}
          autoFocus
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          autoComplete="given-name"
          name="date"
          value={date}
          required
          fullWidth
          onChange={(e)=>{setdate(e.target.value)}}
          id="date"
          label={"Date"}
          autoFocus
        />
      </Grid>

      <Grid item xs={12}>
        {imageUrl === null ? (
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
               Picture
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
            <img src={imageUrl} alt="send file" width="150px" />
            <Box
              onClick={() => {
                setimageUrl(null);
              }}
            >
              <CloseIcon />
            </Box>
          </Grid>
        )}
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
                  onClick={handleSubmit}
                //   disabled={isLoading}
                >
                  {/* {isLoading && (
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
                  )} */}
                  Submit
                </Button>
              </Box>

    </Grid>
  );
};

export default UploadMovies;
