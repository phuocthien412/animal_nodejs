var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const path = require('path');

// Configure middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//set EJS as the view
app.set('view engine', 'ejs');
app.set('views', './apps/views');

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/Animal/Avatar', express.static(path.join(__dirname, 'public/Animal/Avatar')));
app.use('/Animal/3DQR', express.static(path.join(__dirname, 'public/Animal/3DQR')));
app.use('/Animal/NoiSinhSong', express.static(path.join(__dirname, 'public/Animal/NoiSinhSong')));
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Homepage route
app.get('/', (req, res) => {
    res.render('home/layout');
});

// Trang quản lý động vật 
app.get('/animal', (req, res) => {
    res.render('animal/animal_add');
});

// Trang chỉnh sửa động vật
app.get('/animal/edit/:id', (req, res) => {
    res.render('animal/animal_edit', { animalId: req.params.id });
});

// Trang chi tiết động vật
app.get('/animal/:id', (req, res) => {
    res.render('animal/animal', { animalId: req.params.id });
});

// Load controllers after database is initialized
const animalcontroller = require('./apps/controllers/animalcontroller');
const classanimalcontroller = require('./apps/controllers/classanimalcontroller');
const listanimalcontroller = require('./apps/controllers/listanimalcontroller');
// const userController = require('./apps/controllers/usercontroller');
const postController = require('./apps/controllers/postcontroller');
const commentController = require('./apps/controllers/commentcontroller');
app.use('/api/authenticate', require('./apps/controllers/api/authenticatecontroller'));
// Setup routes
app.use('/api', animalcontroller);
app.use('/api', classanimalcontroller);
app.use('/api', listanimalcontroller);
//app.use('/api/users', userController);
app.use('/api/posts', postController);
app.use('/uploads', express.static('public/uploads'))
app.use('/api/comments', commentController);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});