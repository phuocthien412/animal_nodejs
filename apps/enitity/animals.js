const { ObjectId } = require('mongodb');

class animals {
    constructor(data) {
        if (!data) data = {};
        this._id = data._id ? new ObjectId(data._id) : new ObjectId();
        this.id_animal = data.id_animal || '';
        this.avatar = data.avatar || '';
        this.gioi_thieu_text = data.gioi_thieu_text || '';
        this.imgqr3d = data.imgqr3d || '';
        this.ngoai_hinh_text = data.ngoai_hinh_text || '';
        this.noi_sinh_song_image = data.noi_sinh_song_image || '';
        this.noi_sinh_song_text = data.noi_sinh_song_text || '';
        this.name = data.name || '';
        this.classanimals_id = data.classanimals_id || '';
    }

}

module.exports = animals;