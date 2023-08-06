import { Box, Container, Grid, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Main = () => {
    const [DataAll, setDataAll] = useState([])
   
    useEffect(()=>{
        const getAllData = async()=>{
            const {data} = await axios.get("https://smoggy-necklace-yak.cyclic.app/add/getList1")
            setDataAll(data)
            console.log(data,"data");
        }
        getAllData()
    },[])
    console.log(DataAll,"---------");
  return (
   <Container>
    <Grid container>
        
        {DataAll.map((value,id)=>(
            <Grid item xs={12} sm={6} md={4} sx={{border:"1px solid black",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                <Box>
                <img src={value.movieImage} alt="roomy logo" width={"300px"} />
                </Box>
                <Box>
                    <Typography>{value.movieTitle}</Typography>
                    <Typography>{value.movieYear}</Typography>
                </Box>
                 </Grid>
        ))}
    </Grid>
   </Container>
  )
}

export default Main