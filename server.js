"use strict";
let express = require('express'),
    app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));

// initial data structure to serve:
let data = {
    customers: [
        {name: 'Fred', limit: 1000},
        {name: 'Jim', limit: 800}
    ],
   
    animals: [
        {species: 'Lion', carnivore: true},
        {species: 'Horse', carnivore: false}
    ]
};

app.get('/', function(req, res){
    let rv = [];
    for (let k in data) {
        if (data.hasOwnProperty(k)) {
            rv.push('/' + k);
        }
    }
    res.set('Access-Control-Allow-Origin', '*');
    res.status(200);
    res.json(rv);
});

app.get('/:key', function(req, res){
    let key = req.params.key;
    let status = 404;
    let rv = [];
    if (data[key] !== undefined) {
        status = 200;
        rv = data[key];
    }
    res.set('Access-Control-Allow-Origin', '*');
    res.status(status);
    res.json(rv);
});

app.get('/:key/:id', function(req, res) {    
    let id = parseInt(req.params.id);
    let key = req.params.key;
    console.log('GET /' + key + '/' + id);
    res.set('Access-Control-Allow-Origin', '*');
    res.json(data[key][id]);
});

app.post('/:key', function(req, res) {
    let key = req.params.key;
    console.log('POST /' + key + ' body is ' + JSON.stringify(req.body));
    let id = data[key].length;
    data[key][id] = req.body;
    res.set('Location', '/' + key + '/' + id);
    res.status(201);
    res.set('Access-Control-Allow-Origin', '*');
    res.send();
});

app.put('/:key/:id', function(req, res) {
    let id = parseInt(req.params.id);
    let key = req.params.key;
    console.log('PUT /' + key + '/' + id + ' body is ' + JSON.stringify(req.body));
    let status = 404;
    if (id < data[key].length) {
        data[key][id] = req.body;
        status = 200;
    }
    res.status(status);
    res.set('Access-Control-Allow-Origin', '*');
    res.send();
});

app.delete('/:key/:id', function(req, res) {
    let id = parseInt(req.params.id);
    let key = req.params.key;
    console.log('DELETE /' + key + '/' + id);
    let status = 404;
    if (id < data[key].length) {
        data[key].splice(id, 1);
        status = 204;
    }
    res.status(status);
    res.set('Access-Control-Allow-Origin', '*');
    res.send();
});

app.options('/*', function(req, res){
    console.log('options...');
    res.status(200);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Method', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.send();
});

app.listen(8080);

console.log('Express listening on port 8080');
