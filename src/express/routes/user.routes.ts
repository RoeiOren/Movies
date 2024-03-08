import { wrapController } from './../../utils/wrapController';
import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import authMiddleware from '../../common/auth_middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users API
 */

/**
// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     User:
//  *       type: object
//  *       required:
//  *         - email
//  *         - password
//  *         - username
//  *       properties:
//  *         email:
//  *           type: string
//  *           description: The user email
//  *         password:
//  *           type: string
//  *           description: The user password
//  *         username:
//  *           type: string
//  *           description: The user username
//  *       example:
//  *         email: 'roei@gmail.com'
//  *         password: '123456'
//  *         username: 'roei'
//  */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get my user by the id from the token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unexpected error
 */
router.get('/me', authMiddleware, wrapController(userController.getMe));

/**
 * @swagger
 * /users:
 *   patch:
 *     summary: Edit my user by the id from the token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unexpected error
 */
router.patch('/', authMiddleware, wrapController(userController.update));

export default router;
