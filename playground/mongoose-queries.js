const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
// const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// const _id = '589ec13eb52e030c56cc85b211'; 589c24ec124593099bf38c74
const _id = '589c24ec124593099bf38c74'; 
if (!ObjectId.isValid(_id)) {
    console.log('_id not valid: ');
}

// Todo.find({
//     _id
// }).then((todos) => {
//     console.log('Todos: ', todos);
// });

// Todo.findOne({
//     _id
// }).then((todo) => {
//     console.log('Todo: ', todo);
// });

// Todo.findById({
//     _id
// }).then((todo) => {
//     if (!todo) {
//         return console.log('No todo _id found: ');
//     }
//     console.log('Todo by _id: ', todo);
// }).catch((err) => console.log('Error occured: ', err));

User.findById({
    _id
}).then((user) => {
    if (!user) {
        return console.log('No user _id found: ');
    }
    console.log('User by _id: ', JSON.stringify(user));
}).catch((err) => console.log('Error occured: ', err));