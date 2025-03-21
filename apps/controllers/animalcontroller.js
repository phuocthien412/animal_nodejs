const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const AnimalService = require('../services/AnimalService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadDir;
        
        // Xác định thư mục lưu trữ dựa trên loại file
        if (file.fieldname === 'avatar') {
            uploadDir = path.join(__dirname, '../../public/Animal/Avatar');
        } else if (file.fieldname === 'imgqr3d') {
            uploadDir = path.join(__dirname, '../../public/Animal/3DQR');
        } else if (file.fieldname === 'noi_sinh_song_image') {
            uploadDir = path.join(__dirname, '../../public/Animal/NoiSinhSong');
        } else {
            uploadDir = path.join(__dirname, '../../public/uploads');
        }
        
        // Đảm bảo thư mục tồn tại
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Add file extension validation
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (!extname) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

// Base route
router.get("/", function (req, res) {
    res.json({ "message": "Welcome to Animals API" });
});

// Get animal list page
router.get('/animal-list', async (req, res) => {
    try {
        const animalService = new AnimalService();
        const animals = await animalService.getAll();
        res.json(animals);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error loading animals' });
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

// Create new animal with image uploads
router.post("/animal", upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'imgqr3d', maxCount: 1 },
    { name: 'noi_sinh_song_image', maxCount: 1 }
]), async function (req, res) {
    try {
        const animalData = req.body;
        
        // Add file paths to animal data
        if (req.files) {
            if (req.files.avatar) {
                animalData.avatar = '/Animal/Avatar/' + path.basename(req.files.avatar[0].path);
            }
            if (req.files.imgqr3d) {
                animalData.imgqr3d = '/Animal/3DQR/' + path.basename(req.files.imgqr3d[0].path);
            }
            if (req.files.noi_sinh_song_image) {
                animalData.noi_sinh_song_image = '/Animal/NoiSinhSong/' + path.basename(req.files.noi_sinh_song_image[0].path);
            }
        }
        
        // Kiểm tra nếu có avatar_path trong body (trường hợp chọn ảnh có sẵn)
        if (req.body.avatar_path && !req.files.avatar) {
            animalData.avatar = req.body.avatar_path;
        }

        const animalService = new AnimalService();
        const result = await animalService.createAnimal(animalData);
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

// Update animal with file uploads
router.put("/animal/:id", upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'imgqr3d', maxCount: 1 },
    { name: 'noi_sinh_song_image', maxCount: 1 }
]), async function (req, res) {
    try {
        var id = req.params.id;
        
        // Check if id is a valid ObjectId
        if (ObjectId.isValid(id)) {
            id = new ObjectId(id);
        }
        
        const animalService = new AnimalService();
        var existingAnimal = await animalService.getById(id);
        
        if (!existingAnimal) {
            return res.status(404).json({ message: 'Cannot find animal' });
        }
        
        const animalData = req.body;
        
        // Xử lý các file được tải lên
        if (req.files) {
            if (req.files.avatar) {
                animalData.avatar = '/Animal/Avatar/' + path.basename(req.files.avatar[0].path);
            }
            if (req.files.imgqr3d) {
                animalData.imgqr3d = '/Animal/3DQR/' + path.basename(req.files.imgqr3d[0].path);
            }
            if (req.files.noi_sinh_song_image) {
                animalData.noi_sinh_song_image = '/Animal/NoiSinhSong/' + path.basename(req.files.noi_sinh_song_image[0].path);
            }
        }
        
        // Kiểm tra nếu có avatar_path trong body (trường hợp chọn ảnh có sẵn)
        if (req.body.avatar_path) {
            animalData.avatar = req.body.avatar_path;
        }
        
        // Xử lý các trường ảnh bị xóa
        if (req.body.remove_avatar === 'true') {
            animalData.avatar = null;
        }
        if (req.body.remove_imgqr3d === 'true') {
            animalData.imgqr3d = null;
        }
        if (req.body.remove_noi_sinh_song_image === 'true') {
            animalData.noi_sinh_song_image = null;
        }
        
        // Cập nhật động vật
        await animalService.updateAnimal(id, animalData);
        
        // Trả về thông tin động vật đã cập nhật
        var updatedAnimal = await animalService.getById(id);
        res.json(updatedAnimal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all animals with pagination
router.get("/animal-paginated", async function (req, res) {
    var animalService = new AnimalService();
    try {
        // Lấy tham số phân trang từ query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        // Lấy dữ liệu động vật theo trang
        const animals = await animalService.getPaginated(page, limit);
        
        // Đếm tổng số động vật
        const totalAnimals = await animalService.countAnimals();
        
        // Tính toán thông tin phân trang
        const totalPages = Math.ceil(totalAnimals / limit);
        
        // Trả về dữ liệu kèm thông tin phân trang
        res.json({
            animals: animals,
            pagination: {
                total: totalAnimals,
                totalPages: totalPages,
                currentPage: page,
                limit: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get available avatars
router.get("/available-avatars", async function (req, res) {
    try {
        const avatarDir = path.join(__dirname, '../../public/Animal/Avatar');
        
        // Đảm bảo thư mục tồn tại
        if (!fs.existsSync(avatarDir)) {
            return res.json([]);
        }
        
        // Đọc tất cả các file trong thư mục
        const files = fs.readdirSync(avatarDir);
        
        // Lọc ra chỉ các file hình ảnh
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        });
        
        // Tạo danh sách đường dẫn cho frontend
        const avatars = imageFiles.map(file => ({
            filename: file,
            path: `/Animal/Avatar/${file}`
        }));
        
        res.json(avatars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;