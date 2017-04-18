import m from 'mithril';
import EventEmitter from 'events';

class User extends EventEmitter {
    constructor(socket) {
        super();
        this._socket = socket;
        this._authenticated = false;
        this._profile = null;
    }

    onAuthenticated(event) {
        this.sid = event.sid;
        this._profile = event.profile;
        this._authenticated = true;
    }

    authenticate() {
        if (this.sid) {
            console.log('Authentication request', this.sid);
            this._socket.emit('authenticate', this.sid);
        }
    }

    set sid(sid) {
        if (!sid) {
            this._authenticated = false;
            window.localStorage.removeItem('sid');
            return;
        }
        window.localStorage.sid = sid;
    }

    get sid() {
        return window.localStorage.sid;
    }

    get profile() {
        return this._profile;
    }

    get authenticated() {
        return this._authenticated;
    }
}

module.exports = User;