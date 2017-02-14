var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {ObjectId} = require('mongodb');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

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
        
        console.log('todo FOUND by _id: ', todo);
        res.status(200).send(todo);
        console.log('res.body.todo = ', res.body);
    }).catch((err) => {
        console.log('Processing error has occured!');
        res.status(400).send(err)
    });

});

// GET /todos/1234
app.delete('/todos/:id', (req, res) => {
    // res.send(req.params);
    var id = req.params.id;
    
    if (!ObjectId.isValid(id)) {
        console.log('id not valid: ');
        return res.status(404).send();
    } 

    Todo.findByIdAndRemove({_id: id}).then((todo) => {
        
        if (!todo) {
            console.log('No todo _id found!');
            return res.status(404).send();
        }
        
        console.log('todo FOUND by _id: ', todo);
        res.status(200).send({todo});
    }).catch((err) => {
        console.log('Processing error has occured!');
        res.status(400).send(err)
    });

});

app.listen(port, ()=> {
    console.log('Started at port ', port);
});

module.exports = {app};