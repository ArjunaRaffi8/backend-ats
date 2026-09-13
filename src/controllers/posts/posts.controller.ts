import { Request, Response } from "express";
import { db } from "../../config/db";
import { postsTable } from "../../config/schema";
import { eq, and } from "drizzle-orm";
import { uploadToCloudinary, deleteFromCloudinary } from "../../services/claundinary.service";

class PostController {

    createPost = async (req: Request, res: Response) => {
        try {
            const { categoryId, title, content } = req.body;

        if (!categoryId || !title || !content) {
            return res.status(400).json({
                success: false,
                message: "Category, title, dan content wajib diisi",
            });
        }
        
        let imageUrl: string | null = null;
        let imagePublicId: string | null = null;
        
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
        
            imageUrl = result.secure_url;
            imagePublicId = result.public_id;
        }
        
        await db.insert(postsTable).values({
            categoryId,
            title,
            content,
            imageUrl,
            imagePublicId,
        });

            return res.status(201).json({
                success: true,
                message: "Post created successfully",
            });

        } catch (error: any) {
            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    };


    getAllPosts = async (req: Request, res: Response) => {
    try {
        const categoryId = req.query.categoryId
            ? Number(req.query.categoryId)
            : null;

        if (categoryId !== null && isNaN(categoryId)) {
            return res.status(400).json({
                success: false,
                message: "categoryId harus berupa angka",
            });
        }

        let posts;

        if (categoryId !== null) {
            posts = await db
                .select()
                .from(postsTable)
                .where(
                    and(
                        eq(postsTable.status, "published"),
                        eq(postsTable.categoryId, categoryId)
                    )
                );
        } else {
            posts = await db
                .select()
                .from(postsTable)
                .where(eq(postsTable.status, "published"));
        }

        return res.status(200).json({
            success: true,
            message: "Posts retrieved successfully",
            data: posts,
        });

    } catch (error: any) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

}

export default new PostController();