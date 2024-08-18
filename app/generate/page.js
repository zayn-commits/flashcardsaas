'use client'

import { useUser } from "@clerk/nextjs"
import { Container, Box, Typography, Paper, TextField, Button, Card, CardActionArea, CardContent, DialogTitle, DialogContentText, DialogActions, Dialog, DialogContent, Grid } from "@mui/material"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { db } from "@/firebase"
import { doc, collection, setDoc, getDoc, writeBatch } from "firebase/firestore"


export default function Generate() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async ()=>{

        fetch('api/generate', {
            method:'POST',
            body: text,
        })
        .then((res)=> res.json())
        .then((data) => setFlashcards(data))
    }

    const handleCardClick = (id) =>{
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const SaveFlashcards = async () => {
        if(!name) {
            alert('Please enter a name')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if(docSnap.exists()){
            const collections = docSnap.data().flashcards || []
            if(collections.find((f)=> f.name === name)){
                alert("Flashcard collection with the same name already exists")
                return
            }
            else{
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        }
        else {
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return(
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
        

                <Typography variant ="h4">
                    Generate Flashcards
                </Typography>
                <Paper sx={{p:4, width: '100%'}}>
                    <TextField 
                    value = {text}
                    onChange = {(e) => setText(e.target.value)} 
                    label = "Enter text"
                    fullWidth 
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{
                        mb:2,
                    }} 
                    /> 
                    <Button 
                    variant ='contained'
                    color  ="primary"
                    onClick={handleSubmit}
                    fullWidth
                    >Submit</Button>
                </Paper>
            </Box>

            {flashcards.length > 0 && (<Box sx= {{mt:4}}>
                <Typography variant = "h5">Flashcards Preview</Typography>
                <Grid container spacing = {3}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs = {12} sm = {6} md = {4} key = {index}>
                            <Card>
                                <CardActionArea
                                    onClick={()=> {
                                        handleCardClick(index)
                                    }}   
                                >
                                    <CardContent>
                                        <Box sx={{
                                            perspective: '1000px',
                                            width: '100%',
                                            height: '200px', // Adjust this as needed
                                            '& > div': {
                                                transition: 'transform 0.6s',
                                                transformStyle: "preserve-3d",
                                                position: "relative",
                                                width: '100%',
                                                height: '100%',
                                                boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                                                transform: flipped[index]? 'rotateY(180deg)': 'rotateY(0deg)',
                                            },
                                            '& > div > div': {
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                backfaceVisibility: 'hidden',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                padding: 2,
                                                boxSizing: 'border-box',
                                            },
                                            '& > div > div:nth-of-type(2)': {
                                                transform: 'rotateY(180deg)'
                                            },
                                        }}>
                                            <div>
                                                <div>
                                                    <Typography variant="h5" component="div" sx={{ fontSize: '1.2rem' }} alignItems='center'> 
                                                        {flashcard.front}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="h5" component="div" sx={{ fontSize: '1.2rem' }} alignItems='center'> 
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
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <Button 
                    variant = 'contained'
                    color = 'secondary'
                    onClick={handleOpen}>
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
                        margin = "dense"
                        label = "Collection Name"
                        type = "text"
                        fullWidth
                        value = {name}
                        onChange={(e) => setName(e.target.value)}
                        variant = "outlined"
                        
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button onClick={SaveFlashcards}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
                </Box>
        </Box>
    )

}