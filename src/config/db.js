import mongoose from "mongoose";

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDb Connected ✅`);
    } catch (error){
        console.error(`DB ERROR : ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;


