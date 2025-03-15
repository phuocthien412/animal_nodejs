var express = require("express");
var router = express.Router();
var UserService = require('../services/UserService');
var ROLES = require('../constants/roles'); // ✅ Import ROLES

var userService = new UserService();

// Get all users
router.get("/user-list", async function (req, res) {
    try {
        var users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user by id
router.get("/user/:id", async function (req, res) {
    try {
        var user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new user
router.post("/user", async function (req, res) {
    try {
        const { id_user, username, password } = req.body;

        if (!id_user?.trim() || !username?.trim() || !password?.trim()) {
            return res.status(400).json({ 
                message: 'id_user, username và password là bắt buộc' 
            });
        }

        var result = await userService.createUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login
router.post("/login", async function (req, res) {
    try {
        const { username, password } = req.body;

        if (!username?.trim() || !password?.trim()) {
            return res.status(400).json({ 
                message: 'Username và password là bắt buộc' 
            });
        }

        var result = await userService.login(username, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

// Update user
router.patch("/user/:id", async function (req, res) {
    try {
        var result = await userService.updateUser(req.params.id, req.body);
        if (!result || !result.modifiedCount) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng hoặc không có thay đổi' });
        }
        var updatedUser = await userService.getUserById(req.params.id);
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete user
router.delete("/user/:id", async function (req, res) {
    try {
        var result = await userService.deleteUser(req.params.id);
        res.json({ message: 'Xóa người dùng thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create role
router.post("/admin", async function (req, res) {
    try {
        const adminData = {
            ...req.body,
            role: ROLES.ADMIN
        };

        const { id_user, username, password } = adminData;
        if (!id_user?.trim() || !username?.trim() || !password?.trim()) {
            return res.status(400).json({ 
                message: 'id_user, username và password là bắt buộc' 
            });
        }

        const result = await userService.createUser(adminData);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update user role
router.patch("/user/:id/role", async function (req, res) {
    try {
        const { role } = req.body;

        if (!role || !Object.values(ROLES).includes(role)) {
            return res.status(400).json({ 
                message: 'Role không hợp lệ',
                validRoles: Object.values(ROLES)
            });
        }

        const result = await userService.updateUserRole(req.params.id, role);
        if (!result.modifiedCount) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng hoặc không có thay đổi' });
        }

        res.json({ message: `Vai trò người dùng đã được cập nhật thành ${role}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
