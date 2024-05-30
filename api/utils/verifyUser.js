import  Jwt  from "jsonwebtoken";
import { ErrorHandler}  from "./error.js";
export const verifyToken =(req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(ErrorHandler(401,'unauthorized'));
    }
    Jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return next(ErrorHandler(401,'unauthorized'));
        }
        req.user = user;
        next();
    })
};