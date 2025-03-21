const { ObjectId } = require('mongodb');

class Comment {
    constructor(data) {
        if (!data) data = {};
        this._id = data._id ? new ObjectId(data._id) : new ObjectId();
        this.id_cmt = data.id_cmt || '';
        this.chat_data = data.chat_data || '';
        this.date_time = data.date_time || new Date().toISOString();
        this.post_id = data.post_id || '';
        // this.user_id = data.user_id ? new ObjectId(data.user_id) : null;
    }
}

module.exports = Comment;