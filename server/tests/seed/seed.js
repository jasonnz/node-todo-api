// es6 destructoring
const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {User} = require('./../../models/user');
const {Todo} = require('./../../models/todo');

const uset1ID = new ObjectId();
const uset2ID = new ObjectId();

const users = [{
    _id: uset1ID,
    email: 'jason@example.com',
    password: 'uSeRonePaSs',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: uset1ID,  access: 'token'}, 'abc123').toString()
    }]
}, {
    _id: uset2ID,
    email: 'jburger@example.com',
    password: 'uSeRtwoPaSs',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: uset2ID,  access: 'token'}, 'abc123').toString()
    }]
}];

const todos = [
{
    _id: new ObjectId(),
    text: 'First test Todo',
    _creator: uset1ID
}, {
    _id: new ObjectId(),
    text: 'Second test Todo',
    completed: true,
    completedAt: 1234,
    _creator: uset2ID
}];

const populateTodos = () => {
    Todo.remove({}).then(()=> {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(()=> {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(()=> done());
};

module.exports = {todos, populateTodos, users, populateUsers};

