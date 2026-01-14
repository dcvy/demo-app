import { Response } from "express";

export const httpResponse = {
  /**
   * 200 OK - Thành công
   */
  success: (res: Response, data?: any, message?: string) => {
    res.status(200).json({
      success: true,
      message: message || "Thành công",
      data: data ?? null,
    });
  },

  /**
   * 201 Created - Tạo mới thành công
   */
  created: (res: Response, data?: any, message?: string) => {
    res.status(201).json({
      success: true,
      message: message || "Tạo thành công",
      data: data ?? null,
    });
  },

  /**
   * 400 Bad Request - Dữ liệu không hợp lệ hoặc validation lỗi
   */
  badRequest: (res: Response, message?: string, errors?: any[]) => {
    res.status(400).json({
      success: false,
      message: message || "Dữ liệu không hợp lệ",
      errors: errors ?? undefined,
    });
  },

  /**
   * 401 Unauthorized - Chưa xác thực
   */
  unauthorized: (res: Response, message?: string) => {
    res.status(401).json({
      success: false,
      message: message || "Unauthorized - Vui lòng đăng nhập lại",
    });
  },

  /**
   * 403 Forbidden - Đã xác thực nhưng không có quyền truy cập
   */
  forbidden: (res: Response, message?: string) => {
    res.status(403).json({
      success: false,
      message:
        message || "Forbidden - Bạn không có quyền thực hiện hành động này",
    });
  },

  /**
   * 404 Not Found - Không tìm thấy resource
   */
  notFound: (res: Response, message?: string) => {
    res.status(404).json({
      success: false,
      message: message || "Không tìm thấy tài nguyên",
    });
  },

  /**
   * 500 Internal Server Error - Lỗi server
   */
  serverError: (res: Response, error?: any, message?: string) => {
    if (error) console.error(error);
    res.status(500).json({
      success: false,
      message: message || "Lỗi máy chủ nội bộ",
    });
  },
};
