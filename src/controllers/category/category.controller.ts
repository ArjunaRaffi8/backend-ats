import { Request, Response } from "express";
import { db } from "../../config/db";
import { categoriesTable } from "../../config/schema";
import { eq } from "drizzle-orm";

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

            const result = await db
                .insert(categoriesTable)
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
                .from(categoriesTable);

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
}

export default new CategoryController();