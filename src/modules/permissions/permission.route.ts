import { Application } from "express";
import { PermissionController } from "./permission.controller";
import {
  verifyToken,
  checkPermission,
} from "../../utils/middlewares/auth.middleware";

/**
 * @swagger
 * tags:
 *   - name: Permissions
 *     description: Quản lý phân quyền Casbin (RBAC)
 */

/**
 * @swagger
 * /permissions/assign-group:
 *   post:
 *     summary: Gán quyền (Policy) cho một nhóm người dùng
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - object
 *               - action
 *             properties:
 *               subject:
 *                 type: string
 *                 description: Tên nhóm (role) trong Casbin
 *                 example: admin_full
 *               object:
 *                 type: string
 *                 description: Tài nguyên (hỗ trợ wildcard *)
 *                 example: /permissions*
 *               action:
 *                 type: string
 *                 description: Hành động (GET, POST hoặc *)
 *                 example: POST
 *     responses:
 *       200:
 *         description: Gán quyền thành công
 *       400:
 *         description: Quyền đã tồn tại
 *       403:
 *         description: Không có quyền
 */

/**
 * @swagger
 * /permissions/assign-user:
 *   post:
 *     summary: Gán người dùng vào nhóm quyền (Role Mapping)
 *     tags: [Permissions]
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
 *               - groupName
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin_root
 *               groupName:
 *                 type: string
 *                 description: Role / Group trong Casbin
 *                 example: admin_full
 *     responses:
 *       200:
 *         description: Gán user vào nhóm thành công
 *       404:
 *         description: Không tìm thấy nhóm
 */

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Lấy toàn bộ policy & grouping policy
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách quyền trong hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     policies:
 *                       type: array
 *                       items:
 *                         type: array
 *                         items:
 *                           type: string
 *                     groupingPolicies:
 *                       type: array
 *                       items:
 *                         type: array
 *                         items:
 *                           type: string
 */

export default (app: Application) => {
  app.post(
    "/permissions/assign-group",
    verifyToken,
    checkPermission,
    PermissionController.assignPermissionToGroup
  );

  app.post(
    "/permissions/assign-user",
    verifyToken,
    checkPermission,
    PermissionController.assignRoleToUser
  );

  app.get(
    "/permissions",
    verifyToken,
    checkPermission,
    PermissionController.getAllPermissions
  );
};
