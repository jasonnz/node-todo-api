// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to mongodb server');     
    }     
    console.log('Connected to mongodb server');

    // deleteMany Todos
    // db.collection('Todos').deleteMany({text: 'Eat Lunch'}).then((result) => {
    //     console.log('Success: ', result);
    // }, (err) => {
    //     console.log('Erromr: ', result);
    // });

    // deleteMany Users
    db.collection('Users').deleteMany({name: 'Jason Marshall'}).then((result) => {
        console.log('Success: ', result);
    }, (err) => {
        console.log('Erromr: ', result);
    });

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat Lunch'}).then((result) => {
    //     console.log('Success: ', result);
    // });
    
    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log('Success: ', result);
    // });

    // findOneAndDelete Users
    db.collection('Users').findOneAndDelete({
        // _id: new ObjectID('123')
        _id: '123'
    }).then((result) => {
        console.log('Success: ', result);
    });
    

    // db.close();
});

