/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing product comments and reviews
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments (admin only)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *         description: Filter by product ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by minimum rating
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     comments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Comment'
 *                     totalCount:
 *                       type: integer
 *                       example: 48
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - rating
 *               - content
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: ID of the product being reviewed
 *                 example: 5
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Product rating (1-5 stars)
 *                 example: 5
 *               content:
 *                 type: string
 *                 description: Comment text content
 *                 example: "These seeds germinated quickly and the sunflowers are growing beautifully!"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     comment:
 *                       $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       409:
 *         description: User has already reviewed this product
 *       500:
 *         description: Server error
 *
 * /comments/{id}:
 *   get:
 *     summary: Get comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     comment:
 *                       $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Product rating (1-5 stars)
 *                 example: 5
 *               content:
 *                 type: string
 *                 description: Comment text content
 *                 example: "These seeds germinated quickly and the sunflowers are growing beautifully!"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     comment:
 *                       $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or comment owner only
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or comment owner only
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 *
 * /comments/product/{productId}:
 *   get:
 *     summary: Get comments by product ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: -createdAt
 *         description: Sort field (prefix with - for descending order)
 *     responses:
 *       200:
 *         description: List of comments for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     comments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Comment'
 *                     totalCount:
 *                       type: integer
 *                       example: 12
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *
 * /comments/user/{userId}:
 *   get:
 *     summary: Get comments by user ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of comments by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     comments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Comment'
 *                     totalCount:
 *                       type: integer
 *                       example: 8
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or own user only
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */