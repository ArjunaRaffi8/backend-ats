import { mysqlTable, mysqlEnum, int, varchar, text, timestamp } from "drizzle-orm/mysql-core";

export const POST_STATUS = ["delete", "published"] as const;

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(), // Bisa disambungkan ke tabel users jika ada
  categoryId: int("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"), // URL gambar Cloudinary
  imagePublicId: varchar("image_public_id", { length: 255 }), // Public ID Cloudinary (untuk hapus gambar)
  status: mysqlEnum("status", POST_STATUS).notNull().default("published"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});