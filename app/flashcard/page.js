"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, docRef } from "firebase/firestore";
import { db } from "@/firebase";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardActionArea,
  CardContent,

} from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";


export default function Flashcard() {
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
  const handleNavigation = (path) => () => {
    setDrawerOpen(false); // Close the drawer
    router.push(path); // Navigate to the selected page
  };

  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;
      const colRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(colRef);
      const flashcards = [];

      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [user, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }


  const SubGradientText = styled(Typography)(({ theme }) => ({
    background: "linear-gradient(to right, #D5AAFF, #000000)", // Gradient colors
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "",
    fontSize: "2rem",
    animation: `shimmer 2s linear infinite, fadeIn 2s ease-in-out`,
    "@keyframes shimmer": {
      "0%": {
        backgroundPosition: "-200% 0",
      },
      "100%": {
        backgroundPosition: "200% 0",
      },
    },
    "@keyframes fadeIn": {
      "0%": {
        opacity: 0,
      },
      "100%": {
        opacity: 1,
      },
    },
    [theme.breakpoints.down("lg")]: {
      fontSize: "1rem", // Size for large screens
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "1rem", // Size for medium screens
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem", // Size for small screens
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.5rem", // Size for extra small screens
    },
  }));




  return (
    <Box
    sx={{
      position: "relative",
      width: "100vw",
      minHeight: "100vh", // Ensures Box takes at least full viewport height but can expand
      overflow: "hidden",
      background: "linear-gradient(to bottom, #f0f0f0, #91bbff)",
      paddingBottom: "20px", // Add some padding to ensure content doesn't touch the edge
      textAlign: "center",
      boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.1)",
      justifyContent: "center",
      alignItems: "center",    
  }}>
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

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            background: 'linear-gradient(to top, #f0f0f0, #b7cced)', // Custom background color
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Header inside Drawer */}
          <Box sx={{ p: 2, textAlign: 'center', backgroundColor: 'transparent', color: '#fff' }}>
            <Typography variant="h6" ><SubGradientText>FlipFlash</SubGradientText></Typography>
          </Box>

          {/* Buttons for Navigation */}
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ my: 1 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                href="/"
                sx={{
                  my: 1,
                  backgroundColor: 'transparent',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Home
              </Button>
            </Box>
            <Box sx={{ my: 1 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                href="/generate"
                sx={{
                  my: 1,
                  backgroundColor: 'transparent',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Generate
              </Button>
            </Box>
            <Box sx={{ my: 1 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                href="/flashcards"
                sx={{
                  my: 1,
                  backgroundColor: 'transparent',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Flashcards
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
      <Grid contianer spacing={3} sx={{ mt: 4 }}>
        {" "}
        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5">Flashcards Preview</Typography>
            <Grid container spacing={3}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardActionArea
                      onClick={() => {
                        handleCardClick(index);
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            perspective: "1000px",
                            width: "100%",
                            height: "200px", // Adjust this as needed
                            "& > div": {
                              transition: "transform 0.6s",
                              transformStyle: "preserve-3d",
                              position: "relative",
                              width: "100%",
                              height: "100%",
                              boxShadow: "0 4px 8px 0 rgba(0,0,0, 0.2)",
                              transform: flipped[index]
                                ? "rotateY(180deg)"
                                : "rotateY(0deg)",
                            },
                            "& > div > div": {
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              backfaceVisibility: "hidden",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 2,
                              boxSizing: "border-box",
                            },
                            "& > div > div:nth-of-type(2)": {
                              transform: "rotateY(180deg)",
                            },
                          }}
                        >
                          <div>
                            <div>
                              <Typography
                                variant="h5"
                                component="div"
                                sx={{ fontSize: "1.2rem" }}
                                alignItems="center"
                              >
                                {flashcard.front}
                              </Typography>
                            </div>
                            <div>
                              <Typography
                                variant="h5"
                                component="div"
                                sx={{ fontSize: "1.2rem" }}
                                alignItems="center"
                              >
                                {flashcard.back}
                              </Typography>
                            </div>
                          </div>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Grid>
    </Box>
  );
}
