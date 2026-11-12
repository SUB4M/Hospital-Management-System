import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express'
import {connectDB} from './config/db.js'
import doctorRouter from './routes/doctorRoute.js';
import serviceRouter from './routes/serviceruoter.js';
import appointementRouter from './routes/appointmentRouter.js';
import serviceAppointmentRouter from './routes/serviceappointmentRouter.js';

const app = express();
const port = 4000;

const allowedOrigins=[
    "https://hospital-management-system-frontend-gk7w.onrender.com",
    "https://hospital-management-system-admin-2dy3.onrender.com"
]

//middleware
app.use(cors({
    origin:function(origin,callback){
        if(!origin) return  callback(null,true)
            if(allowedOrigins.includes(origin)){
                return callback(null,true)
            }
            return callback(new Error("Nor allowed by CORS"))
    },
    credentials:true,
    methods:["GET","PUT","POST","DELETE","OPTIONS"],
    allowedHeaders:["content-Type","Authorization"]

}))
app.use(clerkMiddleware())
app.use(express.json({limit:"20mb"}))
app.use(express.urlencoded({limit:"20mb",extended:true}))

//db
connectDB();
//routes
app.use("/api/doctors",doctorRouter);
app.use("/api/services",serviceRouter);
app.use("/api/appointments",appointementRouter)
app.use("/api/service-appointment",serviceAppointmentRouter)

app.get('/',(req,res)=>{
    res.send("API WORKING")
})
app.listen(port,()=>{
    console.log(`server started on http://localhost:${port}`)
})