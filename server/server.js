var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {ObjectId} = require('mongodb');
var {Todo} = require('./models/Todo');
var {User} = require('./models/User');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    // console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });                                        
    }, (err) => {
        res.status(400).send(err);
        console.log(err)
    });
});

// GET /todos/1234
app.get('/todos/:id', (req, res) => {
    // res.send(req.params);
    var id = req.params.id;
    
    if (!ObjectId.isValid(id)) {
        console.log('id not valid: ');
        return res.status(404).send();
    } 

    Todo.findById({_id: id}).then((todo) => {
        if (!todo) {
            console.log('No todo _id found!');
            return res.status(404).send();
        }
        console.log('todo by _id: ', JSON.stringify(todo));
        res.status(200).send(JSON.stringify(todo));
    }).catch((err) => {
        console.log('Processing error has occured!');
        res.status(400).send(err)
    });

});

app.listen(3000, ()=> {
    console.log('Started on port 3000');
});

module.exports = {app};