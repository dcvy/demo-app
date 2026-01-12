import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service";
import path from "path";

export class CategoryController {
  static renderCategoryPage(req: Request, res: Response) {
    res.sendFile(path.join(process.cwd(), "/src/public/pages/category.html"));
  }
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CategoryService.getAll();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CategoryService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Thiếu ID danh mục" });
      }

      const data = await CategoryService.update(id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Thiếu ID danh mục" });
      }

      const data = await CategoryService.delete(id);
      res.json({ success: true, message: "Xóa danh mục thành công" });
    } catch (error) {
      next(error);
    }
  }
}
