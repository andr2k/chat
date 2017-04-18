import m from 'mithril';
import EventEmitter from 'events';

class AppWindow extends EventEmitter{
    constructor(socket, messageList, messageForm, userList)
    {
        super();
        this._messageList = messageList;
        this._messageForm = messageForm;
        this._userList = userList;
        this._socket = socket;
    }
    view (vnode) {
        if (!this._socket.connected) return (
            <div class="container-fluid">
                <div class="page-header"><h1>Connecting to server...</h1></div>
            </div>
        );
        return (
            <div class="container-fluid">
                <div class="page-header"><h1>Group Chat</h1></div>
                <div class="row">
                    <div class="col-sm-9 message-list-container">
                        <this._messageList />
                        <this._messageForm />
                    </div>
                    <div class="col-sm-3 user-list-container">
                        <this._userList />
                    </div>
                </div>
            </div>
        )
    }
}

module.exports = AppWindow;