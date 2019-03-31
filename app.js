const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', (request, response) => {
  response.render("index");
});

app.get('/login', (request, response) => {
  response.render("login");
});

app.post('/login', (request, response) => {
  console.log(request.body.email, request.body.password);
  response.send("received login request! email:"+request.body.email+" password:"+request.body.password);
});

app.get('/signup', (request, response) => {
  response.render("signup");
});

app.post('/signup', (request, response) => {
  console.log(request.body.email, request.body.password);
  response.send("received signup request! email:"+request.body.email+" password:"+request.body.password);
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
