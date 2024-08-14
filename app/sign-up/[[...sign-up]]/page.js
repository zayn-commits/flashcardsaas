import { SignIn, SignUp } from "@clerk/nextjs"
import { AppBar, Container, Toolbar, Typography, Button, Link, Box} from "@mui/material"

export default function SignUpPage(){
    return (
    <Container maxWidth="sm">
        <AppBar 
        position = "static" 
        sx={{
            backgroundColor: "#3f51b5"
            }}>
            <Toolbar>
                <Typography 
                variant = "h6" 
                sx={{
                    flexGrow:1
                    }}>
                    Flashcard SaaS
                </Typography>
                <Button color = "inherit">
                    <Link href = "/sign-in" passHref>
                        Login
                    </Link>
                </Button>
                <Button color = "inherit">
                    <Link href = "/sign-up" passHref>
                        Sign up
                    </Link>
                </Button>
            </Toolbar>        
        </AppBar>

        <Box
        display = "flex"
        flexDirection = "column"
        alignItems = "center"
        justifyContent = "center"
        >
            <Typography
            variant = "h4" gutterBottom>
                 Sign Up
            </Typography>
            <SignUp />

        </Box>
    </Container>
    
)
}