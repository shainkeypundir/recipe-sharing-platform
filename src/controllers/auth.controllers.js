import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

const signup = async (req , res) => {
    // daata lo
    const {username, email, password} = req.body
    // validate
    if(!username || !email || !password){
        return res.status(400).json({
            success : false,
            message : "All fields are required"
        })
    }
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

const user = await User.findById(user._id).select("-password -refreshToken")

// ab mera user bnn gaya h now , create access + refresh token

const accessToken = user.generateAccessToken();
const refreshToken = user.generateRefreshToken();

//refresh token db me save kro
user.refreshToken = refreshToken
await user.save({validateBeforeSave : false})

export {signup};