import { Application } from "express";
import { UserGroupController } from "./userGroup.controller";
import {
  verifyToken,
  checkPermission,
} from "../../utils/middlewares/auth.middleware";

/**
 * @swagger
 * tags:
 * - name: UserGroups
 *   description: Quản lý nhóm người dùng (Roles) trong hệ thống
 */

/**
 * @swagger
 * /user-groups:
 *   get:
 *     summary: Lấy danh sách tất cả nhóm người dùng
 *     tags: [UserGroups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về mảng các nhóm người dùng
 *
 *   post:
 *     summary: Tạo nhóm người dùng mới
 *     tags: [UserGroups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: manager
 *               description:
 *                 type: string
 *                 example: Nhóm quản lý có quyền duyệt bài
 *     responses:
 *       201:
 *         description: Tạo nhóm thành công
 *       400:
 *         description: Tên nhóm đã tồn tại
 */

/**
 * @swagger
 * /user-groups/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết nhóm người dùng
 *     tags: [UserGroups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID của nhóm
 *     responses:
 *       200:
 *         description: Chi tiết nhóm người dùng
 *       404:
 *         description: Không tìm thấy nhóm
 *
 *   put:
 *     summary: Cập nhật nhóm người dùng
 *     tags: [UserGroups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *
 *   delete:
 *     summary: Xóa nhóm người dùng
 *     tags: [UserGroups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa nhóm thành công
 */

export default (app: Application): void => {
  app.get(
    "/user-groups",
    verifyToken,
    checkPermission,
    UserGroupController.getUserGroups
  );

  app.get(
    "/user-groups/:id",
    verifyToken,
    checkPermission,
    UserGroupController.getUserGroupById
  );

  app.post(
    "/user-groups",
    verifyToken,
    checkPermission,
    UserGroupController.create
  );

  app.put(
    "/user-groups/:id",
    verifyToken,
    checkPermission,
    UserGroupController.update
  );

  app.delete(
    "/user-groups/:id",
    verifyToken,
    checkPermission,
    UserGroupController.delete
  );
};
