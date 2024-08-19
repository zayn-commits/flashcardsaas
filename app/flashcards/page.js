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
            position: "fixed",
            width: "100vw",
            minHeight: "100vh", // Ensures Box takes at least full viewport height but can expand
            overflow: "hidden",
            background: "linear-gradient(to bottom, #f0f0f0, #91bbff)",
            paddingBottom: "20px", // Add some padding to ensure content doesn't touch the edge
            textAlign: "center",
            boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.1)",
            justifyContent: "center",
            alignItems: "center",    
        }}
      >
        <Toolbar position="fixed" display = "flex" justifyContent= "center"
            alignItems =  "center" >
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
            maxWidth: 1500, // Set max width for the box
            p: 4, // Padding inside the box
            borderRadius: 2, // Rounded corners
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow effect
            backgroundColor: '#f5f5f5', // Background color
            display: "flex",
            paddingLeft: "50px", // Center grid items vertically
            flexDirection: "column",
            justifyContent: "center"

          }}
        >
          <Grid 
            container 
            spacing={3} 
            justifyContent="center" // Center grid items horizontally
            alignItems="center"          >
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    borderRadius: 2, // Rounded corners
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Card shadow
                    transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transitions
                    '&:hover': {
                      transform: 'scale(1.05)', // Slight zoom effect on hover
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Enhanced shadow on hover
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                    <CardContent>
                      <Typography variant="h6">
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
    )
}