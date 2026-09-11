import { Request, Response } from 'express';
import { db } from '../../config/db';
import * as schema from '../../config/schema';
import cloudinary from '../../config/claundinary';
import { eq } from 'drizzle-orm';

export class PostsController {
  // 1. CREATE POST
  static async createPost(req: Request, res: Response) {
    try {
      const file = (req as any).file;
      const { title, content, categoryId, userId } = req.body;
      let imageUrl = '';

      if (file) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'posts' },
            (error: any, result: any) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        imageUrl = (uploadResult as any).secure_url;
      }

      const insertResult = await db
        .insert(schema.posts)
        .values({
          userId: Number(userId) || 1,
          title,
          content,
          categoryId: Number(categoryId),
          imageUrl: imageUrl,
        })
        .$returningId();

      return res.status(201).json({
        message: 'Post berhasil dibuat',
        data: { id: insertResult[0]?.id, title, content, categoryId, imageUrl },
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // 2. GET ALL POSTS
  static async getAllPosts(req: Request, res: Response) {
    try {
      const allPosts = await db.select().from(schema.posts);
      return res.status(200).json({
        message: 'Berhasil mengambil semua post',
        data: allPosts,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // 3. GET POST BY ID
  static async getPostById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await db
        .select()
        .from(schema.posts)
        .where(eq(schema.posts.id, Number(id)));

      if (result.length === 0) {
        return res.status(404).json({ message: 'Post tidak ditemukan' });
      }

      return res.status(200).json({
        message: 'Berhasil mengambil data post',
        data: result[0],
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // 4. UPDATE POST
  static async updatePost(req: Request, res: Response) {
    try {
      const file = (req as any).file;
      const { id } = req.params;
      const { title, content, categoryId } = req.body;
      let imageUrl: string | undefined;

      const existingPost = await db
        .select()
        .from(schema.posts)
        .where(eq(schema.posts.id, Number(id)));

      if (existingPost.length === 0) {
        return res.status(404).json({ message: 'Post tidak ditemukan' });
      }

      if (file) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'posts' },
            (error: any, result: any) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        imageUrl = (uploadResult as any).secure_url;
      }

      const updateData: any = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (categoryId) updateData.categoryId = Number(categoryId);
      if (imageUrl) updateData.imageUrl = imageUrl;

      await db
        .update(schema.posts)
        .set(updateData)
        .where(eq(schema.posts.id, Number(id)));

      return res.status(200).json({
        message: 'Post berhasil diperbarui',
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // 5. DELETE POST
  static async deletePost(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const existingPost = await db
        .select()
        .from(schema.posts)
        .where(eq(schema.posts.id, Number(id)));

      if (existingPost.length === 0) {
        return res.status(404).json({ message: 'Post tidak ditemukan' });
      }

      await db.delete(schema.posts).where(eq(schema.posts.id, Number(id)));

      return res.status(200).json({
        message: 'Post berhasil dihapus',
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // 6. GET CATEGORIES
  static async getCategories(req: Request, res: Response) {
    try {
      const allCategories = await db.select().from(schema.categories);
      return res.status(200).json({
        message: 'Berhasil mengambil semua kategori',
        data: allCategories,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default PostsController;