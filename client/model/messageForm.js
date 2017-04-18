import m from 'mithril';
import EventEmitter from 'events';

class MessageForm extends EventEmitter{
    constructor() {
        super();
        this._text = [];
    }

    get text() {
        return this._text;
    }

    set text(text) {
        this._text = text;
    }
}

module.exports = MessageForm;