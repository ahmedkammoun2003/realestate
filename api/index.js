import  express  from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO).then(()=>{
    console.log(`Database connected...`);
}).catch(
    err => console.log(err));
app.listen(3000, () => {
    console.log(`Server started on port 3000`);
});
app.use(cookieParser());
app.use('/api',userRoute);
app.use('/api/auth', authRoute);
app.use('/api/listings', listingRouter);
app.use((err,req,res,next)=>{
    const statuscode = err.statuscode || 500;
    const message = err.message || "Something went wrong";
    return res.status(statuscode).json({
        success: false,
        statuscode,
        message
    });
});