import { validationResult } from "express-validator";
import path from "path";
import { httpResponse } from "../../utils/httpResponse.core";
import { CategorySpace } from "./category.interface";
import { CategoryService } from "./category.service";

export const renderCategoryPageAction: CategorySpace.GetAllController = async (
  req,
  res
) => {
  res.sendFile(path.join(process.cwd(), "/src/public/pages/category.html"));
};

export const getAllCategoriesAction: CategorySpace.GetAllController = async (
  req,
  res,
  next
) => {
  try {
    const data = await CategoryService.getAll();
    httpResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

export const getCategoryByIdAction: CategorySpace.GetByIdController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const category = await CategoryService.getById(id);

    if (!category) return httpResponse.notFound(res, "Không tìm thấy danh mục");

    httpResponse.success(res, category);
  } catch (error) {
    next(error);
  }
};

export const createCategoryAction: CategorySpace.CreateController = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return httpResponse.badRequest(
        res,
        "Dữ liệu không hợp lệ",
        errors.array()
      );
    }

    const data = await CategoryService.create(req.body);
    httpResponse.created(res, data, "Tạo danh mục thành công");
  } catch (error: any) {
    if (error?.name === "MongoServerError" && error?.code === 11000) {
      return httpResponse.badRequest(res, "Tên danh mục đã tồn tại");
    }

    next(error);
  }
};

export const updateCategoryAction: CategorySpace.UpdateController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return httpResponse.badRequest(
        res,
        "Dữ liệu không hợp lệ",
        errors.array()
      );
    }

    const updatedCategory = await CategoryService.update(id, req.body);

    if (!updatedCategory) {
      return httpResponse.notFound(res, "Không tìm thấy danh mục để cập nhật");
    }

    httpResponse.success(res, updatedCategory, "Cập nhật thành công");
  } catch (error: any) {
    if (error.code === 11000) {
      return httpResponse.badRequest(res, "Tên danh mục đã tồn tại");
    }
    next(error);
  }
};

export const deleteCategoryAction: CategorySpace.DeleteController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const deletedCategory = await CategoryService.delete(id);

    if (!deletedCategory) {
      return httpResponse.notFound(res, "Không tìm thấy danh mục để xóa");
    }

    httpResponse.success(res, deletedCategory, "Xóa danh mục thành công");
  } catch (error) {
    next(error);
  }
};
