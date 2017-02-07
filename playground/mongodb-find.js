// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var user = {name: 'Jason Marshall', age: 37};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to mongodb server');     
    }     
    console.log('Connected to mongodb server');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5896ef38e5e8d104c1451a25')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unabe to fetch Todos', err);
    // });

    // db.collection('Todos').find({}).count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log('Unabe to fetch Todos count', err);
    // });

     db.collection('Users').find({name: 'Jason Marshall'}).count().then((count) => {
        console.log(`Todos count: ${count}`);
    }, (err) => {
        console.log('Unabe to fetch Todos count', err);
    });


    // db.close();
});

// db.Users.insert({name: 'jenson', age: 46});



// db.Todos.insert({
//    text: 'Eat Lunch',
//    completed: false
// });


// db.Todos.update({"_id" : ObjectId("589830ba5d0e4f8e776dfad3")}, {text: 'Walk the dog', completed: true});