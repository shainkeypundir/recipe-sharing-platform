import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true, "User name is required"],
        unique : true,
        lowercase : true
    },
    email : { 
        type : String,
        required : [true, "email is required"],
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : [true, "password is required"],
        minlength : [6,"Min 6 characters require"]
    },
    avatar : {
        type : String,
        default : ""
    },
    refreshToken :  {
        type : String
    },
    followers : [
        {type : mongoose.Schema.Types.ObjectId, ref : "User"}
    ],
    following : [
        {type : mongoose.Schema.Types.ObjectId, ref : "User"}
    ]
},
{timestamps : true}
);

// pre - middleware used to hash the password before saving it 
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// check if the pass is correct or not
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

//generate access token
userSchema.methods.generateAccessToken = function () { 
    return jwt.sign(
        {
        _id : this._id,
        email : this.email,
        username : this.userName,
       },
       process.env.ACCESS_TOKEN_SECRET,
       {expiresIn : process.env.ACCESS_TOKEN_EXPIRY}
);
};

// generate refresh token
userSchema.methods.generateRefreshToken = function () { 
    return jwt.sign(
        {
        _id : this._id,
       },
       process.env.REFRESH_TOKEN_SECRET,
       {expiresIn : process.env.REFRESH_TOKEN_EXPIRY}
);
};

export default mongoose.model("User", userSchema);