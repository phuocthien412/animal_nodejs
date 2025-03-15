const {ObjectId} = require('mongodb');

class ListAnimals {
    constructor(data) {
        if (!data) data = {};
        this._id = data._id ? new ObjectId(data._id) : new ObjectId();
        this.id = data.id || '';
        this.animalimage = data.animalimage || '';
        this.id_animal = data.id_animal || '';
        
    }
}

module.exports = ListAnimals;