import { Router } from "express";
import {createRecipe, getAllRecipes, getRecipe,updateRecipe,deleteRecipe}
from "../controllers/recipe.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
import {upload} from "../middleware/multer.middleware.js"

const router = Router()

router.post("/", verifyJWT,upload.single("image"), createRecipe)
router.get("/", getAllRecipes)
router.get("/:id",getRecipe)
router.put("/:id", verifyJWT, updateRecipe)
router.delete("/id", verifyJWT, deleteRecipe)

export default router