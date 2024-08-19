"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  writeBatch,
} from "firebase/firestore";
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
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => () => {
    setDrawerOpen(false); // Close the drawer
    router.push(path); // Navigate to the selected page
  };

  const handleSubmit = async () => {
    fetch("api/generate", {
      method: "POST",
      body: text,
    })
      .then((res) => res.json())
      .then((data) => setFlashcards(data));
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const SaveFlashcards = async () => {
    if (!name) {
      alert("Please enter a name");
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert("Flashcard collection with the same name already exists");
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push("/flashcards");
  };

  const HeaderGradientText = styled(Typography)(({ theme }) => ({
    background: "linear-gradient(to right, #000000, #5a66d6)", // Gradient colors
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "",
    fontWeight: "bold",
    fontSize: "4rem",
    animation: `shimmer 2s linear infinite, fadeIn 2s ease-in-out`,
    "@keyframes fadeIn": {
      "0%": {
        opacity: 0,
      },
      "100%": {
        opacity: 1,
      },
    },
    [theme.breakpoints.down("lg")]: {
      fontSize: "5rem", // Size for large screens
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "4rem", // Size for medium screens
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "3rem", // Size for small screens
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "2rem", // Size for extra small screens
    },
  }));

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
        flexDirection: "column",
        display: "flex",
        paddingBottom: "300px"

      }}
    >
      <Toolbar 
          position="fixed" 
          sx={{
          width: '100%',
          top: "px",
          left: 0,
          zIndex: 1200, // Ensure it's above other content
        }} >
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
            background: "linear-gradient(to top, #f0f0f0, #b7cced)", // Custom background color
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Header inside Drawer */}
          <Box
            sx={{
              p: 2,
              textAlign: "center",
              backgroundColor: "transparent",
              color: "#fff",
            }}
          >
            <Typography variant="h6">
              <SubGradientText>FlipFlash</SubGradientText>
            </Typography>
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
                  backgroundColor: "transparent",
                  color: "#000",
                  "&:hover": {
                    backgroundColor: "transparent",
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
                  backgroundColor: "transparent",
                  color: "#000",
                  "&:hover": {
                    backgroundColor: "transparent",
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
                  backgroundColor: "transparent",
                  color: "#000",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                Flashcards
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>

      <Typography
        variant="h4"
        align="center"
        sx={{ mb: 4, fontWeight: "bold", color: "#00796b" }}
      >
        <HeaderGradientText>Enter prompt for flashcard set</HeaderGradientText>
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 600,
          borderRadius: 2,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center", // Ensure text alignment is centered
        }}
      >
        <TextField
          align="center"
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": {
                borderColor: "#00796b",
              },
              "&:hover fieldset": {
                borderColor: "#004d40",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#004d40",
              },
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{
            borderRadius: 2,
            py: 1.5,
            fontWeight: "bold",
            backgroundColor: "#00796b",
            "&:hover": {
              backgroundColor: "#004d40",
            },
          }}
        >
          Submit
        </Button>
      </Paper>

      {flashcards.length > 0 && (
        <Box sx={{
            mt: 4, 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection:"column" }}>
          <Typography variant="h5" align="center" sx={{ mb: 2}} >Flashcards Preview</Typography>
          <Grid container spacing={3} 
                sx={{
                maxWidth: "100%", // Ensure it doesn't exceed screen width
                justifyContent: "center", 
                display: "flex",
                paddingLeft: "125px"
            }}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                 sx={{
                    maxWidth: 280, // Adjust maxWidth as needed
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    borderRadius: 2, // Adds rounded corners to the card
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}>
                  <CardActionArea
                    onClick={() => {
                      handleCardClick(index);
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          perspective: "1000px",
                          width: "250px",
                          height: "200px",
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
                              sx={{ fontSize: "1.1rem" }}
                              alignItems="center"
                            >
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography
                              variant="h5"
                              component="div"
                              sx={{ fontSize: "1.1rem" }}
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
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button variant="contained" color="secondary" onClick={handleOpen}>
              Save
            </Button>
          </Box>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcards collections
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={SaveFlashcards}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
