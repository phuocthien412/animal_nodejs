const { ObjectId } = require('mongodb');

class Post {
    constructor(data = {}) {
        this._id = data._id ? new ObjectId(data._id) : new ObjectId();
        this.id_post = data.id_post || '';
        this.title = data.title || '';
        this.image = data.image || '';
        // Thay đổi userId thành user_id để tham chiếu đến _id của User
        this.user_id = data.user_id ? new ObjectId(data.user_id) : null;
        // this.approvedBy = data.approvedBy ? new ObjectId(data.approvedBy) : null;
        // this.approvedAt = data.approvedAt || null;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    
}


module.exports = Post;