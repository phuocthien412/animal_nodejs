var express = require("express");
var router = express.Router();
var { ObjectId } = require("mongodb");
var ListAnimalService = require('../services/ListAnimalService');

router.get("/", function (req, res) {
    res.json({ "message": "Welcome to ListAnimal API" });
});

router.get("/listanimal-list", async function (req, res) {
    var listAnimalService = new ListAnimalService();
    try {
        var listanimals = await listAnimalService.getAllListAnimal();
        res.json(listanimals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/listanimal/:id", async function (req, res) {
    var listAnimalService = new ListAnimalService();
    try {
        var id = req.params.id;
        if (ObjectId.isValid(id)) {
            id = new ObjectId(id);
        }
        var listanimal = await listAnimalService.getListAnimalById(id);
        if (!listanimal) {
            return res.status(404).json({ message: 'Cannot find listanimal' });
        }
        res.json(listanimal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/listanimal", async function (req, res) {
    var listAnimalService = new ListAnimalService();
    try {
        if (!req.body.id) {
            return res.status(400).json({ message: 'id is required' });
        }
        var result = await listAnimalService.createListAnimal(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch("/listanimal/:id", async function (req, res) {
    var listAnimalService = new ListAnimalService();
    try {
        var id = req.params.id;
        if (ObjectId.isValid(id)) {
            id = new ObjectId(id);
        }
        var result = await listAnimalService.updateListAnimal(id, req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/delete-listanimal/:id", async function (req, res) {
    var listAnimalService = new ListAnimalService();
    try {
        var id = req.params.id;
        if (ObjectId.isValid(id)) {
            id = new ObjectId(id);
        }
        var result = await listAnimalService.deleteListAnimal(id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;