import { Router } from "express";
import PostController from "../../controllers/posts/posts.controller";
import { uploadSingleImage } from "../../middleware/upload.middleware";

const router = Router();

router.post("/", uploadSingleImage, PostController.createPost);
router.get("/", PostController.getAllPosts);
router.get("/:id", PostController.getPostById);
router.put("/:id", uploadSingleImage, PostController.updatePost);

export default router;