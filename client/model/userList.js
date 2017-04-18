import m from 'mithril';
import EventEmitter from 'events';


class UserList extends EventEmitter{
    constructor() {
        super();
        this._messages = {};
    }

    addUser(user) {
        this._messages[user.id] = user;
    }

    removeUserById(id) {
        if (id in this._messages) {
            delete this._messages[id];
        }
    }

    set list(list) {
        this._messages = list;
    }

    get list() {
        return this._messages;
    }
}

module.exports = UserList;