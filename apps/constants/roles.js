const ROLES = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    USER: 'user'
};

Object.freeze(ROLES); // Make the roles object immutable

module.exports = ROLES;