import { Box, Container, Grid, Typography,CircularProgress, TextField, } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";


const MyPublicPlaylist = () => {
    const token = localStorage.getItem("token");
    const [DataAll, setDataAll] = useState([]);
    const [searching, setsearching] = useState(null);
  
    const [isLoading, setIsLoading] = useState(false);
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const getAllData = async () => {
      try {
        const { data } = await axios.get(
            "https://smoggy-necklace-yak.cyclic.app/playlist/getallpublicplaylist",config
          // "http://192.168.1.6:8000/playlist/getallpublicplaylist",config
        );
        setDataAll(data.allPlaylist);
        console.log(data, "data");
      } catch (err) {}
    };
    useEffect(() => {
      getAllData();
    }, []);
    console.log(DataAll, "---------");
    const handleSearch = (e) => {
      const searchValue = e.target.value.toLowerCase();
      setsearching(searchValue);
    
      if (searchValue.length === 0 || searchValue === "") {
        getAllData();
      } else {
        const filteredData = DataAll.filter((item) => {
          const playlistName = item.playlistData;
          const hasMatchingMovie = playlistName.some(
            (val) => val.movieslistId.movieTitle.toLowerCase().includes(searchValue)
            );
            return hasMatchingMovie;
          });
        setDataAll(filteredData);
      }
    };
    return (
      <Container>
        <Grid container>
        <Grid item xs={12} sm={12} sx={{my:2,mx:4}}>
          <TextField
            autoComplete="given-name"
            name="searching"
            value={searching}
            onChange={handleSearch}
            required
            fullWidth
            id="searching"
            label={"Searching"}
            autoFocus
          />
        </Grid>
          {DataAll &&
            DataAll.map((value, id) => (
              <Grid
                item
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
                  <Typography>{value.playlistName}</Typography>
                  <Typography>{value.playlistType}</Typography>
                </Box>
                <Box>
                  {value.playlistData &&
                    value.playlistData.map((val, id) => (
                      <Box>
                        {console.log(val.movieslistId, "pppppppp")}
                        <img
                          src={val?.movieslistId?.movieImage}
                          alt="roomy logo"
                          width={"300px"}
                          height={"300px"}
                        />
                         <Box>
                  <Typography>{val?.movieslistId?.movieTitle}</Typography>
                  <Typography>{val?.movieslistId?.movieYear}</Typography>
                </Box>
                      </Box>
                    ))}
                </Box>
               
              </Grid>
            ))}
        </Grid>
      </Container>
    );
  };

export default MyPublicPlaylist