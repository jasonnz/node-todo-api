
require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

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

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

     if (!ObjectId.isValid(id)) {
        console.log('id not valid: ');
        return res.status(404).send();
    } 

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});

    }).catch((e) => {
        res.status(400).send();
    });

});

//USERS
app.post('/users', (req, res) => {
    console.log(req.body);
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    console.log("New User Body: ", user);

    user.save().then(() => {
       return user.generateAuthToken();
        // res.send(doc);
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

//Uses authenticate middleware defined above
app.get('/users/me', authenticate, (req, res) => {  
    res.send(req.user);
});

app.listen(port, ()=> {
    console.log('Started at port ', port);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then((user)=> {    
        
        return user.generateAuthToken().then((token)=> {
            res.header('x-auth', token).send(user);
        });

    //   res.send(body);
    }).catch((err)=> {
       res.status(400).send(err);
    });

    //res.send(body);
});

app.delete('/users/me/token', authenticate, (req, res)=> {
    req.user.removeToken(req.token).then(()=> {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

module.exports = {app};