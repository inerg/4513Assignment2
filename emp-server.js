var parser = require('body-parser');
var mg = require('mongoose');
var express = require('express');

var app = express();

//Modify the web service and add in CORS headers
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", 
                 "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); 

app.use(parser.json());

app.use(parser.urlencoded({
    extended: true
}));

//Mongoose connect to mongodb
mg.connect('mongodb://localhost:27017/assign2'); //employee server is called emp
//to make db via terminal use:
//mongoimport --db emp --collection employees --drop --file employees.json

var db = mg.connection; 
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', function callback () { 
    console.log("connected");
});

//Schema for employees
//first name, username and password are what is needed
var employeeSchema = new mg.Schema({
    employee:
    {
        id: Number,
        guid: String,
        firstname: String,
        lastname: String,
        username: String,
        password: String,
        salt: String,
        todo: [{
            _id: false,
            id: Number,
            status: String,
            priority: String,
            date: Date,
            description: String
        }],
        messages: [{
            id: Number,
            contact: {
                firstname: String,
                lastname: String,
                university: {
                    id: Number,
                    name: String,
                    address: String,
                    city: String,
                    state: String,
                    zip: String,
                    website: String,
                    latitude: Number,
                    longitude: Number
                },
            date: Date,
            category: String,
            content: String
            }
        }],
        books: [{
            id: Number,
            isbn10: String,
            isbn13: String,
            title: String,
            category: String
        }],
    },
});

//compile the database of employees onto the schema
var Employee = mg.model('Employee', employeeSchema);

//Route: /api/employee
//Fetches all users: Currently not used
app.route('/api/employees')
.get(function (req, resp) {
    console.log("Saw Request");
    resp.setHeader('Content-Type', 'application/json');
    Employee.find({}, function(err, data) { 
        if (err) { 
            console.log('error finding all employees'); 
            resp.json({ message: 'Unable to connect to employees' }); 
        } else { 
            resp.send(data);
        } 
    });
});


//Route: /api/employees/:usn
//Fetches one user's data
app.route('/api/employees/:usn')
.get(function (req, resp){
    //saves parameter of employee username
    var usernameData = req.params.usn;
    var usernameFound = 0;
    //checks to see if the employee exists in database via search
    Employee.find({'employee.username': usernameData}, function (err, theemployee) {
        if (err) {
            resp.json(usernameFound);
        } 
        else if (theemployee == '') {
            resp.json(usernameFound);
        } else {
            resp.json(theemployee);
        }
    });
});

//Route: /api/employees/:usn/todoadd
//adds a todo to the user/
//Tested a little bit by josh. Doesn't do any error checking
app.route('/api/employees/:usn/todoadd/:id/:stts/:prio/:desc')
.get(function (req,resp){
    //saves username so we know who to add the todo thing to
    var usernameData = req.params.usn;
    //if the app itself would fetch the last id of the todo so you can
    //insert it from the backend that would be nice
    //fetches current date
    var dateObj = new Date(); 
    var month = dateObj.getUTCMonth() + 1; //months from 1-12 
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    
    var newdate = month + "/" + day + "/" + year;
    var todo = {
        id: req.params.id,
        stats: req.params.stts,
        priority: req.params.prio,
        date: newdate,
        desc: req.params.desc,
    }
    
    Employee.update({'employee.username': usernameData}, 
    {
    $push: { 
        'employee.todo': { 
                id: todo.id, 
                status: todo.stats, 
                priority: todo.priority, 
                date: todo.date, 
                description: todo.desc 
            }
        }
    },function(err, numAffected){
        console.log(err);
        console.log(numAffected);
    });
});

//Route: /api/employees/:usn/todoedit/:id/:stts/:prio/:desc
//modifies a todo
app.route('/api/employees/:usn/todoedit/:id/:stts/:prio/:desc')
.get(function (req,resp){
    //saves username so we know who to modify the todo for
    var usernameData = req.params.usn;
    var todoId = req.params.id;
    var todoStatus = req.params.stts;
    var todoPriority = req.params.prio;
    var todoDesc = req.params.desc;
    //console.log(req.params);
    //fetches current date
    var dateObj = new Date(); 
    var month = dateObj.getUTCMonth() + 1; //months from 1-12 
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    
    var newdate = month + "/" + day + "/" + year;
    
    //console.log(usernameData + ' ' + todoId + ' ' + todoStatus + ' ' + todoPriority + ' ' + todoDesc);

      
    Employee.update({'employee.username': usernameData, 'employee.todo.id': todoId },
    { $set: 
        { 
            'employee.todo.$.status': todoStatus,
            'employee.todo.$.priority': todoPriority,
            'employee.todo.$.description': todoDesc
        }
        
    },{ multi: true},
        function(err, numAffected){
        console.log(err);
        console.log(numAffected);
    });
});


//todo delete function
app.route('/api/employees/:usn/tododel/:id')
.get(function (req,resp){
    var usernameData = req.params.usn;
    var todoid = req.params.id;
    
    Employee.update({'employee.username': usernameData}, 
    {
        $pull:
        {
            'employee.todo': {
                'id':todoid
            }
        }
    
    },function(err, numAffected){
        console.log(err);
        console.log(numAffected);
    });
});

//Tells it what port to run in
//process.env.PORT is port 8080, 8081 causes glitches
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    console.log('Example app listening on port 3000!');
});

//Terminal Instructions:
//Terminal 1: mongod
//Terminal 2: node emp-server.js

//Collection: employee
//Database: emp
//URL: https://assign2-hlobos.c9users.io/