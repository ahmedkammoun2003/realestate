import  Jwt  from "jsonwebtoken";
import { ErrorHandler}  from "./error.js";
export const verifyToken =(req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(ErrorHandler(401,'unauthorized123'));
    }
    Jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return next(ErrorHandler(401,'unauthorized15632'));
        }
        req.user = user;
        next();
    })
};