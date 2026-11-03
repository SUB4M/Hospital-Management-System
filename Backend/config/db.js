import mongoose from 'mongoose'

export const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://subhamsinhaprof_db_user:RlYpBceOZlzPmVcM@cluster0.wvhjjg2.mongodb.net/Medicare")
    .then(()=>{
        console.log("DB CONNECTED")
    })
}