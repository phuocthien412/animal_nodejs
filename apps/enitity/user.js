const { ObjectId } = require('mongodb');
const ROLES = require('../constants/roles');

class User {
    constructor(data = {}) {
        this._id = data._id ? new ObjectId(data._id) : new ObjectId();
        this.id_user = data.id_user || '';
        this.username = data.username || '';
        this.password = data.password || '';
        this.email = data.email || '';
        this.fullname = data.fullname || '';
        this.role = this.validateRole(data.role) ? data.role : ROLES.USER;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.lastLogin = data.lastLogin || null;
        this.isActive = data.isActive !== undefined ? data.isActive : true;
    }

    validateRole(role) {
        return Object.values(ROLES).includes(role);
    }

    isAdmin() {
        return this.role === ROLES.ADMIN;
    }

    isModerator() {
        return this.role === ROLES.MODERATOR;
    }

    hasRole(role) {
        return this.role === role;
    }
    update(data) {
        Object.assign(this, data);
        this.updatedAt = new Date();  // Cập nhật thời gian mỗi khi chỉnh sửa
    }
}

module.exports = User;