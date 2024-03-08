import { wrapController } from './../../utils/wrapController';
import { Router } from 'express';
import * as postController from '../controllers/post.controller';
import authMiddleware from '../../common/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Posts API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *         - user
 *         - date
 *       properties:
 *         content:
 *           type: string
 *           description: The comment content
 *         user:
 *            $ref: '#/components/schemas/User'
 *         date:
 *          type: date
 *          description: The comment date
 *       example:
 *         content: 'Loved this movie too!'
 *         user:
 *           email: 'roei@gmail.com'
 *           password: '123456'
 *           username: 'roei'
 *         date: '2021-08-01T12:00:00Z'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - user
 *         - movieName
 *         - content
 *         - imageName
 *         - comments
 *         - imdbId
 *         - imdbRating
 *         - date
 *       properties:
 *         user:
 *            $ref: '#/components/schemas/User'
 *         content:
 *           type: string
 *           description: The post content
 *         movieName:
 *           type: string
 *           description: The post movie name
 *         imageName:
 *           type: string
 *           description: The post image name
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: The comments of the post
 *         imdbId:
 *           type: string
 *           description: The imdb id of the movie
 *         imdbRating:
 *           type: number
 *           description: The imdb rating of the movie
 *         date:
 *           type: date
 *           description: The post date
 *       example:
 *         user:
 *           email: 'roei@gmail.com'
 *           password: '123456'
 *           username: 'roei'
 *         content: 'Loved this movie!'
 *         movieName: 'Inception'
 *         imageName: 'inception.jpg'
 *         comments: []
 *         imdbId: 'tt1375666'
 *         imdbRating: 8.8
 *         date: '2021-08-01T12:00:00Z'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePost:
 *       type: object
 *       required:
 *         - movieName
 *         - content
 *         - imdbId
 *         - image
 *       properties:
 *         content:
 *           type: string
 *           description: The post content
 *         movieName:
 *           type: string
 *           description: The post movie name
 *         imdbId:
 *           type: string
 *           description: The imdb id of the movie
 *         image:
 *           type: file
 *           description: The post image
 *       example:
 *         movieName: 'Inception'
 *         content: 'Loved this movie!'
 *         imdbId: 'tt1375666'
 */

/**
 * @swagger
 * /posts?page={page}&limit={limit}:
 *   get:
 *     summary: get list of posts by pagination
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The number of the page
 *         required: true
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: true
 *         description: The number of posts per page
 *     responses:
 *       200:
 *         description: list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Unexpected error
 */
router.get('/', wrapController(postController.get));

/**
 * @swagger
 * /posts/my:
 *   get:
 *     summary: get posts uploaded by me
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: list of posts with the user id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Post'
 *       401:
 *         description: A token was not provided or is invalid
 *       500:
 *         description: Unexpected error
 */
router.get('/my', authMiddleware, wrapController(postController.getMyPosts));

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: get a post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: the id of the post
 *     responses:
 *       200:
 *         description: the post with the id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Unexpected error
 */
router.get('/:id', wrapController(postController.getById));

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: create post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePost'
 *     responses:
 *        200:
 *          description: the created post
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Post'
 *        500:
 *          description: Error while trying to create new post
 */
router.post('/', authMiddleware, wrapController(postController.create));

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: update post's content
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the post to update
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The post content
 *     responses:
 *        200:
 *          description: the updated post
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Post'
 *        500:
 *          description: Error while trying to create new post
 */
router.patch('/:id', authMiddleware, wrapController(postController.updateById));

/**
 * @swagger
 * /posts/{postId}/comment:
 *   put:
 *     summary: add comment to a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: post id to add comment to
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The post content
 *     responses:
 *        200:
 *          description: New comment was added
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  allOf:
 *                    - $ref: '#/components/schemas/Comment'
 *        409:
 *          description: Error while trying to add comment to a post
 */
router.put('/:id/comment', authMiddleware, wrapController(postController.addComment));

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: delete post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id of the post to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the deleted post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       409:
 *         description: Error while trying to delete post
 */
router.delete('/:id', authMiddleware, wrapController(postController.deleteById));

export default router;
