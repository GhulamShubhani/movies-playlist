import { Box, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const PublicList = () => {
  const token = localStorage.getItem("token");
  const [DataAll, setDataAll] = useState([]);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    const getAllData = async () => {
      try {
        const { data } = await axios.get(
            "https://smoggy-necklace-yak.cyclic.app/playlist/getallplaylist",config
        //   "http://192.168.1.6:8000/playlist/getallplaylist",config
        );
        setDataAll(data.allPlaylist);
        console.log(data, "data");
      } catch (err) {}
    };
    getAllData();
  }, []);
  console.log(DataAll, "---------");
  return (
    <Container>
      <Grid container>
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

export default PublicList;