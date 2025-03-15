var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Configure middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Welcome route
app.get('/', (req, res) => {
    res.send('welcome to my API');
});

// Load controllers after database is initialized
const animalcontroller = require('./apps/controllers/animalcontroller');
const classanimalcontroller = require('./apps/controllers/classanimalcontroller');
const listanimalcontroller = require('./apps/controllers/listanimalcontroller');
const userController = require('./apps/controllers/usercontroller');
const postController = require('./apps/controllers/postcontroller');
const commentController = require('./apps/controllers/commentcontroller');

// Setup routes
app.use('/api', animalcontroller);
app.use('/api', classanimalcontroller);
app.use('/api', listanimalcontroller);
app.use('/api/users', userController);
app.use('/api/posts', postController);
app.use('/api/comments', commentController);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});