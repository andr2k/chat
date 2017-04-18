class AuthUsers {
    constructor() {
        this._messages = {};
        this._sockets = {};
    }

    addUser(user, socket) {
        if (user.id in this._messages) {
            this._sockets[user.id].push(socket);
            return;
        }
        this._messages[user.id] = user;
        this._sockets[user.id] = [socket];
    }

    getUserBySocket(socket) {
        for(let key in this._sockets) {
            let index = this._sockets[key].indexOf(socket);
            if(index > -1) {
                return this._messages[key].user;
            }
        }
    }

    userExists (user) {
        return user.id in this._messages;
    }

    removeSocket(socket) {
        for(let key in this._sockets) {
            let index = this._sockets[key].indexOf(socket);
            if(index > -1) {
                this._sockets[key].splice(index, 1);
            }
            if (!this._sockets[key].length) {
                delete this._messages[key];
                delete this._sockets[key];
            }
        }
    }

    get list() {
        return this._messages;
    }
}

module.exports = AuthUsers;