"use client";
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import Head from "next/head";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => () => {
    setDrawerOpen(false); // Close the drawer
    router.push(path); // Navigate to the selected page
  };

  const circleCount = 75; // Increased number of circles for a denser effect

  const circles = Array.from({ length: circleCount }, (_, index) => (
    <Box
      key={index}
      sx={{
        position: "absolute",
        borderRadius: "50%",
        width: `${Math.random() * 5 + 3}px`, // Smaller size range between 3px and 8px
        height: `${Math.random() * 3 + 3}px`,
        backgroundColor: "rgba(255, 255, 255, 0.6)", // Slightly more transparent circles
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animation: `move ${Math.random() * 15 + 10}s ease-in-out infinite`, // Smoother animation with longer duration
      }}
    />
  ));

  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        origin: "http;//localhost:3000",
      },
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };


  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #000046, #1d1d1d)', // Space background gradient
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none', // Allows clicking through the background
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {[...Array(100)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                opacity: Math.random() * 0.6 + 0.4,
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                top: `${Math.random() * 100}vh`,
                left: `${Math.random() * 100}vw`,
                animation: 'twinkle 1.5s infinite alternate',
              }}
            />
          ))}
        </Box>
      </Box>
      <style jsx>{`
        @keyframes twinkle {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
      {circles}
      <Toolbar position="fixed">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }} />
        <SignedOut>
          <Button color="inherit" href="/sign-in">
            {" "}
            Login{" "}
          </Button>
          <Button color="inherit" href="/sign-up">
            {" "}
            Signup{" "}
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </Toolbar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            backgroundColor: 'transparent', // Drawer background color
            color: '#ecf0f1', // Text color inside the Drawer
          },
        }}
      >
        <List>
          <ListItem button onClick={handleNavigation("/")}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={handleNavigation("/generate")}>
            <ListItemText primary="Generate" />
          </ListItem>
          <ListItem button onClick={handleNavigation("/flashcards")}>
            <ListItemText primary="Flashcards" />
          </ListItem>
          {}
        </List>
      </Drawer>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // Centers vertically
          alignItems: "center", // Centers horizontally
          height: "100vh", // Full viewport height
          textAlign: "center",
          paddingBottom: "150px", // Adjust according to AppBar heigh
        }}
      >
        <Typography
          variant="h2"
          gutterBottom
          color="white"
          sx={{
            fontFamily: "Garamond", // Change this to your desired font
          }}
        >
          {" "}
          Welcome to Flashcard SaaS
        </Typography>{" "}
        <Typography variant="h5" gutterBottom color="white">
          The easiest way to make flashcards from your text
        </Typography>
      </Box>
      <Box
        sx={{
          my: 6,
        }}
      ></Box>

      {/* <Box
        sx={{
          my: 6,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" gutterBottom>
                Basic
              </Typography>
              <Typography variant="h6" gutterBottom>
                $5 / month
              </Typography>

              <Typography>
                Basic flashcard features and limited storage.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
                }}
              >
                Choose Basic
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" gutterBottom>
                Pro
              </Typography>
              <Typography variant="h6" gutterBottom>
                $10 / month
              </Typography>

              <Typography>
                Unlimited flashcards and storage, priority support
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
                }}
                onClick={handleSubmit}
              >
                Choose Pro
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box> */}
    </Box>
  );
}
