import express from "express"
import dotenv from "dotenv"
dotenv.config()
import { connectBD } from "./configs/dbConnetion"

const app = express()

connectBD()

const port = process.env.PORT!

app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`)
})
