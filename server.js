var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ProgLang', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'ProgLang.html'));
});

app.get('/FavAuthrs', function (req, res) {
  res.send('R.K. Narayan and P.G.Wodehouse are my all time favourtie authors');
});

app.get('/Databases', function (req, res) {
  res.send('Experienced DB2 programmer using SQL in COBOL on Mainframes');
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
