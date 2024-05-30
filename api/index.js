import  express  from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser"
dotenv.config();
const app = express();
app.use(express.json());
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
app.use((err,req,res,next)=>{
    const statuscode = err.statuscode || 500;
    const message = err.message || "Something went wrong";
    return res.status(statuscode).json({
        success: false,
        statuscode,
        message
    });
});