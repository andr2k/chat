import m from 'mithril';
import EventEmitter from 'events';

class UserList extends EventEmitter {
    constructor(users) {
        super();
        this._messages = users;
        return this;
    }

    view(vnode) {

        let users = this._messages.list;

        return (
            <div>
                <h2>User List</h2>
                <ul class="user-list">
                    {((users)=>{
                        let rows = [];
                        for(let key in users) {
                            rows.push(<li>{users[key].username}</li>);
                        }
                        return rows ? rows : <p>No authenticated users.</p>;
                    })(users)}
                </ul>
            </div>
        );
    }
}

module.exports = UserList;