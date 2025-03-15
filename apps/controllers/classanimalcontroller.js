var express = require("express");
var router = express.Router();
var { ObjectId } = require("mongodb");
var ClassAnimalService = require('../services/ClassAnimalService');

router.get("/", function (req, res) {
    res.json({ "message": "Welcome to ClassAnimal API" });
});

router.get("/classanimal-list", async function (req, res) {
    var classAnimalService = new ClassAnimalService();
    try {
        var classanimals = await classAnimalService.getAllClassAnimal();
        res.json(classanimals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/classanimal/:id", async function (req, res) {
    var classAnimalService = new ClassAnimalService();
    try {
        var id = req.params.id;
        if (ObjectId.isValid(id)) {
            id = new ObjectId(id);
        }
        var classanimal = await classAnimalService.getClassAnimalById(id);
        if (!classanimal) {
            return res.status(404).json({ message: 'Cannot find classanimal' });
        }
        res.json(classanimal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/classanimal", async function (req, res) {
    var classAnimalService = new ClassAnimalService();
    try {
        if (!req.body.classanimals_id) {
            return res.status(400).json({ message: 'classanimals_id is required' });
        }
        var result = await classAnimalService.createClassAnimal(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch("/classanimal/:id", async function (req, res) {
    var classAnimalService = new ClassAnimalService();
    try {
        var id = req.params.id;
        if (ObjectId.isValid(id)) {
            id = new ObjectId(id);
        }
        var result = await classAnimalService.updateClassAnimal(id, req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/delete-classanimal/:id", async function (req, res) {
    var classAnimalService = new ClassAnimalService();
    await classAnimalService.deleteClassAnimal(req.params.id);
    res.json({ message: "Xóa classanimal thành công." });
});

module.exports = router;