import mongoose from "mongoose"

const recipeSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true, "Title is required"]
    },
    description : {
    type : String,
    },
    ingredients : [String],
    instructions : [String],
    cuisine : {
        type : String,
        required : [true, "Cuisine is required"]
    },
    mealType : {
        type : String,
        required : [true, "MealType is required"]
    },
    dietaryTags : [String],
    image : {
        type : String,
        default : ""
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    ratings : {
        average : {type : Number, default : 0},
        count : {type : Number, default : 0}
    },
    comments : [
        {
            text : {type : String, required : true},
            user : {type : mongoose.Schema.Types.ObjectId, ref : "User"}
        }
    ]
},
{timestamps : true}
)

export default mongoose.model("Recipe", recipeSchema)