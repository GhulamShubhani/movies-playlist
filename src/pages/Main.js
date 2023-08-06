import { Box, Container,CircularProgress, FormControl, FormControlLabel, Grid, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector } from "react-redux";

const Main = () => {
    const token = localStorage.getItem("token");
  const [DataAll, setDataAll] = useState([]);
  const [PlaylistData, setPlaylistData] = useState([]);
  const [movieslistId, setmovieslistId] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [publicState, setpublicState] = useState(null);
  const [moviesTitle, setMoviesTitle] = useState(null);
  const [moviesYears, setMoviesYears] = useState(null);
  const [moviesImageUrl, setMoviesImageUrl] = useState(null);
  const [playlistEwName, setplaylistEwName] = useState(null);
  const [openType, setOpenType] = useState(false);
  const [selectExisting, setSelectExisting] = useState("new");

  const {
    email,
    gender,
  } = useSelector((state) => state.user);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getAllData = async () => {
        setIsLoading(true);
        try{

            const { data } = await axios.get(
              "https://smoggy-necklace-yak.cyclic.app/add/getList1"
            );
            setDataAll(data);
            // console.log(data, "data");
        }catch(err){
            console.log(err);
        } finally {
            setIsLoading(false);
          }

    };
    getAllData();
  }, []);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    const getAllData = async () => {
      try {
        const { data } = await axios.get(
          "https://smoggy-necklace-yak.cyclic.app/playlist/getplaylist",config
        );
        setPlaylistData(data.allPlaylist);
        // console.log(data, "datasetPlaylistData");
      } catch (err) {
        console.log(err);
      }
    };
    getAllData();
  }, []);
//   console.log(DataAll, "---------");

  const SubmitApiCall = async ()=>{
    if(selectExisting ==="old"){
        try{
            const res = await axios.post("https://smoggy-necklace-yak.cyclic.app/playlist/getplaylist",{
                "email":email,
                 "playlistName":"test3",
                 "playlistType":"private",
                 "playlistData":{
                     "movieTitle":moviesTitle,
                     "movieYear":moviesYears,
                     "movieImage":moviesImageUrl
                 }
                
             },config)
             if(res){
                handleClose()
             }
        }catch(err){
            console.log(err);
        }
    }else{
        try{
            console.log({
                "email":email,
                "playlistName":playlistEwName,
                "playlistType":publicState,
                "playlistData":[{
                   "movieTitle":moviesTitle,
                   "movieYear":moviesYears,
                   "movieImage":moviesImageUrl
                }]

            });
            // const res = await axios.post("http://192.168.1.6:8000/playlist/CreatePlaylist",{
            const res = await axios.post("https://smoggy-necklace-yak.cyclic.app/playlist/CreatePlaylist",{
                "email":email,
                 "playlistName":playlistEwName,
                 "playlistType":publicState,
                 "playlistData":[{
                    movieslistId
                 }]
                
             },config)
             if(res){
                handleClose()
             }
             console.log(res,"data aaya add ho k");
        }catch(err){
            console.log(err);
        }
    }
  }

  const handleDailogBox = (data)=>{
    handleClickOpen()
    setMoviesImageUrl(data.movieImage)
    setMoviesYears(data.movieYear)
    setMoviesTitle(data.movieTitle)
    setmovieslistId(data._id)
    console.log(data,"popo");
  }
  return (
    <Container>
      <Grid container>
        {DataAll.map((value, id) => (
         
            <Grid
              item
              onClick={()=>handleDailogBox(value)}
              xs={12}
              sm={6}
              md={4}
              sx={{
                border: "1px solid black",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
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
              <Box>
                <img
                  src={value.movieImage}
                  alt="roomy logo"
                  width={"300px"}
                  height={"300px"}
                />
              </Box>
              <Box>
                <Typography>{value.movieTitle}</Typography>
                <Typography>{value.movieYear}</Typography>
              </Box>
            </Grid>
        
        ))}
         <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Playlist"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           <Grid container sx={{m:2,p:2,display:"flex",flexDirection:"column"}}>
            <Grid item onClick={()=>{setOpenType(true)}}>Add New PlayList</Grid>
           {openType && 
            <Grid item>
                <Grid container spacing={2} sx={{display:"flex",flexDirection:"column" ,m:1}}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="playlistEwName"
                      value={playlistEwName}
                      onChange={(e) =>
                        setplaylistEwName(e.target.value)
                      }
                      required
                      fullWidth
                      id="playlistEwName"
                      label="Playlist Name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
            <FormControl
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      name="room"
                      value="public"
                      checked={publicState === "public"}
                      onChange={() => setpublicState("public")}
                      control={<Radio />}
                      label="Public"
                      onClick={ ()=>setSelectExisting("new")}
                    />
                    <FormControlLabel
                      name="room"
                      value="private"
                      checked={publicState === "private"}
                      onChange={() => setpublicState("private")}
                      control={<Radio />}
                      label="Private"
                      onClick={ ()=>setSelectExisting("new")}
                    />
                  </RadioGroup>
                </FormControl>
                </Grid>
                </Grid>
            </Grid>
            }
            or Add in Existing
            <Grid item>
            {PlaylistData && PlaylistData.map((value,id)=>(
                <Typography onClick={ ()=>setSelectExisting("old")}>
                    {value.playlistName}
                </Typography>
            ))}
            </Grid>
           </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={SubmitApiCall} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      </Grid>
    </Container>
  );
};

export default Main;
