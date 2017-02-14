const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const id = '58a2cbebb8f36d0772b0589d'; 
if (!ObjectId.isValid(id)) {
    console.log('_id not valid: ');
}

// Todo.remove({}).then((result) => {
//     console.log('Result: ', result);
// });


Todo.findByIdAndRemove({_id: id}).then((todo) => {
    console.log('Result: ', todo);
});

