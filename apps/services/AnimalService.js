const { ObjectId } = require("mongodb");
const config = require("../config/setting.json");

class AnimalService {
    constructor() {
        this.databaseconnection = require("../database/database");
        this.client = this.databaseconnection.getMongoClient();
        this.animalDatabase = this.client.db(config.mongodb.database);
        //để kết nối với database
        this.animalcollection = this.animalDatabase.collection("animals");
    }

    async getAll() {
        try {
            const cursor = this.animalcollection.find().limit(100);
            return await cursor.toArray();
        } catch (error) {
            throw new Error("Lỗi khi lấy danh sách động vật: " + error.message);
        }
    }

    //  Tìm động vật theo _id hoặc id_animal
    async getById(id) {
        try {
            let filter = { id_animal: id };

            if (ObjectId.isValid(id)) {
                filter = { $or: [{ _id: new ObjectId(id) }, { id_animal: id }] };
            }

            return await this.animalcollection.findOne(filter);
        } catch (error) {
            throw new Error("Lỗi khi lấy động vật theo ID: " + error.message);
        }
    }

    //  Thêm mới động vật (dùng id_animal là String)
    async createAnimal(animalData) {
        try {
            if (!animalData.id_animal) {
                throw new Error("id_animal là bắt buộc.");
            }
            
            // Kiểm tra trùng lặp id_animal
            const existingAnimal = await this.animalcollection.findOne({ id_animal: animalData.id_animal });
            if (existingAnimal) {
                throw new Error("id_animal đã tồn tại. Vui lòng chọn id khác.");
            }

            var result = await this.animalcollection.insertOne(animalData);
            return { ...animalData, _id: result.insertedId };
        } catch (error) {
            throw new Error("Lỗi khi tạo động vật: " + error.message);
        }
    }

    //  Cập nhật thông tin động vật (dùng id_animal là string)
    async updateAnimal(id, animalData) {
        try {
            let filter = { id_animal: id };

            if (ObjectId.isValid(id)) {
                filter = { $or: [{ _id: new ObjectId(id) }, { id_animal: id }] };
            }

            const result = await this.animalcollection.updateOne(filter, { $set: animalData });
            if (result.matchedCount === 0) {
                throw new Error("Không tìm thấy động vật để cập nhật.");
            }

            return result;
        } catch (error) {
            throw new Error("Lỗi khi cập nhật động vật: " + error.message);
        }
    }

    //  Xóa động vật theo id hoặc id_animal (có check ObjectId)
    async deleteAnimal(id) {
        try {
            let filter = { id_animal: id };

            if (ObjectId.isValid(id)) {
                filter = { $or: [{ _id: new ObjectId(id) }, { id_animal: id }] };
            }

            const result = await this.animalcollection.deleteOne(filter);
            if (result.deletedCount === 0) {
                throw new Error("Không tìm thấy động vật để xóa.");
            }

            return { message: "Xóa thành công" };
        } catch (error) {
            throw new Error("Lỗi khi xóa động vật: " + error.message);
        }
    }
}

module.exports = AnimalService;
