// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb').MongoClient;

// var user = {name: 'Jason Marshall', age: 37};
// var {name} = user;

console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to mongodb server');     
    } 
    
    console.log('Connected to mongodb server');

    // db.collection('Todos').insertOne({
    //     text: 'Something todo',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo: ', err);     
    //     } 

    //     console.log(JSON.stringify(result.ops, undefined, 2));

    // });

    // db.collection('Users').insertOne({
    //     // _id: 123,
    //     name: 'Jason Marshall',
    //     age: 37,
    //     location: 'Wellington',
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert user: ', err);     
    //     } 
    //     console.log(result.ops[0]._id.getTimestamp());
    //     // console.log(JSON.stringify(result.ops, undefined, 2));

    // });

    db.close();
});