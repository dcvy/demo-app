import { validationResult } from "express-validator";
import path from "path";
import { httpResponse } from "../../utils/httpResponse.core";
import { Category } from "../categories/category.collection";
import { ClothesSpace } from "./clothes.interface";
import { ClothesService } from "./clothes.service";

export const renderClothesPageAction: ClothesSpace.GetAllController = async (
  req,
  res
) => {
  res.sendFile(path.join(process.cwd(), "/src/public/pages/clothes.html"));
};

export const getAllClothesAction: ClothesSpace.GetAllController = async (
  req,
  res,
  next
) => {
  try {
    const data = await ClothesService.getAll();
    httpResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

export const getClothesByIdAction: ClothesSpace.GetByIdController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const data = await ClothesService.getById(id);

    if (!data) return httpResponse.notFound(res, "Không tìm thấy sản phẩm");

    httpResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

export const createClothesAction: ClothesSpace.CreateController = async (
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

    const { category: categoryId } = req.body;

    const categoryDoc = await Category.findById(categoryId);
    if (!categoryDoc) {
      return httpResponse.notFound(res, "Danh mục không tồn tại");
    }

    const data = await ClothesService.create(req.body);
    httpResponse.created(res, data, "Thêm sản phẩm thành công");
  } catch (error) {
    next(error);
  }
};

export const updateClothesAction: ClothesSpace.UpdateController = async (
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

    if (req.body.category) {
      const categoryDoc = await Category.findById(req.body.category);
      if (!categoryDoc)
        return httpResponse.notFound(res, "Danh mục mới không tồn tại");
    }

    const updatedData = await ClothesService.update(id, req.body);
    if (!updatedData)
      return httpResponse.notFound(res, "Không tìm thấy sản phẩm để cập nhật");

    httpResponse.success(res, updatedData, "Cập nhật sản phẩm thành công");
  } catch (error) {
    next(error);
  }
};

export const deleteClothesAction: ClothesSpace.DeleteController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const deleted = await ClothesService.delete(id);

    if (!deleted)
      return httpResponse.notFound(res, "Không tìm thấy sản phẩm để xóa");

    httpResponse.success(res, null, "Xóa sản phẩm thành công");
  } catch (error) {
    next(error);
  }
};
