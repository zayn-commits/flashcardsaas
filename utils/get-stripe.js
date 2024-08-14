import { loadStripe } from "@stripe/stripe-js";
let stripePromise 
const getStripe = () =>{
    if(!stripePromise){
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY = pk_live_51PnnslEwcpNez5R6elXXLqKT9rxOQjRpVfojCjQEFiiLTYVnbb81SDfBLeFkHJAglMmFvOC46VloJPhasmL0fxWe00xXBtzRtA
        )
    }
    return stripePromise
}

export default getStripe