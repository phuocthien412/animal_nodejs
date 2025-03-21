var express = require("express");
var router = express.Router();
var PostService = require('../services/PostService');

var postService = new PostService();

// Base route
router.get("/", function (req, res) {
    res.json({ "message": "Welcome to Posts API" });
});

// Get all posts
router.get("/post-list", async function (req, res) {
    try {
        var posts = await postService.getAllPosts();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get post by id
router.get("/post/:id", async function (req, res) {
    try {
        var post = await postService.getPostById(req.params.id);
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// // Get posts by user id
// router.get("/user-posts/:userId", async function (req, res) {
//     try {
//         var posts = await postService.getPostsByUserId(req.params.userId);
//         res.json(posts);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// Create new post
router.post("/post", async function (req, res) {
    try {
        var result = await postService.createPost(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update post
router.patch("/post/:id", async function (req, res) {
    try {
        var result = await postService.updatePost(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete post
router.delete("/post/:id", async function (req, res) {
    try {
        var result = await postService.deletePost(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// // Approve post (admin only)
// router.patch("/post/:id/approve", async function (req, res) {
//     try {
//         if (!req.body.adminId) {
//             return res.status(400).json({ message: 'Admin ID is required' });
//         }
//         var result = await postService.approvePost(req.params.id, req.body.adminId);
//         res.json(result);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// Get post with user details
// router.get("/post-user/:id/", async function (req, res) {
//     try {
//         var post = await postService.getPostsByUserId(req.params.id);
//         if (!post) {
//             return res.status(404).json({ message: 'Cannot find post' });
//         }
//         res.json(post);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

module.exports = router;