'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation"
import { Box, Drawer, CardActionArea, Card, Grid, CardContent, Typography, Toolbar, IconButton, Button } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/system";


export default function Flashcards(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    const circleCount = 100; // Increased number of circles for a denser effect

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
        animation: `move ${Math.random() * 10 + 25}s ease-in-out infinite`, // Smoother animation with longer duration
      }}
    />
  ));
    

    const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => () => {
    setDrawerOpen(false); // Close the drawer
    router.push(path); // Navigate to the selected page
  };
    
    useEffect(()=> {
        async function getFlashcards(){
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()){
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            }
            else{
                await setDoc(docRef, {flashcards: []})
            }
        }
        getFlashcards()   
    }, [user])  

    if (!isLoaded || !isSignedIn){
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
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
    

    return(
      <Box
      sx={{
        position: 'relative',
        display: "flex",
        width: '100vw',
        minHeight: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #000046, #000000)',
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        mb: '0', // Ensure no margin-bottom on the main container
      }}
    >
      {/* Background Circles */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
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
          {circles}
        </Box>
      </Box>

      {/* Toolbar */}
      <Toolbar 
        position="fixed" 
        sx={{
          width: '100%',
          top: 0,
          left: 0,
          zIndex: 1200,
          mb: "110px"
        }}
      >
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
      
      <Box
        sx={{
          overflow: 'hidden',
          maxWidth: 1200,
          width: "100%",
          p: 4,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
          mb: "500px",
          zIndex: 1, // Ensure the content is above the background
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 3, color: "#00796b", fontWeight: "bold" }}
        >
          <SubGradientText>Flashcards Preview</SubGradientText>
        </Typography>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="center"
        >
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                  <CardContent>
                    <Typography variant="h6" align="center">
                      {flashcard.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}