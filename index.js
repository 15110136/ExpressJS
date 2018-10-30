const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json')
const db = lowdb(adapter)

let port = 5000;

// Set some defaults (required if your JSON file is empty)
db.defaults({
    users: []
  })
  .write();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

// parse application/json
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res, next) => {
  res.render('index', {
    name: 'thong'
  });
});

app.get('/users', (req, res, next) => {
  res.render('users/index', {
    users: db.get('users').value()
  });
});

app.get('/users/search', (req, res) => {
  var q = req.body;
  var match = db.get('users').find({
    name: 'Thong'
  }).value();

  res.render('users/index', {
    users: match.name
  });
});

app.get('/users/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let user = db.get('users').find({
    id: id
  }).value();

  res.render('users/view', {
    user: user
  });
});

app.get('/users/create', (req, res) => {
  res.render('users/create');
});
app.post('/users/create', (req, res) => {
  db.get('users').push(req.body).write();
  res.redirect('/users');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});