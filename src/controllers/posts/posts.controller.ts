import { Request, Response } from "express";
import { db } from "../../config/db";
import * as schema from "../../config/schema";
import { eq, and } from "drizzle-orm";
import { uploadToCloudinary, deleteFromCloudinary } from "../../services/claundinary.service";

export class CategoryController {

    // CREATE CATEGORY
    createCategory = async (req: Request, res: Response) => {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Nama kategori wajib diisi",
                });
            }

            await db
                .insert(schema.categories)
                .values({
                    name,
                });

            return res.status(201).json({
                success: true,
                message: "Category created successfully",
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

    // GET ALL CATEGORIES
    getAllCategories = async (req: Request, res: Response) => {
        try {
            const categories = await db
                .select()
                .from(schema.categories);

            return res.status(200).json({
                success: true,
                message: "Categories retrieved successfully",
                data: categories,
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

    // GET CATEGORY BY ID
    getCategoryById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const category = await db
                .select()
                .from(schema.categories)
                .where(eq(schema.categories.id, id));

            if (category.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Category retrieved successfully",
                data: category[0],
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

    // UPDATE CATEGORY
    updateCategory = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Nama kategori wajib diisi",
                });
            }

            await db
                .update(schema.categories)
                .set({
                    name,
                    updatedAt: new Date(),
                })
                .where(eq(schema.categories.id, id));

            return res.status(200).json({
                success: true,
                message: "Category updated successfully",
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

    // DELETE CATEGORY
    deleteCategory = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            await db
                .delete(schema.categories)
                .where(eq(schema.categories.id, id));

            return res.status(200).json({
                success: true,
                message: "Category deleted successfully",
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

export class PostController {

    // CREATE POST
    createPost = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user?.id;
            const { categoryId, title, content } = req.body;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized, silakan login terlebih dahulu",
                });
            }

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

            await db.insert(schema.posts).values({
                userId,
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

    // GET ALL POSTS
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
                    .from(schema.posts)
                    .where(
                        and(
                            eq(schema.posts.status, "published"),
                            eq(schema.posts.categoryId, categoryId)
                        )
                    );
            } else {
                posts = await db
                    .select()
                    .from(schema.posts)
                    .where(eq(schema.posts.status, "published"));
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

    // GET POST BY ID
    getPostById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const post = await db
                .select()
                .from(schema.posts)
                .where(and(
                    eq(schema.posts.id, id),
                    eq(schema.posts.status, "published")
                )
            );

            if (post.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Post not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Post retrieved successfully",
                data: post[0],
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

    // UPDATE POST
    updatePost = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const { categoryId, title, content } = req.body;

            if (!categoryId || !title || !content) {
                return res.status(400).json({
                    success: false,
                    message: "Category, title, dan content wajib diisi",
                });
            }

            // Cari post lama
            const existingPost = await db
                .select()
                .from(schema.posts)
                .where(eq(schema.posts.id, id));

            if (existingPost.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Post not found",
                });
            }

            let imageUrl = existingPost[0].imageUrl;
            let imagePublicId = existingPost[0].imagePublicId;

            // Kalau user upload gambar baru
            if (req.file) {
                // Upload gambar baru ke Cloudinary
                const result = await uploadToCloudinary(req.file.buffer);

                imageUrl = result.secure_url;
                imagePublicId = result.public_id;

                // Hapus gambar lama dari Cloudinary
                if (existingPost[0].imagePublicId) {
                    await deleteFromCloudinary(existingPost[0].imagePublicId);
                }
            }

            // Update data post
            await db
                .update(schema.posts)
                .set({
                    categoryId,
                    title,
                    content,
                    imageUrl,
                    imagePublicId,
                    updatedAt: new Date(),
                })
                .where(eq(schema.posts.id, id));

            return res.status(200).json({
                success: true,
                message: "Post updated successfully",
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

    // DELETE POST (SOFT DELETE)
    deletePost = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            // Cari post yang akan dihapus
            const existingPost = await db
                .select()
                .from(schema.posts)
                .where(eq(schema.posts.id, id));

            if (existingPost.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Post not found",
                });
            }

            // Hapus gambar dari Cloudinary jika ada
            if (existingPost[0].imagePublicId) {
                await deleteFromCloudinary(existingPost[0].imagePublicId);
            }

            // Soft delete post
            await db
                .update(schema.posts)
                .set({
                    status: "delete",
                    updatedAt: new Date(),
                })
                .where(eq(schema.posts.id, id));

            return res.status(200).json({
                success: true,
                message: "Post deleted successfully",
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

export const categoryController = new CategoryController();
export const postController = new PostController();

// Digabung jadi satu object supaya bisa diakses lewat satu default import
// (sesuai pemakaian di posts.routes.ts: PostsController.createPost, PostsController.getCategories, dst)
const PostsController = {
    // Post methods
    createPost: postController.createPost,
    getAllPosts: postController.getAllPosts,
    getPostById: postController.getPostById,
    updatePost: postController.updatePost,
    deletePost: postController.deletePost,

    // Category methods
    createCategory: categoryController.createCategory,
    getCategories: categoryController.getAllCategories,
    getCategoryById: categoryController.getCategoryById,
    updateCategory: categoryController.updateCategory,
    deleteCategory: categoryController.deleteCategory,
};

export default PostsController;