const { ObjectId } = require("mongodb");
const config = require("../config/setting.json");

class ListAnimalService {
    client;
    listanimalDatabase;
    listanimalcollection;
    constructor(){
        this.databaseconnection = require("../database/database");
        this.client = this.databaseconnection.getMongoClient();
        this.listanimalDatabase = this.client.db(config.mongodb.database);
        this.listanimalcollection = this.listanimalDatabase.collection("listanimals");
    }
    async getAllListAnimal(){
        const cursor = this.listanimalcollection.find().limit(100);
        return await cursor.toArray();
    }
    async getListAnimalById(id){
        try {
            let filter = { id: id };
            if (ObjectId.isValid(id)) {
                filter = { $or: [{ _id: new ObjectId(id) }, { id: id }] };
            }
            return await this.listanimalcollection.findOne(filter);
        } catch (error) {
            throw new Error("Lỗi khi lấy listanimal theo ID: " + error.message);
        }
    }
    async createListAnimal(listanimalData){
        try {
            if (!listanimalData.id) {
                throw new Error("id là bắt buộc.");
            }
            
            // Kiểm tra trùng lặp id
            const existingListAnimal = await this.listanimalcollection.findOne({ id: listanimalData.id });
            if (existingListAnimal) {
                throw new Error("id đã tồn tại. Vui lòng chọn id khác.");
            }

            var result = await this.listanimalcollection.insertOne(listanimalData);
            return { ...listanimalData, _id: result.insertedId };
        } catch (error) {
            throw new Error("Lỗi khi tạo listanimal: " + error.message);
        }
    }
    async updateListAnimal(id, listanimalData){
        try {
            let filter = { id: id };
            if (ObjectId.isValid(id)) {
                filter = { $or: [{ _id: new ObjectId(id) }, { id: id }] };
            }
            var result = await this.listanimalcollection.updateOne(filter, { $set: listanimalData });
            if (result.matchedCount === 0) {
                throw new Error("Không tìm thấy listanimal để cập nhật.");
            }
            return { ...listanimalData, _id: id };
        } catch (error) {
            throw new Error("Lỗi khi cập nhật listanimal: " + error.message);
        }
    }
    async deleteListAnimal(id){
        try {
            let filter = { id: id };
            if (ObjectId.isValid(id)) {
                filter = { $or: [{ _id: new ObjectId(id) }, { id: id }] };
            }
            var result = await this.listanimalcollection.deleteOne(filter);
            if (result.deletedCount === 0) {
                throw new Error("Không tìm thấy listanimal để xóa.");
            }
        } catch (error) {
            throw new Error("Lỗi khi xóa listanimal: " + error.message);
        }
    }
}

module.exports = ListAnimalService;