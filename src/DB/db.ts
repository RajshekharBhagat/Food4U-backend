import mongoose from "mongoose";
import { DB_NAME } from '../constant'


const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}/${DB_NAME}`);
        console.log(`\n MongoDB connected to DB Host: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`MongoDB Connection Error: ${error}`);
        process.exit(1)
    }
}

export default connectDB;