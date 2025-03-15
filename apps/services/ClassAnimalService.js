const { ObjectId } = require("mongodb");
const config = require("../config/setting.json");

class ClassAnimalService {
    client;
    classanimalDatabase;
    classanimalcollection;
    constructor(){
        this.databaseconnection = require("../database/database");
        this.client = this.databaseconnection.getMongoClient();
        this.classanimalDatabase = this.client.db(config.mongodb.database);
        this.classanimalcollection = this.classanimalDatabase.collection("classanimals");
    }
    async getAllClassAnimal(){
        const cursor = this.classanimalcollection.find().limit(100);
        return await cursor.toArray();
    }
    async getClassAnimalById(id){
        try {
            let filter = { classanimals_id: id };
            if (ObjectId.isValid(id)) {
                filter = { $or: [{ _id: new ObjectId(id) }, { classanimals_id: id }] };
            }
            return await this.classanimalcollection.findOne(filter);
        } catch (error) {
            throw new Error("Lỗi khi lấy classanimal theo ID: " + error.message);
        }
    }
    async createClassAnimal(classanimalData){
        try {
            if (!classanimalData.classanimals_id) {
                throw new Error("classanimals_id là bắt buộc.");
            }
            
            // Kiểm tra trùng lặp classanimals_id
            const existingClassAnimal = await this.classanimalcollection.findOne({ classanimals_id: classanimalData.classanimals_id });
            if (existingClassAnimal) {
                throw new Error("classanimals_id đã tồn tại. Vui lòng chọn id khác.");
            }

            var result = await this.classanimalcollection.insertOne(classanimalData);
            return { ...classanimalData, _id: result.insertedId };
        } catch (error) {
            throw new Error("Lỗi khi tạo classanimal: " + error.message);
        }
    }
    async updateClassAnimal(id, classanimalData){
        try {
            let filter = { classanimals_id: id };
            if (ObjectId.isValid(id)) {
                filter = { $or: [{ _id: new ObjectId(id) }, { classanimals_id: id }] };
            }
            var result = await this.classanimalcollection.updateOne(filter, { $set: classanimalData });
            if (result.matchedCount === 0) {
                throw new Error("Không tìm thấy classanimal để cập nhật.");
            }
            return { ...classanimalData, _id: id };
        } catch (error) {
            throw new Error("Lỗi khi cập nhật classanimal: " + error.message);
        }
    }
    async deleteClassAnimal(id){
        try {
            let filter = { classanimals_id: id };
            if (ObjectId.isValid(id)) {
                filter = { $or: [{ _id: new ObjectId(id) }, { classanimals_id: id }] };
            }
            var result = await this.classanimalcollection.deleteOne(filter);
            if (result.deletedCount === 0) {
                throw new Error("Không tìm thấy classanimal để xóa.");
            }
            return { message: "Xóa classanimal thành công." };
        } catch (error) {
            throw new Error("Lỗi khi xóa classanimal: " + error.message);
        }
    }

}

module.exports = ClassAnimalService;