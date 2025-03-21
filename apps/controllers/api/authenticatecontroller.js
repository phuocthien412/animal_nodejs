var express = require("express");
var router = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const jwtExpirySeconds = 300;
var config = require('./../../config/setting.json');
var verifyToken = require("./../../util/VerifyToken");

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log(`${username} is trying to login ..`);

    if (username === "admin" && password === "admin") {
        var authorities = ["admin", "customer", "editor"];
        var claims = ["animal.view", "animal.edit", "animal.delete"];
        
        const token = jsonwebtoken.sign(
            { 
                user: "admin", 
                roles: authorities, 
                claims: claims 
            }, 
            config.jwt.secret, 
            { expiresIn: jwtExpirySeconds }
        );
        
        return res.json({
            status: true,
            token: token
        });
    }

    return res.status(401).json({ 
        status: false,
        message: "Invalid username or password" 
    });
});

router.get("/test-security", verifyToken, (req, res) => {
    console.log(req.userData);
    res.json({ 
        status: true, 
        message: "Authentication successful",
        user: req.userData 
    });
});

module.exports = router;