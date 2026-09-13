import express from "express";
import cors from "cors";
import postRouter from "./routes/posts/posts.routes";
import categoryRouter from "./routes/category/category.routes";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/category", categoryRouter);

app.get("/", (req, res) => {
    res.send("Hello Express + TypeScript!");
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});