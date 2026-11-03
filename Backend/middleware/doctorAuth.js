import jwt from 'jsonwebtoken'
import Doctor from '../models/doctor.js'

const JWT_SECRET = process.env.JWT_SECRET;

export default async function doctorAuth(req,res,next){
    const authHeader = req.headers.authorization;

    //check token
    if(!authHeader ||  !authHeader.startsWith("Bearer ")){
        res.status(401).json({
            success:false,
            message:"doctor not authorized"
    })
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token,JWT_SECRET);
        if(payload.role && payload.role!=="doctor"){
            return res.status(403).json({
                success:false,
                message:"Access denied"
            })
        }

        //fetch doctor
        const doctor = await Doctor.findById(payload.id).select("-password")
        if(!doctor){
            return res.status(401).json({
                success:false,
                message:"doctor not found"
            })
        }
        //attach doctor to req
        req.doctor=doctor,
        next();

    } catch (err) {
        console.error("doctor verification failed;",err)
        return res.status(401).json({
            success:false,
            message:"Token invalid or expired or missing"
        })   
    }
}