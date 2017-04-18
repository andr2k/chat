import m from 'mithril';
import EventEmitter from 'events';

class MessageForm extends EventEmitter{
    constructor(user, formModel) {
        super();
        this._formModel = formModel;
        this._user = user;
        this._listeners = new Map();
        return this;
    }

    loginClick() {
        console.log('Sign In To Join clicked');
        this.emit('loginClick');
    }

    sendClick(ev) {
        console.log('Send Message clicked');
        this.emit('sendClick');
    }

    setText(text) {
        this._formModel.text = text;
        m.redraw();
    }

    isSendButtonEnabled() {
        return this._formModel.text.length > 0;
    }

    view(vnode) {
        if (this._user.authenticated)
            return (
                <div class="send-box">
                    <input type="text" oninput={m.withAttr('value', this.setText.bind(this))} value={this._formModel.text}></input>
                    <button class="btn" onclick={this.sendClick.bind(this)} disabled={!this.isSendButtonEnabled()}>Send Message</button>
                </div>
            );

        return (
            <div class="send-box">
                <button class="btn btn-lg btn-info" onclick={this.loginClick.bind(this)}>Sign In with Twitter</button>
            </div>
        );
    }
}

module.exports = MessageForm;