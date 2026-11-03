import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

//configure cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

//to upload the file to the cloudinary 
export async function uploadToCloudinary (filePath,folder="Doctor"){
    try {
        const result = await cloudinary.uploader.upload(filePath,{
            folder,
            resource_type : "image"
        })

        //remove the local file after upload
        fs.unlinkSync(filePath)
        return result;
    } catch (err) {
        console.error("cloudinary upload error:",err)
        throw err;
    }
}

//to delete
export async function deletefromcloudinary (publicId){
    try {
        if(!publicId) return;
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.error("cloudinary delete error:", err)
        throw err;        
    }
}

export default cloudinary