var express = require("express");
var router = express.Router();
var { ObjectId } = require("mongodb");
var AnimalService = require('../services/AnimalService');

// Base route
router.get("/", function (req, res) {
    res.json({ "message": "Welcome to Animals API" });
});

// Get all animals
router.get("/animal-list", async function (req, res) {
    var animalService = new AnimalService();
    try {
        var animals = await animalService.getAll();
        res.json(animals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get animal by id
router.get("/animal/:id", async function (req, res) {
    var animalService = new AnimalService();
    try {
        var id = req.params.id;
        // Check if id is a valid ObjectId
        if (ObjectId.isValid(id)) {
            id = new ObjectId(id);
        }
        var animal = await animalService.getById(id);
        if (!animal) {
            return res.status(404).json({ message: 'Cannot find animal' });
        }
        res.json(animal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new animal
router.post("/animal", async function (req, res) {
    var animalService = new AnimalService();
    try {
        if (!req.body.id_animal) {
            return res.status(400).json({ message: 'id_animal is required' });
        }
        var result = await animalService.createAnimal(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update animal
router.patch("/animal/:id", async function (req, res) {
    var animalService = new AnimalService();
    try {
        var id = req.params.id;
        // Check if id is a valid ObjectId
        if (ObjectId.isValid(id)) {
            id = new ObjectId(id);
        }
        var result = await animalService.updateAnimal(id, req.body);
        if (!result.modifiedCount) {
            return res.status(404).json({ message: 'Cannot find animal' });
        }
        var updatedAnimal = await animalService.getById(id);
        res.json(updatedAnimal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete animal
router.delete("/animal/:id", async function (req, res) {
    var animalService = new AnimalService();
    try {
        var id = req.params.id;
        // Check if id is a valid ObjectId
        if (ObjectId.isValid(id)) {
            id = new ObjectId(id);
        }
        var animal = await animalService.getById(id);
        if (!animal) {
            return res.status(404).json({ message: 'Cannot find animal' });
        }
        await animalService.deleteAnimal(id);
        res.json({ message: 'Deleted animal', deletedAnimal: animal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;