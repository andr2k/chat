import m  from 'mithril';

import MessageFormComponent from './component/messageForm';
import AppWindowComponent from './component/appWindow';
import MessageListComponent from './component/messageList';
import UserListComponent from './component/userList';

import User from './model/user';

import MessageFormModel from './model/messageForm';
import MessageListModel from './model/messageList';
import UserListModel from './model/userList';

import IO from 'socket.io-client';

let messageList = new MessageListModel();
let userList = new UserListModel();
let messageForm = new MessageFormModel();

let socket = IO('http://localhost:3000');

let user = new User(socket);

let messageListComponent = new MessageListComponent(messageList);
let messageFormComponent = new MessageFormComponent(user, messageForm);
let userListComponent = new UserListComponent(userList);
let appWindowComponent = new AppWindowComponent(socket, messageListComponent, messageFormComponent, userListComponent);

messageFormComponent.on('loginClick', () => {
    let authWindow = window.open('http://127.0.0.1:3000/login/twitter', 'auth.chat.kravchenko.cc', 'menubar=0, titlebar=0');
    window.oauthCallback = function (sid) {
        console.log('Obtained sid', sid);
        user.sid = sid;
        user.authenticate();
        authWindow.close();
    }
});

messageFormComponent.on('sendClick', () => {
    let text = messageForm.text.trim();
    if (text.length) {
        socket.emit('new message', text);
        messageForm.text = '';
        m.redraw();
    }
});

socket.on('new message', (message) => {
    console.log('new message', message);
    messageList.addMessage(message);
    m.redraw();
});

socket.on('disconnect', () => {
    console.log('Disconnected');
    m.redraw();
});

socket.on('connect', () => {
    console.log('Connected');
    user.authenticate();
    m.redraw();
});

socket.on('all users', (users) => {
    console.log('all users', users);
    userList.list = users;
    m.redraw();
});

socket.on('authenticated', (event) => {
    console.log('authenticated', event)
    user.onAuthenticated(event);
    m.redraw();
});

socket.on('auth error', () => {
    console.log('auth error');
    user.sid = null;
});

socket.on('new user', (user) => {
    console.log('new user', user);
    userList.addUser(user);
    m.redraw();
});

socket.on('user gone', (userId) => {
    consolle.log('user gone', userId);
    userList.removeUser(userId);
    m.redraw();
})

m.mount(document.body, appWindowComponent);
