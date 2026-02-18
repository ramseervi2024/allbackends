const express = require('express');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// --- Swagger Configuration ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Blog API',
            version: '1.0.0',
            description: 'A simple CRUD API for Blog posts using Node.js, Express, and MongoDB',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Local server',
            },
        ],
    },
    apis: ['./index.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the blog
 *         title:
 *           type: string
 *           description: The title of your blog
 *         content:
 *           type: string
 *           description: The content of your blog
 *         author:
 *           type: string
 *           description: The author of the blog
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the blog was added
 *       example:
 *         _id: 64f7a1b2c3d4e5f6a7b8c9d0
 *         title: My First Blog
 *         content: This is a great content
 *         author: Jane Doe
 *         createdAt: 2023-09-05T14:30:00.000Z
 */

// Blog Schema & Model
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);

// --- Routes ---

/**
 * @openapi
 * /:
 *   get:
 *     summary: Returns the welcome message
 *     responses:
 *       200:
 *         description: Welcome message
 */
app.get('/', (req, res) => {
    res.json({ message: 'BLOG API HOME PAGE' });
});

/**
 * @openapi
 * /blogs:
 *   post:
 *     summary: Create a new blog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       201:
 *         description: The blog was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
app.post('/blogs', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        if (!title || !content || !author) {
            return res.status(400).json({ message: 'Title, content, and author are required' });
        }
        const newBlog = new Blog({ title, content, author });
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @openapi
 * /blogs:
 *   get:
 *     summary: Returns the list of all the blogs
 *     responses:
 *       200:
 *         description: The list of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Server error
 */
app.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @openapi
 * /blogs/{id}:
 *   get:
 *     summary: Get the blog by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog id
 *     responses:
 *       200:
 *         description: The blog description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: The blog was not found
 *       500:
 *         description: Server error
 */
app.get('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @openapi
 * /blogs/{id}:
 *   put:
 *     summary: Update the blog by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       200:
 *         description: The blog was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: The blog was not found
 *       500:
 *         description: Server error
 */
app.put('/blogs/:id', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, content, author },
            { new: true, runValidators: true }
        );
        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @openapi
 * /blogs/{id}:
 *   delete:
 *     summary: Delete the blog by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog id
 *     responses:
 *       200:
 *         description: The blog was deleted successfully
 *       404:
 *         description: The blog was not found
 *       500:
 *         description: Server error
 */
app.delete('/blogs/:id', async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- MongoDB Connection & Server Start ---
const startServer = async () => {
    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ Connected to MongoDB');

        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
            console.log(`📑 Swagger docs available at http://localhost:${port}/api-docs`);
        });
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        console.error('👉 Please make sure your IP is whitelisted in MongoDB Atlas.');
        process.exit(1);
    }
};

startServer();
