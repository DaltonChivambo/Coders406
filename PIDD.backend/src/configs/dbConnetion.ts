import mongoose from "mongoose";

const dbURL = process.env.DB_URL!

export const connectBD = async ()=>{
    try {
        await mongoose.connect(dbURL)
        console.log("DB Connected")
    } catch (error) {
        console.log("DB not connected")
    }
}