import User from "../models/User.js"
import jwt from "jsonwebtoken"

const signup = async (req , res) => {

    try{
// daata lo
    const {username, email, password} = req.body;
    // validate
    if(!username || !email || !password){
        return res.status(400).json({
            success : false,
            message : "All fields are required"
        })
    }

// check if user already exists or not
const existingUser = await User.findOne({
    $or : [{email}, {username}]
})
 
if(existingUser){
    return res.status(409).json({
        success : false, 
        message : "User already exists"
    })
}

// now create the new user
const user = await User.create({
    username,
    email,
    password
})

//extract the safe user

const safeUser = await User.findById(user._id).select("-password -refreshToken");

// ab mera user db me bnn gaya h now , create access + refresh token

const accessToken = user.generateAccessToken();
const refreshToken = user.generateRefreshToken(); // create the refresh token

//refresh token db me save kro
user.refreshToken = refreshToken // assign the token
await user.save({validateBeforeSave : false}) // save the token in the db

// cookie me refrsh and aaccess token daalo

const cookieOptions = {
    httpOnly : true,
    secure : process.env.NODE_ENV === "production"
}

res
.cookie("accessToken", accessToken , {
    ...cookieOptions, // ... -> means iss object ki saare cheezien yaha daal do
    maxAge : 15*60*1000
})
.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge : 7*24*60*60*1000
})

// response
return res.status(201).json({
    success : true,
    message : "registered successfully",
    user : safeUser,
    accessToken
})
    }

    catch (error) {
    console.log("Error:", error.message)
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
    
}

const login = async (req, res) =>{

    try {
const {email,username ,  password} = req.body;

    // validate the user
    if(!email || !password){
        return res.status(400).json({
            success : false,
            message : "Email and password are required"
        })
    }

    // find the user
    const user = await User.findOne({
         $or : [{email}, {username}]
    })

    if(!user){
    return res.status(409).json({
        success : false, 
        message : "User not found"
    })
   }

   // validate the password
   const isPasswordValid = await user.isPasswordCorrect(password);

   if(!isPasswordValid){
    return res.status(401).json({
        success : false,
        message : "Invalid credentials"
    })
   }

   // create the tokens

   const accessToken = user.generateAccessToken();
   const refreshToken = user.generateRefreshToken();
   user.refreshToken = refreshToken;
   await user.save({validateBeforeSave : false})

   // safe user
   const safeUser = await User.findById(user._id)
    .select("-password -refreshtoken")

    // cookie + response 
    const cookieOptions = {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production"
    }

    return res
    .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge : 15*60*1000
    })
    .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge : 7 * 24 * 60 * 60 * 1000
    })
    .status(200)
    .json({
        success : true,
        message : "Login successful",
        user : safeUser,
        accessToken
    })
}

catch (error ){
    console.log("Error", error.message)
    return res.status(500).json({
        success : false,
        message : error.message
    })
}
}

const logout = async (req, res) => {
    try{
        await User.findByIdAndUpdate(
            req.user._id,
            {refreshToken : ""}
        )

        // cookies clear kro

        const cookieOptions = {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production"
        }

        return res
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .status(200)
        .json({
            success : true,
            message : "logged out successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            success : false, 
            message : error.message
        })
    }
}

export {signup, login , logout} 