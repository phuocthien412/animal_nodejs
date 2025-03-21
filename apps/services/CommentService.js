const { ObjectId } = require("mongodb");
const config = require("../config/setting.json");

class CommentService {
    constructor() {
        this.databaseconnection = require("../database/database");
        this.client = this.databaseconnection.getMongoClient();
        this.commentDatabase = this.client.db(config.mongodb.database);
        //để kết nối với database
        this.commentcollection = this.commentDatabase.collection("comments");
    }

    async getAll() {
        try {
            const cursor = this.commentcollection.find().limit(100);
            return await cursor.toArray();
        } catch (error) {
            throw new Error("Lỗi khi lấy danh sách bình luận: " + error.message);
        }
    }

    //  Tìm bình luận theo _id hoặc id_cmt
    async getById(id) {
        try {
            let filter = { id_cmt: id };

            if (ObjectId.isValid(id)) {
                filter = { $or: [{ _id: new ObjectId(id) }, { id_cmt: id }] };
            }

            return await this.commentcollection.findOne(filter);
        } catch (error) {
            throw new Error("Lỗi khi lấy bình luận theo ID: " + error.message);
        }
    }

    //  Thêm mới bình luận (dùng id_cmt là String)
    async createComment(commentData) {
        try {
            if (!commentData.id_cmt) {
                throw new Error("id_cmt là bắt buộc.");
            }
            
            // Kiểm tra trùng lặp id_cmt
            const existingComment = await this.commentcollection.findOne({ id_cmt: commentData.id_cmt });
            if (existingComment) {
                throw new Error("id_cmt đã tồn tại. Vui lòng chọn id khác.");
            }

            var result = await this.commentcollection.insertOne(commentData);
            return { ...commentData, _id: result.insertedId };
        } catch (error) {
            throw new Error("Lỗi khi tạo bình luận: " + error.message);
        }
    }

    //  Cập nhật thông tin bình luận (dùng id_cmt là string)
    async updateComment(id, commentData) {
        try {
            let filter = { id_cmt: id };
            if (ObjectId.isValid(id)) {
                filter = { $or: [{ _id: new ObjectId(id) }, { id_cmt: id }] };
            }
            var result = await this.commentcollection.updateOne(filter, { $set: commentData });
            if (result.matchedCount === 0) {
                throw new Error("Không tìm thấy bình luận để cập nhật.");
            }
            return { ...commentData, _id: id };
        } catch (error) {
            throw new Error("Lỗi khi cập nhật bình luận: " + error.message);
        }
    }

    //  Xóa bình luận theo _id hoặc id_cmt
    async deleteComment(id) {
        try {
            let filter = { id_cmt: id };
            if (ObjectId.isValid(id)) {
                filter = { $or: [{ _id: new ObjectId(id) }, { id_cmt: id }] };
            }
            var result = await this.commentcollection.deleteOne(filter);
            if (result.deletedCount === 0) {
                throw new Error("Không tìm thấy bình luận để xóa.");
            }
            return { message: "Xóa bình luận thành công." };
        } catch (error) {
            throw new Error("Lỗi khi xóa bình luận: " + error.message);
        }
    }

    // async getCommentsByUserId(userId) {
    //     try {
    //         const comments = await this.commentcollection
    //             .find({ user_id: userId  })
    //             .toArray();
    //         return comments;
    //     } catch (error) {
    //         throw new Error("Lỗi khi lấy bình luận theo user_id: " + error.message);
    //     }
    // }

    async getCommentsByPostId(postId) {
        try {
            const comments = await this.commentcollection
                .find({ post_id: postId })
                .toArray();
            return comments;
        } catch (error) {
            throw new Error("Lỗi khi lấy bình luận theo post_id: " + error.message);
        }
    }

    // async getCommentsByUserAndPost(userId, postId) {
    //     try {
    //         let filter = {
    //             post_id: postId,
    //             user_id: userId
    //         };

    //         if (ObjectId.isValid(userId)) {
    //             filter.user_id = new ObjectId(userId);
    //         }
            
    //         const comments = await this.commentcollection
    //             .find(filter)
    //             .toArray();
    //         return comments;
    //     } catch (error) {
    //         throw new Error("Lỗi khi lấy bình luận theo user_id và post_id: " + error.message);
    //     }
    // }

}

module.exports = CommentService;