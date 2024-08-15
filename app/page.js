'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Container, Toolbar, Typography, Button, Box, Grid  } from "@mui/material";
import Head from "next/head";

export default function Home() {

  const handleSubmit = async ()=>{
    const checkoutSession = await fetch('/api/checkout_session', {
      method: "POST",
      headers:{
        origin: 'http;//localhost:3000'
      },
    }) 

    const checkoutSessionJson = await checkoutSession.json()

    if(checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error){
      console.warn(error.message)
    }
  }
  return (
    <Container maxWidth="100vw">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name = "description" content = 'Create flashcard from your text' />
      </Head>

      <AppBar position = "static">
        <Toolbar>
          <Typography variant = "h6" style ={{flexGrow: 1}}>Flashcard SaaS</Typography>
          <SignedOut>
            <Button color = 'inherit' href="/sign-in"> Login </Button>
            <Button color = 'inherit' href="/sign-up" >Signup</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
      sx={{
        textAlign: 'center',
        my: 4,
      }}
      >
        <Typography variant = "h2" gutterBottom> Welcome to Flashcard SaaS</Typography>
        {' '}
        <Typography variant = "h5" gutterBottom>
          The easiest way to make flashcards from your text
        </Typography>
        <Button 
        variant = 'contained' 
        color = 'primary' 
        sx={{
          mt:2
        }}>
          Get started
        </Button>
      </Box>
      <Box 
      sx = {{
        my: 6,
      }}>
        <Typography variant = "h4" gutterBottom>
          Features
        </Typography>
        <Grid container spacing ={4}>
          <Grid item xs = {12} md = {4}>
            <Typography variant = "h6" gutterBottom>
              Smart Flashcard
            </Typography>
            <Typography> 
              Our AI intelligently breaks down your text into 
              concise flashcards perfect for studying
            </Typography>
          </Grid>
          <Grid item xs = {12} md = {4}>
            <Typography variant = "h6" gutterBottom>
              Easy Text Input
            </Typography>
            <Typography>Accessible Anywhere</Typography>
          </Grid>
          <Grid item xs = {12} md = {4}>
            <Typography variant = "h6" gutterBottom>
              Easy Text Input
            </Typography>
            <Typography> Simply input your text and let our software do the rest. Creating flashcards has never been easier.</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box 
      sx={{
        my: 6,
        textAlign: 'center',
      }}
      >
        <Typography variant = "h4" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing ={4}>
          <Grid item xs = {12} md = {6}>
            <Box 
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
            <Typography variant = "h5" gutterBottom >Basic</Typography>
            <Typography variant = "h6" gutterBottom >$5 / month</Typography>

            <Typography> 
              Basic flashcard features and limited storage.
            </Typography>
            <Button 
            variant = "contained" 
            color = "primary" 
            sx={{
              mt: 2,
            }}
            >
              Choose Basic
            </Button>
            </Box>
          </Grid>
        
          <Grid item xs = {12} md = {6}>
          <Box 
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
            <Typography variant = "h5" gutterBottom >Pro</Typography>
            <Typography variant = "h6" gutterBottom >$10 / month</Typography>

            <Typography> 
              Unlimited flashcards and storage, priority support
            </Typography>
            <Button 
            variant = "contained" 
            color = "primary" 
            sx={{
              mt: 2,
            }}
            onClick = {handleSubmit}
            >
              Choose Pro
            </Button>
            </Box>
            </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
