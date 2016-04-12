
var fs = require("fs");
var express = require('express');
//var bodyParser = require("body-parser");
var app = express();
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) { 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/4513Assignment2');
var db = mongoose.connection; 
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', function callback () { 
    console.log("connected");

    var Production = new mongoose.Schema({
        status: String,
        binding: String,
        size: String,
        pages: Number,
        instock: String
    });

    var Category = new mongoose.Schema({
        main: String,
        secondary: String
    });


    var bookSchema = new mongoose.Schema({ 
        id: String, 
        isbn10: String, 
        isbn13: String, 
        title: String, 
        year: Number,
        publisher: String,
        production: [Production],
        category: [Category]
    });
    
    

var Book = mongoose.model('Book',bookSchema);    

    
    
    
app.get('/api/books', function(req, resp) {
    
    Book.find({}, function(err, data) { 
    if (err) { 
        console.log('error finding all books'); 
        resp.json({ message: 'Unable to connect to books' }); 
        
    } 
    else { resp.json(data); } 
    });
});


app.get('/api/books/:isbn', function(req, resp) {
    
    Book.find({}, function(err, data) { 
        if (err) { 
            console.log('error finding all books'); 
            resp.json({ message: 'Unable to connect to books' }); 
        } 
        else { 
            var convData = data;
            var GET_ISBN_Val = req.params.isbn;
        
            for (var i in convData) {
                if (convData[i]["isbn10"] == GET_ISBN_Val) {
                    //console.log(convData[i]);
                    resp.send(convData[i]);
                }
            }
        } 
    });
});   
    
    
    
    
    
}); //end of callback function



app.listen(8080);



console.log("Server Running");




