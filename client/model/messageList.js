import m from 'mithril';
import EventEmitter from 'events';

class MessageList extends EventEmitter{
    constructor() {
        super();
        this._messages = [];
    }

    set list(list) {
        this._messages = list;
    }

    get list() {
        return this._messages;
    }

    addMessage(message) {
        this._messages.push(message);
    }
}

module.exports = MessageList;