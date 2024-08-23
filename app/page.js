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
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from '@mui/system';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



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

  const fadeInKeyframes = `
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

  const HeaderGradientText = styled(Typography)(({ theme }) => ({
    background: 'linear-gradient(to right, #f0f0f0, #5a66d6)', // Gradient colors
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: '',
    fontWeight: 'bold',
    fontSize: '6rem',
    animation: `shimmer 2s linear infinite, fadeIn 2s ease-in-out`,
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '-200% 0',
    },
    '100%': {
      backgroundPosition: '200% 0',
    },
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
    [theme.breakpoints.down('lg')]: {
      fontSize: '5rem', // Size for large screens
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '4rem', // Size for medium screens
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '3rem', // Size for small screens
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '2rem', // Size for extra small screens
    },
  }));

  const SubGradientText = styled(Typography)(({ theme }) => ({
    background: 'linear-gradient(to right, #5a66d6, #f0f0f0)', // Gradient colors
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: '',
    fontSize: '2rem',
    animation: `shimmer 2s linear infinite, fadeIn 2s ease-in-out`,
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '-200% 0',
    },
    '100%': {
      backgroundPosition: '200% 0',
    },
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
    [theme.breakpoints.down('lg')]: {
      fontSize: '1rem', // Size for large screens
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '1rem', // Size for medium screens
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem', // Size for small screens
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.5rem', // Size for extra small screens
    },
      
  }));
  


  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #000046, #000000)', 
        '@keyframes move': {
          '0%': {
            transform: 'translateY(0)',
          },
          '100%': {
            transform: 'translateY(-100vh)',
          },
        },
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
        {circles}
      </Box>
      <style jsx>{`
        @keyframes twinkle {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
       
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
        >
          {" "}
          <HeaderGradientText>Welcome to FlipFlash</HeaderGradientText>
        </Typography>{" "}
        <Typography variant="h5" gutterBottom color="white">
          <SubGradientText>The easiest way to make flashcards from your text</SubGradientText>
        </Typography>
      </Box>
      <Box
        sx={{
          my: 6,
        }}
      > </Box>

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
      {/* <Box
      sx={{
        backgroundColor: 'transparent',
        padding: '60px 0',
        mt: 8,
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md" >
        <Typography variant="h4" gutterBottom>
          <SubGradientText>Frequently Asked Questions</SubGradientText>
        </Typography>
        <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <Typography>What is the purpose of this site?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            This site allows users to easily create and manage flashcards for studying and review.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
        >
          <Typography>How can I create a new flashcard?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            You can create a new flashcard by navigating to the 'Create Flashcard' page and filling out the form.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
        >
          <Typography>Can I share my flashcards with others?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes, you can share your flashcards by sending a link to others or by sharing your collection directly.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4a-content"        >
          <Typography>Is there a way to review my flashcards?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Absolutely! You can review your flashcards in the 'Review' section, where you can go through your cards one by one.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </Container>
    </Box> */}
      
    </Box>
  );
}
