import m from 'mithril';
import EventEmitter from 'events';

class MessageList extends EventEmitter {
    constructor(messageList) {
        super()
        this._messages = messageList;
        return this;
    }

    view(vnode) {

        let messages = this._messages.list;

        return (
            <div>
                <h2>Messages</h2>
                <div class="message-list">

                        {((messages) => {
                            let rows = [];
                            for (let i in messages) {
                                rows.push(
                                    <p class="message">
                                        <span class="user-name">{messages[i].username}</span>:&nbsp;
                                        <span class="message-text">{messages[i].text}</span>
                                    </p>
                                );
                            }
                            return rows;
                        })(messages)}
                </div>
            </div>
        );
    }
}

module.exports = MessageList;