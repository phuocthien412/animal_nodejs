const { ObjectId } = require('mongodb');

class ClassAnimal {
    constructor(data) {
        if (!data) data = {};
        this._id = data._id ? new ObjectId(data._id) : new ObjectId();b
        this.classanimals_id = data.classanimals_id || '';
        this.background_video = data.background_video || '';
        this.info = data.info || '';
        this.name = data.name || '';

    }
}

module.exports = ClassAnimal;