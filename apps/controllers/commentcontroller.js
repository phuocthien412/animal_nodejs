var express = require("express");
var router = express.Router();
var CommentService = require('../services/CommentService');

var commentService = new CommentService();

// Base route
router.get("/", function (req, res) {
    res.json({ "message": "Welcome to Comments API" });
});

// Get all comments
router.get("/comment-list", async function (req, res) {
    try {
        var comments = await commentService.getAll();
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get comment by id
router.get("/comment/:id", async function (req, res) {
    try {
        var comment = await commentService.getById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Không tìm thấy bình luận' });
        }
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get comments by user id
router.get("/user-comments/:userId", async function (req, res) {
    try {
        var comments = await commentService.getCommentsByUserId(req.params.userId);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get comments by post id
router.get("/post-comments/:postId", async function (req, res) {
    try {
        var comments = await commentService.getCommentsByPostId(req.params.postId);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get comments by user and post
router.get("/comments/:userId/:postId", async function (req, res) {
    try {
        var comments = await commentService.getCommentsByUserAndPost(
            req.params.userId, 
            req.params.postId
        );
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new comment
router.post("/comment", async function (req, res) {
    try {
        if (!req.body.id_cmt) {
            return res.status(400).json({ message: 'id_comment là bắt buộc' });
        }
        var result = await commentService.createComment(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update comment
router.patch("/comment/:id", async function (req, res) {
    try {
        var result = await commentService.updateComment(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete comment
router.delete("/comment/:id", async function (req, res) {
    try {
        var result = await commentService.deleteComment(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;