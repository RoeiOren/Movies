import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { wrapController } from '../../utils/wrapController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Authentication API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - username
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *         username:
 *           type: string
 *           description: The user username
 *         image:
 *            type: file
 *            description: The user profile image
 *       example:
 *         email: 'roei@gmail.com'
 *         password: '123456'
 *         username: 'roei'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *       example:
 *         email: 'roei@gmail.com'
 *         password: '123456'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tokens:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The JWT access token
 *         refreshToken:
 *           type: string
 *           description: The JWT refresh token
 *       example:
 *         accessToken: '123cd123x1xx1'
 *         refreshToken: '134r2134cr1x3c'
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The new user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: missing email, password or username
 *       409:
 *         description: email already exists or username already exists
 *       500:
 *         description: unexpected error
 */
router.post('/register', wrapController(authController.register));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: The access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       401:
 *         description: email or password is incorrect
 *       500:
 *         description: unexpected error
 */
router.post('/login', wrapController(authController.login));

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: logout a user
 *     tags: [Auth]
 *     description: need to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: logout completed successfully
 *       401:
 *         description: Invalid authorization
 *       500:
 *         description: unexpected error
 */
router.get('/logout', wrapController(authController.logout));

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: get a new access token using the refresh token
 *     tags: [Auth]
 *     description: need to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: refresh completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       401:
 *         description: Invalid authorization
 *       500:
 *         description: unexpected error
 */
router.get('/refresh', wrapController(authController.refresh));

/**
 * @swagger
 * /auth/google-login:
 *   post:
 *     summary: login a user by google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: The access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       401:
 *         description: email or password is incorrect
 */
router.post('google-login', wrapController(authController.loginWithGoogle));

export default router;
