import pool from "../db.js";

export async function getAllPosts(res, req, next) {
  try {
    const userId = req.user.id;
    const results = await pool.query("SELECT * FROM posts WHERE user_id = $1", [
      userId,
    ]);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function getPostById(res, req, next) {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM posts WHERE id = $1 AND user_id = $2",
      [id, userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({
      message: "post found successfully",
      post: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

export async function createPost(res, req, next) {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (title === undefined || title.trim() === "") {
      return res.status(400).json({ message: "title cannot be blank" });
    }

    if (content === undefined || content.trim() === "") {
      return res.status(400).json({ message: "content cannot be blank" });
    }

    const result = await pool.query(
      "INSERT INTO todo_list (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title.trim(), content.trim(), userId],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function updatePost(res, req, next) {
  try {
  } catch (err) {
    next(err);
  }
}

export async function deletePost(res, req, next) {
  try {
  } catch (err) {
    next(err);
  }
}
