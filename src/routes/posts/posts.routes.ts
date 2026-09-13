import { Router } from "express";
import PostController from "../../controllers/posts/posts.controller";
import { uploadSingleImage } from "../../middleware/upload.middleware";

const router = Router();

router.post("/posts", uploadSingleImage, PostController.createPost);
router.get("/posts", PostController.getAllPosts);
router.get("/posts/:id", PostController.getPostById);
router.put("/posts/:id", uploadSingleImage, PostController.updatePost);
router.delete("/posts/:id", PostController.deletePost);

export default router;