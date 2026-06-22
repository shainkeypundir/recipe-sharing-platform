import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"

// get exacct path of the current file
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null,path.join(__dirname,"../../src/uploads/") )
    }, // file ko src/upoad folder me save kr
    filename : function(req, file ,cb){
        cb(null, Date.now() + "-" + file.originalname) // file ka naam (date + orgname)
    }
})

const upload = multer({storage})

export {upload}