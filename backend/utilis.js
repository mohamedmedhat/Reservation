import jwt from 'jsonwebtoken';


export const isAuthorized = (req,res,next)=>{
    const {authorization} = req.headers;
    if(authorization){
        const token = authorization.slice(7,authorization.length);

        if(!token){
            return res.status(401).json({ msg: "No token provided" });
        }

        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
            req.user = decoded;
            next();
        }
        catch(err){
            res.status(401).json({msg:"Invalid token"});
        }
    };  
};