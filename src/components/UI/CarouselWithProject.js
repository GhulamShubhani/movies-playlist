import React from "react";
import { Grid, Typography, Box, useMediaQuery, useTheme } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DummyImage from "../../assets/maintenance.jpg";
import {
  NavigateNext as CustomNextIcon,
  NavigateBefore as CustomPrevIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const CarouselWithProject = ({ contracts, title }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
      <CustomNextIcon
        style={{
          fontSize: 40,
          position: "absolute",
          right: -45,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
        }}
        onClick={onClick}
      />
    );
  };

  const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
      <CustomPrevIcon
        style={{
          fontSize: 40,
          position: "absolute",
          left: -45,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
        }}
        onClick={onClick}
      />
    );
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.5,
        },
      },
      {
        breakpoint: 350,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Grid sx={{ margin: "auto" }}>
      <Typography
        variant="h5"
        sx={{
          mb: 1,
          pl: { md: 3, sm: 2, xs: 1 },
          color: "#000",
          fontWeight: "600",
        }}
      >
        {title}
      </Typography>

      <Grid style={{ position: "relative" }}>
        <Slider {...settings}>
          {contracts?.map((contract) => (
            <Grid
              sx={{ padding: "15px", width: 300, flexShrink: 0 }}
              key={contract.id}
            >
              <Grid
                sx={{
                  boxShadow: "0px 0px 7px rgba(0,0,0,0.5)",
                  borderRadius: "15px",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={() =>
                  navigate(`/view-contract/${contract.id}?active=true`)
                }
              >
                <div
                  style={{
                    overflow: "hidden",
                    width: "100%",
                    position: "relative",
                    paddingBottom: "70%",
                  }}
                >
                  {contract.images.length > 0 ? (
                    <img
                      src={contract.images[0]}
                      alt={contract.name}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "15px 15px 0 0",
                      }}
                    />
                  ) : (
                    <img
                      src={DummyImage}
                      alt={contract.name}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px 10px  0 0",
                      }}
                    />
                  )}
                </div>
                <div style={{ marginTop: "10px", cursor: "pointer" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      flexDirection: "column",
                      alignItems: "start",
                      ml: 1,
                    }}
                  >
                    <Typography
                      fontWeight={700}
                      fontSize={isSmallScreen ? "0.9rem" : "1rem"}
                      sx={{ whiteSpace: "nowrap", mt: 1 }}
                    >
                      {contract.title}
                    </Typography>
                    <Typography
                      fontWeight={400}
                      fontSize={isSmallScreen ? "0.9rem" : "1rem"}
                      sx={{ whiteSpace: "nowrap", mt: 1 }}
                    >
                      {contract.address.location + ", " + contract.address.city}
                    </Typography>
                    <Typography
                      fontWeight={700}
                      fontSize={isSmallScreen ? "0.9rem" : "1rem"}
                      sx={{ whiteSpace: "nowrap", mt: 1 }}
                    >
                      {contract.poster.firstName} {contract.poster.lastName}
                    </Typography>
                  </Box>
                </div>
              </Grid>
            </Grid>
          ))}
        </Slider>
      </Grid>
    </Grid>
  );
};

export default CarouselWithProject;
