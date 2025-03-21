const { ObjectId } = require("mongodb");
const config = require("../config/setting.json");
const Post = require("../enitity/post");

class PostService {
    constructor() {
        this.databaseconnection = require("../database/database");
        this.client = this.databaseconnection.getMongoClient();
        this.postDatabase = this.client.db(config.mongodb.database);
        this.postCollection = this.postDatabase.collection("posts");
    }

    async getAllPosts() {
        try {
            const cursor = this.postCollection.find();
            return await cursor.toArray();
        } catch (error) {
            throw new Error("Lỗi khi lấy danh sách bài viết: " + error.message);
        }
    }

    async getPostById(id) {
        try {
            let filter = { id_post: id };
            if (ObjectId.isValid(id)) {
                filter = { $or: [{ _id: new ObjectId(id) }, { id_post: id }] };
            }
            return await this.postCollection.findOne(filter);
        } catch (error) {
            throw new Error("Lỗi khi lấy bài viết: " + error.message);
        }
    }

    // async getPostsByUserId(userId) {
    //     try {
    //         if (!userId) {
    //             throw new Error("user_id là bắt buộc");
    //         }
    
    //         let filter = { user_id: userId };
    //         if (ObjectId.isValid(userId)) {
    //             filter = { user_id: new ObjectId(userId) };
    //         }
    
    //         const posts = await this.postCollection.find(filter).toArray();
    //         if (!posts || posts.length === 0) {
    //             return [];
    //         }
            
    //         return posts;
    //     } catch (error) {
    //         throw new Error("Lỗi khi lấy bài viết của người dùng: " + error.message);
    //     }
    // }

    async createPost(postData) {
        try {
            if (postData.id_post) {
                const existingPost = await this.postCollection.findOne({ id_post: postData.id_post });
                if (existingPost) {
                    throw new Error("id_post đã tồn tại");
                }
            }
            const post = new Post(postData);
            const result = await this.postCollection.insertOne(post);
            return { ...post, _id: result.insertedId };
        } catch (error) {
            throw new Error("Lỗi khi tạo bài viết: " + error.message);
        }
    }

    async updatePost(id, postData) {
        try {
            let filter = { id_post: id };
            if (ObjectId.isValid(id)) {
                filter = { $or: [{ _id: new ObjectId(id) }, { id_post: id }] };
            }
            const result = await this.postCollection.updateOne(
                filter,
                { $set: postData }
            );
            if (result.matchedCount === 0) {
                throw new Error("Không tìm thấy bài viết để cập nhật");
            }
            return await this.getPostById(id);
        } catch (error) {
            throw new Error("Lỗi khi cập nhật bài viết: " + error.message);
        }
    }

    async deletePost(id) {
        try {
            let filter = { id_post: id };
            if (ObjectId.isValid(id)) {
                filter = { $or: [{ _id: new ObjectId(id) }, { id_post: id }] };
            }
            const result = await this.postCollection.deleteOne(filter);
            if (result.deletedCount === 0) {
                throw new Error("Không tìm thấy bài viết để xóa");
            }
            return { message: "Xóa bài viết thành công" };
        } catch (error) {
            throw new Error("Lỗi khi xóa bài viết: " + error.message);
        }
    }


}

module.exports = PostService;