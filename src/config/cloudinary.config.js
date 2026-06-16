import {v2 as cloudinary} from "cloudinary"
// yaha pr hme dotenv fir se import krna pda kyuki , cloudniary server.js ki env file se phele load hoti , issliye
// api_key load nhi hoti aur undiefined rehti h, to hm kya kr rahe h , dotenv file ko yhi pr import kr rahe h 
import dotenv from "dotenv"
dotenv.config({ path: "./.env" })

cloudinary.config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

