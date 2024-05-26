// import express, {Request,Response} from 'express';
// import cors from "cors";
// import "dotenv/config";
// import mongoose from 'mongoose';

// mongoose
// .connect(process.env.MONGODB_CONNECTION_STRING as string)
// .then(()=> {
//     console.log("Connected to database");
// })

// const app = express();
// app.use(express.json());
// app.use(cors());

// app.get("/text", async (req:Request, res: Response) => {
//     res.json({message:"Hello"});
// });

// app.listen(5000,() => {
//     console.log(`Server is listening on http://localhost:5000`)
// })

import 'dotenv/config';
import connectDB from './DB/db';
import { app } from './app';

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000,() => {
        console.log(`Server is running at port: http://localhost:${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log(`MongoDB connection error: ${err}`)
})