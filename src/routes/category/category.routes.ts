import { Router } from "express";
import CategoryController from "../../controllers/category/category.controller";

const router = Router();

router.post("/category", CategoryController.createCategory);
router.get("/category", CategoryController.getAllCategories);
router.get("/category/:id", CategoryController.getCategoryById);
router.put("/category/:id", CategoryController.updateCategory);
router.delete("/category/:id", CategoryController.deleteCategory);

export default router;