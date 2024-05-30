import User from "../models/user.model.js";
import { ErrorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req,res)=>{
    res.json({'message':'hello world'});
};
export const updateUser = async (req,res,next)=>{
    if (req.user.id!==req.params.id) {
        return next(ErrorHandler(401,'you can only update'));
    }
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password,10);
        }
        const updatedUser=User.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar:req.body.avatar,
            }
        },{new:true})
        console.log(updatedUser);
        const {password,...rest}=updatedUser._update['$set'];
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};