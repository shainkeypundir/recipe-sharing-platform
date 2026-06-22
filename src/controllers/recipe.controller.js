import Recipe from "../models/recipe.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js"

const createRecipe = async (req , res) =>{
    try{

        console.log("Body:", req.body)
        console.log("File:", req.file) 
        // data lo
        const  {title, description,ingredients, instructions,cuisine,mealType, dietaryTags} = req.body

        // validate 
        if(!title || !ingredients || !instructions || !cuisine || !mealType){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        // imgae upload kro
        let imageurl = ""
        if(req.file){
            const uploaded = await uploadOnCloudinary(req.file.path)
            imageurl = uploaded?.url || ""
        }

        // create new recipe
        const recipe = await Recipe.create({
            title,
            ingredients,
            instructions,
            cuisine,
            mealType,
            dietaryTags,
            image : imageurl,
            createdBy : req.user._id
        })

        
        // send the response
        return res.status(201).json({
            success : true,
            message : "Recipe created successfully",
            recipe
        })

    }
    catch (error){
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

const getAllRecipes = async (req, res) =>{
    try{
        const {search, cuisine, dietaryTags} = req.query;

        const filter = {}

        if(search){
            filter.title = {$regex : search, $options : "i"}
        }

        if(cuisine){
            filter.cuisine = {$regex : cuisine, $options : "i"}
        }

        if(dietaryTags){
            filter.dietaryTags = {$in : [dietaryTags]}
        }

        const recipes = await Recipe.find(filter);

        return res.status(200).json({
            success : true,
            count : recipes.length,
            recipes
        })
    }
    catch (error){
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

const getRecipe = async (req , res) =>{
    try{
        // url se id nikalo
        const {id } = req.params
        // db me dhundo
        const recipe = await Recipe.findById(id);
        // recipe nhi mili
        if(!recipe){
            return res.status(404).json({
                success : false,
                message : "No recipe exist"
            })
        }
        // res de
        return res.status(200).json({
            success : true,
            message : "Recipe found successfully",
            recipe
        })


    }catch(error){
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

const updateRecipe = async (req, res) => {

    try{
         // get id from the res
    const {id} = req.params

    // take the data from the db
    const {title, description, ingredients, instructions, 
        cuisine, mealType, dietaryTags} = req.body

    // recipe exists ??
    const recipe = await Recipe.findById(id)

    if(!recipe){
        return res.status(404).json({
            success : false,
            message : "Recipe not found"
        })
    }

    // update the recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(
        id,
        {title, description,ingredients,instructions, cuisine, mealType,dietaryTags},
        {new : true}
    )

    // send the respone

    return res.status(200).json({
        success : true,
        message : "Recipe updated successfully",
        recipe
    })
    }
    catch (error){
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
   

}

const deleteRecipe = async (req, res) => {

    try{
const {id} = req.params

    const recipe = await Recipe.findById(id)

    if(!recipe){
         return res.status(404).json({
        success: false,
        message: "Recipe not found"
      })
    }

    // check the creator
    if(recipe.createdBy.toString() !== req.user._id.toString()){
         return res.status(403).json({
        success: false,
        message: "You can only delete your own recipes"
      })
    }
    // delete kro

    await Recipe.findByIdAndDelete(id)

     return res.status(200).json({
      success: true,
      message: "Recipe deleted successfully"
    })
    }
    catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }

}
export {createRecipe, getAllRecipes, getRecipe, updateRecipe,
    deleteRecipe
};