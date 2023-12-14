import {v2 as fileuploader} from "cloudinary"
import {fs} from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;
        const response = await fileuploader.uploader.upload(localFilePath)
        console.log("image Uploaded succesfully",response.url)
        return response
    }
    catch(error){
        fs.unlinkSync(localFilePath)
        return null
    }

}

//* now we will create the multer as a middleware over here so that while uploading fileuploader
//* on cloudinary we get this on our local system (server) and then extract the link 
//* and serve that link to the cloudinary


