/**
 * @swagger
 * tags:
 *   name: Blog Posts
 *   description: API for managing blog posts
 */

/**
 * @swagger
 * /blog-posts:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blog Posts]
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
 *         name: sort
 *         schema:
 *           type: string
 *           default: -createdAt
 *         description: Sort field (prefix with - for descending order)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and content
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: integer
 *         description: Filter by author ID
 *     responses:
 *       200:
 *         description: A list of blog posts
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
 *                     posts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/BlogPost'
 *                     totalCount:
 *                       type: integer
 *                       example: 30
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blog Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Blog post title
 *                 example: "Growing Sunflowers: Tips and Tricks"
 *               slug:
 *                 type: string
 *                 description: Blog post URL slug
 *                 example: "growing-sunflowers-tips-and-tricks"
 *               excerpt:
 *                 type: string
 *                 description: Short excerpt or summary
 *                 example: "Learn how to grow beautiful sunflowers in your garden"
 *               content:
 *                 type: string
 *                 description: Full blog post content
 *                 example: "Sunflowers are one of the most recognizable and beloved flowers in the garden..."
 *               image:
 *                 type: string
 *                 description: Blog post main image URL
 *                 example: "/images/blog/growing-sunflowers.jpg"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Blog post tags
 *                 example: ["sunflowers", "gardening tips", "flowers"]
 *     responses:
 *       201:
 *         description: Blog post created successfully
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
 *                     post:
 *                       $ref: '#/components/schemas/BlogPost'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       409:
 *         description: Blog post with this slug already exists
 *       500:
 *         description: Server error
 *
 * /blog-posts/{id}:
 *   get:
 *     summary: Get blog post by ID
 *     tags: [Blog Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post details
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
 *                     post:
 *                       $ref: '#/components/schemas/BlogPost'
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update a blog post
 *     tags: [Blog Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Blog post title
 *                 example: "Growing Sunflowers: Tips and Tricks"
 *               slug:
 *                 type: string
 *                 description: Blog post URL slug
 *                 example: "growing-sunflowers-tips-and-tricks"
 *               excerpt:
 *                 type: string
 *                 description: Short excerpt or summary
 *                 example: "Learn how to grow beautiful sunflowers in your garden"
 *               content:
 *                 type: string
 *                 description: Full blog post content
 *                 example: "Sunflowers are one of the most recognizable and beloved flowers in the garden..."
 *               image:
 *                 type: string
 *                 description: Blog post main image URL
 *                 example: "/images/blog/growing-sunflowers.jpg"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Blog post tags
 *                 example: ["sunflowers", "gardening tips", "flowers"]
 *     responses:
 *       200:
 *         description: Blog post updated successfully
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
 *                     post:
 *                       $ref: '#/components/schemas/BlogPost'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or post author only
 *       404:
 *         description: Blog post not found
 *       409:
 *         description: Blog post with this slug already exists
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Blog Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
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
 *                   example: Blog post deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or post author only
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 *
 * /blog-posts/slug/{slug}:
 *   get:
 *     summary: Get blog post by slug
 *     tags: [Blog Posts]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post slug
 *     responses:
 *       200:
 *         description: Blog post details
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
 *                     post:
 *                       $ref: '#/components/schemas/BlogPost'
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 *
 * /blog-posts/tags:
 *   get:
 *     summary: Get all blog post tags
 *     tags: [Blog Posts]
 *     responses:
 *       200:
 *         description: List of all unique tags used in blog posts
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
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["sunflowers", "gardening tips", "flowers", "vegetables", "herbs"]
 *       500:
 *         description: Server error
 */