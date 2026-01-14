import { Application } from "express";
import {
  checkPermission,
  verifyToken,
} from "../../utils/middlewares/auth.middleware";
import {
  createUserAction,
  deleteUserAction,
  getUserByIdAction,
  getUsersAction,
  updateUserAction,
} from "./user.controller";

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Quản lý người dùng
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách người dùng
 *       403:
 *         description: Không có quyền truy cập
 *
 *   post:
 *     summary: Tạo người dùng mới
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       201:
 *         description: Tạo người dùng thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *
 * /users/{id}:
 *   get:
 *     summary: Lấy chi tiết người dùng
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 65f12a9c1b2c3d4e5f678901
 *     responses:
 *       200:
 *         description: Lấy chi tiết thành công
 *       404:
 *         description: Không tìm thấy người dùng
 *
 *   put:
 *     summary: Cập nhật người dùng
 *     tags:
 *       - Users
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
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *
 *   delete:
 *     summary: Xóa người dùng
 *     tags:
 *       - Users
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
 *         description: Xóa thành công
 *       403:
 *         description: Không có quyền
 */

export default (app: Application): void => {
  app.get("/users", verifyToken, checkPermission, getUsersAction);
  app.get("/users/:id", verifyToken, checkPermission, getUserByIdAction);
  app.post("/users", verifyToken, checkPermission, createUserAction);
  app.put("/users/:id", verifyToken, checkPermission, updateUserAction);
  app.delete("/users/:id", verifyToken, checkPermission, deleteUserAction);
};
