import express from "express";

import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/blogController.js";

import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getAllPosts);

router.get("/:id", getPostById);

router.post("/", authenticateToken, createPost);

router.put("/:id", authenticateToken, updatePost);

router.delete("/:id", authenticateToken, deletePost);

export default router;
