import cloudinary from "../config/cloudinary.config.js"
import fs from "fs"


const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        
        // upload on  cloudinary
        const response = await cloudinary.uploader.upload(
            localFilePath, {resource_type : "auto"}
        )

        console.log("Cloudinary response:", response.url)  // ← add karo
        // server se delete
        fs.unlinkSync(localFilePath)

        return response
    }
    catch(error){
        // upload fail hue delete the file
        console.error("Cloudniary error", error.message)
        fs.unlinkSync(localFilePath)
        return null
    }
}

export {uploadOnCloudinary}