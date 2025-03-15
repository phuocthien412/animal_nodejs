const { ObjectId } = require("mongodb");
const config = require("../config/setting.json");
const User = require("../enitity/user");
const ROLES = require('../constants/roles');

class UserService {
    constructor() {
        this.databaseconnection = require("../database/database");
        this.client = this.databaseconnection.getMongoClient();
        this.userDatabase = this.client.db(config.mongodb.database);
        this.userCollection = this.userDatabase.collection("users");
    }

    async getAllUsers() {
        try {
            return await this.userCollection.find().toArray();
        } catch (error) {
            throw new Error("Lỗi khi lấy danh sách người dùng: " + error.message);
        }
    }

    async getUserById(id) {
        try {
            let filter = { $or: [{ id_user: id }] };
            if (ObjectId.isValid(id)) {
                filter.$or.push({ _id: new ObjectId(id) });
            }

            return await this.userCollection.findOne(filter);
        } catch (error) {
            throw new Error("Lỗi khi lấy thông tin người dùng: " + error.message);
        }
    }

    async createUser(userData) {
        try {
            const { id_user, username, password, role } = userData;

            if (!id_user?.trim() || !username?.trim() || !password?.trim()) {
                throw new Error("id_user, username và password là bắt buộc");
            }

            if (role && !Object.values(ROLES).includes(role)) {
                throw new Error("Role không hợp lệ");
            }

            // Kiểm tra id_user hoặc username đã tồn tại
            const existingUser = await this.userCollection.findOne({ 
                $or: [{ id_user }, { username }]
            });

            if (existingUser) {
                throw new Error("id_user hoặc username đã tồn tại");
            }

            const user = new User(userData);
            const result = await this.userCollection.insertOne(user);
            return { message: "Tạo người dùng thành công", userId: result.insertedId };
        } catch (error) {
            throw new Error("Lỗi khi tạo người dùng: " + error.message);
        }
    }

    async updateUser(id, userData) {
        try {
            let filter = { $or: [{ id_user: id }] };
            if (ObjectId.isValid(id)) {
                filter.$or.push({ _id: new ObjectId(id) });
            }

            userData.updatedAt = new Date();
            const result = await this.userCollection.updateOne(filter, { $set: userData });

            if (!result.matchedCount) {
                throw new Error("Không tìm thấy người dùng");
            }

            return { message: "Cập nhật thành công", modifiedCount: result.modifiedCount };
        } catch (error) {
            throw new Error("Lỗi khi cập nhật người dùng: " + error.message);
        }
    }

    async updateUserRole(id, newRole) {
        try {
            if (!Object.values(ROLES).includes(newRole)) {
                throw new Error("Role không hợp lệ");
            }

            let filter = { $or: [{ id_user: id }] };
            if (ObjectId.isValid(id)) {
                filter.$or.push({ _id: new ObjectId(id) });
            }

            const result = await this.userCollection.updateOne(
                filter,
                { 
                    $set: { role: newRole, updatedAt: new Date() } 
                }
            );

            if (!result.matchedCount) {
                throw new Error("Không tìm thấy người dùng");
            }

            return { message: `Vai trò đã được cập nhật thành ${newRole}` };
        } catch (error) {
            throw new Error("Lỗi khi cập nhật role: " + error.message);
        }
    }

    async deleteUser(id) {
        try {
            let filter = { $or: [{ id_user: id }] };
    
            // Kiểm tra nếu id là ObjectId hợp lệ
            if (ObjectId.isValid(id)) {
                filter.$or.push({ _id: new ObjectId(id) });
            }
    
            console.log("Filter delete:", filter); // Debug xem filter có đúng không
    
            const result = await this.userCollection.deleteOne(filter);
    
            if (result.deletedCount === 0) {
                throw new Error(`Không tìm thấy người dùng với id: ${id}`);
            }
    
            return { message: `Xóa người dùng thành công: ${id}` };
        } catch (error) {
            throw new Error("Lỗi khi xóa người dùng: " + error.message);
        }
    }
    

    async login(username, password) {
        try {
            if (!username?.trim() || !password?.trim()) {
                throw new Error("Username và password là bắt buộc");
            }

            const user = await this.userCollection.findOne({ username });
            if (!user) {
                throw new Error("Username không tồn tại");
            }

            if (user.password !== password) {
                throw new Error("Mật khẩu không đúng");
            }

            await this.userCollection.updateOne(
                { _id: user._id },
                { 
                    $set: { lastLogin: new Date(), updatedAt: new Date() } 
                }
            );

            return { 
                message: "Đăng nhập thành công",
                user: { id_user: user.id_user, username: user.username, role: user.role }
            };
        } catch (error) {
            throw new Error("Lỗi đăng nhập: " + error.message);
        }
    }
}

module.exports = UserService;
