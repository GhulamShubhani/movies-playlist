import React from "react";
import { Grid, Typography,Tooltip } from "@mui/material";
import FooterImage from "../../assets/Footer/Footer.png";
import { LocationOn, MailOutline, PhoneIphone } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Googlestore from "../../assets/Footer/googleStore.jpg";
import Applestore from "../../assets/Footer/apple.jpg";

import fb from "../../assets/socialmedia/fb5.png";
import instragram from "../../assets/socialmedia/instra5.webp";
import twiter from "../../assets/socialmedia/twitter5.png";
import snapchat from "../../assets/socialmedia/snapchat5.png";
import ticktok from "../../assets/socialmedia/tiktok5.png";
// import ticktok from "../../assets/socialmedia/tiktok1.webp";

import PrivacyPolicyPdf from "../../assets/Footer/files/PrivacyPolicyPMP.pdf";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <>
      <Grid
        container
        sx={{
          width: "100%",
          backgroundColor: `#000`,
          color: "white",
          my: 0,
        }}
      >
        <Grid item xs={12} sm={4}  padding={2} paddingLeft={4}>
          <Typography
            variant="h5"
            sx={{ marginBottom: "10px", fontWeight: 700 }}
          >
            Company Info
          </Typography>
          <Grid container alignItems="center">
            <LocationOn
              sx={{
                mr: 2,
                display: "flex",
                bgcolor: "red",
                alignItems: "center",
                color: "#fff",
                p: 0.5,
                borderRadius: "0 15px 0 0",
              }}
            />
            <Grid>
              <Typography>Abcd test</Typography>
              <Typography>1061</Typography>
              <Typography>Dubai</Typography>
            </Grid>
          </Grid>
          <Grid container alignItems="center" sx={{ marginTop: "10px" }}>
            <PhoneIphone
              sx={{
                mr: 2,
                display: "flex",
                bgcolor: "red",
                alignItems: "center",
                color: "#fff",
                p: 0.5,
                borderRadius: "0 15px 0 0",
              }}
            />
            <Grid>
              <Typography>+9715624852614</Typography>
              <Typography>+971265d845785</Typography>
            </Grid>
          </Grid>
          <Grid container alignItems="center" sx={{ marginTop: "10px" }}>
            <MailOutline
              sx={{
                mr: 2,
                display: "flex",
                bgcolor: "red",
                alignItems: "center",
                color: "#fff",
                p: 0.5,
                borderRadius: "0 15px 0 0",
              }}
            />
            <Typography>support@pricemyproject.com</Typography>
          </Grid>
          <Grid container alignItems="center" sx={{ marginTop: "50px" }}>
            <img
              src={Googlestore}
              alt="google store"
              style={{ borderRadius: "25px", width: "150px" }}
            />
            <img
              src={Applestore}
              alt="apple store"
              style={{ borderRadius: "25px", width: "150px" }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4}  padding={2}>
          <Typography
            variant="h5"
            sx={{ marginBottom: "10px", fontWeight: 700 }}
          >
            About Us
          </Typography>
          <Grid container direction="column" gap={3}>
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => window.open(PrivacyPolicyPdf, "_blank")}
            >
              Privacy Policy
            </Typography>
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => window.open(PrivacyPolicyPdf, "_blank")}
            >
              Terms & Conditions
            </Typography>
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/blogs")}
            >
              Blogs
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4}  padding={2}>
          <Typography
            variant="h5"
            sx={{ marginBottom: "10px", fontWeight: 700 }}
          >
            Company Products
          </Typography>
          <Grid container direction="column" gap={2}>
            <Typography>Electricity Maintenance</Typography>
            <Typography>Air Conditioning Maintenance</Typography>
            <Typography>Landscape Maintenance</Typography>
            <Typography>Pest Control Maintenance</Typography>
            <Typography>General Maintenance</Typography>
            <Typography>Plumbing Maintenance</Typography>
          </Grid>
          <Grid
            item
            sx={{
              // mb: { xs: "-20%" },
              display: "flex",
              flexDirection: "row",
              position: "relative",
              bottom: 0,
              left: 0,
              mt:3,
              // mb: { xs: "-50px", md: "14px" },
            }}
          >
             <Tooltip title="Coming Soon">
           <a href="#">
              <img
                src={fb}
                alt="Facebook"
                style={{
                  height: "40px",
                  width: "40px",
                  marginLeft: "0px",
                  marginRight: "4px",
                }}
              />
            </a>
            </Tooltip>
            <Tooltip title="Coming Soon">
            <a href="#">
              <img
                src={instragram}
                alt="Instragram"
                style={{
                  height: "40px",
                  width: "40px",
                  marginLeft: "4px",
                  marginRight: "4px",
                }}
              />
            </a>
            </Tooltip>
            <Tooltip title="Coming Soon">
              <a href="#">
                <img
                  src={twiter}
                  alt="Footer mobile"
                  style={{
                    height: "40px",
                    width: "40px",
                    marginLeft: "4px",
                    marginRight: "4px",
                  }}
                />
              </a>
            </Tooltip>
            <Tooltip title="Coming Soon">
            <a href="#">
              <img
                src={snapchat}
                alt="Footer mobile"
                style={{
                  height: "40px",
                  width: "40px",
                  marginLeft: "4px",
                  marginRight: "4px",
                }}
              />
            </a>
            </Tooltip>
            <Tooltip title="Coming Soon">
            <a href="#">
              <img
                src={ticktok}
                alt="Footer mobile"
                style={{
                  height: "40px",
                  width: "40px",
                  marginLeft: "4px",
                  marginRight: "4px",
                }}
              />
            </a>
            </Tooltip>
          </Grid>
        </Grid>
       
      </Grid>
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "red",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "1.3rem" }}>
          &copy; 2023 - All Rights Reserved
        </Typography>
      </Grid>
    </>
  );
};

export default Footer;
