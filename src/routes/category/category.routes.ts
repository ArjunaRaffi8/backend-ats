import { Router } from "express";
import CategoryController from "../../controllers/category/category.controller";

const router = Router();

router.post("/", CategoryController.createCategory);

export default router;