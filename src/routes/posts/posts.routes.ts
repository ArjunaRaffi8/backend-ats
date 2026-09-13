import { Router } from "express";
import PostController from "../../controllers/posts/posts.controller";
import { uploadSingleImage } from "../../middleware/upload.middleware";

const router = Router();

router.post("/posts", uploadSingleImage, PostController.createPost);

export default router;