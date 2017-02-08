// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to mongodb server');     
    }     
    console.log('Connected to mongodb server');
    
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('589992ebb6817b79583dcc0f')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result)=> {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('58983974ae035b7c04b5545c')
    }, {
        $set: {
            name: 'george'
        },
        $inc: { 
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result)=> {
        console.log(result);
    });

    db.close();
});
