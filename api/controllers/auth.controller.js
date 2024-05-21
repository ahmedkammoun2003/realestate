import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { ErrorHandler } from "../utils/error.js";
import  Jwt  from "jsonwebtoken";
export const signup = async (req,res,next)=>{
    const {username,email,password}=req.body;
    const hasherPassword = bcryptjs.hashSync(password,10);
    const newUser = new User({username,email,password:hasherPassword});
    try {
        await newUser.save();
        res.status(201).json({message:"User created successfully"});
    } catch (error) {
        next(error);
    }
};
export const signin = async (req,res,next)=>{
    const {email,password}=req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return next(ErrorHandler(404,"User not found"));
        }
        if(!bcryptjs.compareSync(password,user.password)){
            return next(ErrorHandler(401,"Invalid credentials"));
        }
        const {password:pass,...rest}=user._doc;
        const token = Jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
        res.cookie("access_token",token,{httpOnly:true})
        .status(200)
        .json(rest);
    } catch (error) {
        next(error);
    }
};