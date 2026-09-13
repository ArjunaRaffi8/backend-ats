import { Router } from "express";
import CategoryController from "../../controllers/category/category.controller";

const router = Router();

router.post("/", CategoryController.createCategory);
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);
router.put("/:id", CategoryController.updateCategory);

export default router;