import { Request, Response, NextFunction } from "express";
import { PostService } from "./post.service";
import { Category } from "../categories/category.collection";
import path from "path";

export class PostController {
  static renderPostPage(req: Request, res: Response) {
    res.sendFile(path.join(process.cwd(), "/src/public/pages/post.html"));
  }
  static async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PostService.getAllPosts();
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Thiếu ID bài viết" });
      }
      const data = await PostService.getPostById(id);

      if (!data) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy bài viết" });
      }

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;

      const { title, content, category: categoryName } = req.body;

      if (!title || !content || !categoryName) {
        return res
          .status(400)
          .json({ message: "Thiếu title, content hoặc category" });
      }

      let category = await Category.findOne({ name: categoryName });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: `Danh mục '${categoryName}' không tồn tại. Vui lòng kiểm tra lại.`,
        });
      }

      const postData = {
        title,
        content,
        author: userId,
        category: category._id,
      };

      const data = await PostService.createPost(postData);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: any, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const post = await PostService.getPostById(id);
      if (!post) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy bài viết" });
      }

      if (post.author.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền sửa bài viết này",
        });
      }

      let updateData = { ...req.body };

      if (updateData.category && typeof updateData.category === "string") {
        let categoryDoc = await Category.findOne({
          name: updateData.category.trim(),
        });
        if (!categoryDoc) {
          categoryDoc = await Category.create({
            name: updateData.category.trim(),
          });
        }
        updateData.category = categoryDoc._id;
      }

      delete updateData.author;

      const data = await PostService.updatePost(id, updateData);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: any, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const post = await PostService.getPostById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy bài viết",
        });
      }

      if (post.author.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền xóa bài viết này",
        });
      }

      await PostService.deletePost(id);
      res.json({ success: true, message: "Xóa bài viết thành công" });
    } catch (error) {
      next(error);
    }
  }
}
